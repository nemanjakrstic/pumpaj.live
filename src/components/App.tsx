import { Badge, Box, Button } from "@mantine/core";
import { useThrottledCallback } from "@mantine/hooks";
import {
  circle,
  difference,
  feature,
  featureCollection,
  round,
  union,
} from "@turf/turf";
import { AttributionControl, LngLatBounds, Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import serbia from "../geojson/serbia.json";
import { useAnimationFrame } from "../hooks/useAnimateFrame";
import { mapStyle } from "../map";
import { socket } from "../socket";
import { useStore } from "../store";
import { Location } from "../types/Location";
import { Layout } from "./Layout";
import { SettingsModal } from "./SettingsModal";
import { WelcomeModal } from "./WelcomeModal";
import { RaiseAwarenessModal } from "./RaiseAwarenessModal";

const MIN_ZOOM = 1;
const MAX_ZOOM = 10;
const RETRACT_VELOCITY = 750;
const PUMP_VELOCITY = 100;
const MAX_RADIUS = 200_000;

type PumpCollection = Record<string, number>;

export const App = () => {
  const mapRef = useRef<Map>(null);
  const pumpsRef = useRef<PumpCollection>({});
  const [pumpers, setPumpers] = useState(0);
  const currentLocation = useStore((state) => state.location);
  const acknowledged = useStore((state) => state.acknowledged);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRaiseAwarenessModal, setShowRaiseAwarenessModal] = useState(false);
  const [pumpCount, setPumpCount] = useState(0);

  useAnimationFrame(true, () => {
    if (mapRef.current) {
      retractRadiuses(pumpsRef.current);
      updateSerbiaMask(mapRef.current, pumpsRef.current);
    }
  });

  const handlePumpClick = useThrottledCallback(() => {
    setPumpCount((count) => count + 1);
    socket.emit("pump", currentLocation);
    pump(currentLocation, pumpsRef.current);

    if (mapRef.current) {
      updateSerbiaMask(mapRef.current, pumpsRef.current);
    }
  }, 100);

  useEffect(() => {
    if (pumpCount === 10) {
      setShowRaiseAwarenessModal(true);
    }
  }, [pumpCount]);

  useEffect(() => {
    socket.on("init", (data: { pumpers: number }) => {
      setPumpers(data.pumpers);
    });

    socket.on("pump", (data: { pumpers: number; location: Location }) => {
      // console.log("pump", JSON.stringify(data));
      pump(data.location, pumpsRef.current);
      setPumpers(data.pumpers);
    });

    return () => {
      socket.off("init");
      socket.off("pump");
    };
  }, [currentLocation]);

  useEffect(() => {
    const map = new Map({
      container: "map",
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      style: mapStyle,
      center: [20.0, 44.0], // Serbia
      zoom: MIN_ZOOM,
      attributionControl: false,
    });

    map.addControl(new AttributionControl(), "top-right");

    map.on("load", () => {
      mapRef.current = map;

      map.addSource("world-mask", {
        type: "geojson",
        data: worldMask as GeoJSON.GeoJSON,
      });

      map.addLayer({
        id: "world-mask-layer",
        source: "world-mask",
        type: "fill",
        paint: { "fill-color": "#000000", "fill-opacity": 0.525 },
      });

      map.addSource("serbia-mask", {
        type: "geojson",
        data: serbiaFeature as GeoJSON.GeoJSON,
      });

      map.addLayer({
        id: "serbia-mask-layer",
        source: "serbia-mask",
        type: "fill",
        paint: { "fill-color": "#000000", "fill-opacity": 0.925 },
      });
    });

    // map.on("click", (e) => {
    //   console.log(e.lngLat);
    // });

    return () => map.remove();
  }, []);

  const fitBounds = () => {
    mapRef.current?.fitBounds(getInitialBounds(), {
      padding: 50,
      maxZoom: MAX_ZOOM,
      duration: 1000,
    });
  };

  const handleSettingsButtonClick = () => {
    setShowSettingsModal(true);
  };

  return (
    <Layout
      onFocusButtonClick={fitBounds}
      onSettingsButtonClick={handleSettingsButtonClick}
    >
      <WelcomeModal
        onClose={() => {
          if (!acknowledged) {
            setShowSettingsModal(true);
          } else {
            fitBounds();
          }
        }}
      />

      <RaiseAwarenessModal
        opened={showRaiseAwarenessModal}
        onClose={() => setShowRaiseAwarenessModal(false)}
      />

      <SettingsModal
        opened={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          fitBounds();
        }}
      />

      <Box id="map" h="calc(100vh - 60px)" />

      <Box pos="fixed" top={60} left={0} p="xs">
        <Badge color="green">Online pumpača: {pumpers}</Badge>
      </Box>

      <Box
        pos="fixed"
        bottom={0}
        w="100%"
        p="md"
        display="flex"
        style={{ justifyContent: "center" }}
      >
        <Button color="red" fw={900} size="xl" onClick={handlePumpClick}>
          PUMPAJ!
        </Button>
      </Box>
    </Layout>
  );
};

const worldBoundsFeature = feature({
  type: "Polygon",
  coordinates: [
    [
      [-180, -90],
      [180, -90],
      [180, 90],
      [-180, 90],
      [-180, -90],
    ],
  ],
});

// @ts-expect-error Not sure why complains, it works
const serbiaFeature = union(featureCollection(serbia.features));

const worldMask = difference(
  // @ts-expect-error Not sure why complains, it works
  featureCollection([worldBoundsFeature, serbiaFeature])
);

const getInitialBounds = () => {
  const bounds = new LngLatBounds();

  const top = { lng: 19.666265137531838, lat: 46.188140150279196 };
  const left = { lng: 18.834213327740343, lat: 45.87455675807402 };
  const right = { lng: 23.001901979605805, lat: 43.1927687169611 };
  const bottom = { lng: 20.621131120250084, lat: 41.85398123454843 };

  bounds.extend(top);
  bounds.extend(left);
  bounds.extend(right);
  bounds.extend(bottom);

  return bounds;
};

function squareRootIncrement(
  current: number,
  step: number,
  maxProgress: number
): number {
  return Math.min(
    current + (maxProgress - current) * (1 / Math.sqrt(step)),
    maxProgress
  );
}

const updateSerbiaMask = (map: Map, pumps: PumpCollection) => {
  const serbiaMaskSource = map.getSource("serbia-mask")!;

  const circles = Object.entries(pumps).map(([key, radius]) => {
    const [lng, lat] = key.split(":").map(Number);
    return circle([lng, lat], radius, { steps: 32, units: "meters" });
  });

  if (circles.length > 0) {
    // @ts-expect-error Library type issue - the method exists
    serbiaMaskSource.setData(
      difference(featureCollection([serbiaFeature!, ...circles]))
    );
  }
};

const reduceRadius = (radius: number) => {
  return Math.max(0, Math.min(MAX_RADIUS, radius - RETRACT_VELOCITY));
};

const retractRadiuses = (pumps: PumpCollection) => {
  for (const [key, radius] of Object.entries(pumps)) {
    pumps[key] = reduceRadius(radius);
  }
};

const pump = (location: Location, pumps: PumpCollection) => {
  const locationKey = getLocationKey(location);

  pumps[locationKey] = squareRootIncrement(
    pumps[locationKey] ?? 0,
    PUMP_VELOCITY,
    MAX_RADIUS
  );
};

const getLocationKey = (location: Location) => {
  return [round(location.lng, 4), round(location.lat, 4)].join(":");
};
