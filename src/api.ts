import axios from "axios";

export const api = {
  places: axios.create({
    baseURL: `https://places.geo.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/v2`,
    params: { key: import.meta.env.VITE_AWS_LOCATION_API_KEY },
  }),
};

interface AutocompleteParams {
  QueryText: string;
  Filter?: {
    IncludeCountries?: string[];
  };
}

interface PlaceResult {
  PlaceId: string;
  PlaceType: string;
  Title: string;
}

interface AutocompleteResult {
  ResultItems: PlaceResult[];
}

export const autocomplete = async (params: AutocompleteParams) => {
  const { data } = await api.places.post<AutocompleteResult>("/autocomplete", {
    ...params,
    AdditionalFeatures: ["Core"],
  });

  return data;
};

interface GetPlaceResult {
  Position: [number, number];
}

export const getPlace = async (id: string) => {
  const { data } = await api.places.get<GetPlaceResult>(`/place/${id}`);
  return data;
};

interface ReverseGeocodeParams {
  QueryPosition: [number, number];
}

interface ReverseGeocodeResult {
  ResultItems: PlaceResult[];
}

export const reverseGeocode = async (params: ReverseGeocodeParams) => {
  const { data } = await api.places.post<ReverseGeocodeResult>(
    "reverse-geocode",
    params
  );

  return data;
};
