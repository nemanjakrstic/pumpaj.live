import { useEffect, useRef } from "react";

export const useAnimationFrame = (
  enabled: boolean,
  callback: (delta: number) => void
) => {
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const delta = time - previousTimeRef.current;
      callback(delta);
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (enabled) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current !== undefined && requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled]);
};
