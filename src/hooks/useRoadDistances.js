import { useEffect, useState } from 'react';
import { buildRoadDistanceKey, getRoadDistanceKm } from '../utils/roadDistance';

export const useRoadDistances = (userLocation, attractions) => {
  const [roadDistances, setRoadDistances] = useState({});
  const activeRoadDistances = userLocation ? roadDistances : {};

  useEffect(() => {
    if (!userLocation) {
      return undefined;
    }

    if (attractions.length === 0) {
      return undefined;
    }

    const abortController = new window.AbortController();
    const destinationEntries = attractions.map((attraction) => ({
      destination: {
        latitude: attraction.latitude,
        longitude: attraction.longitude,
      },
    }));

    const pendingEntries = destinationEntries.filter(({ destination }) => {
      const cacheKey = buildRoadDistanceKey(userLocation, destination);
      return roadDistances[cacheKey] === undefined;
    });

    if (pendingEntries.length === 0) {
      return () => abortController.abort();
    }

    pendingEntries.forEach(async ({ destination }) => {
      const cacheKey = buildRoadDistanceKey(userLocation, destination);

      try {
        const distanceKm = await getRoadDistanceKm(userLocation, destination, abortController.signal);

        setRoadDistances((currentDistances) => {
          if (currentDistances[cacheKey] !== undefined) {
            return currentDistances;
          }

          return {
            ...currentDistances,
            [cacheKey]: distanceKm,
          };
        });
      } catch (routeError) {
        if (routeError.name === 'AbortError') {
          return;
        }

        setRoadDistances((currentDistances) => ({
          ...currentDistances,
          [cacheKey]: null,
        }));
      }
    });

    return () => abortController.abort();
  }, [attractions, roadDistances, userLocation]);

  return activeRoadDistances;
};
