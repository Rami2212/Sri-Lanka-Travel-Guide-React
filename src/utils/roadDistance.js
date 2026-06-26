const OSRM_API_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

const roundCoordinate = (value) => Number(value).toFixed(5);

export const buildRoadDistanceKey = (origin, destination) => {
  if (!origin || !destination) {
    return '';
  }

  return [
    roundCoordinate(origin.latitude),
    roundCoordinate(origin.longitude),
    roundCoordinate(destination.latitude),
    roundCoordinate(destination.longitude),
  ].join(':');
};

export const getRoadDistanceKm = async (origin, destination, signal) => {
  if (!origin || !destination) {
    return null;
  }

  const originCoordinates = `${origin.longitude},${origin.latitude}`;
  const destinationCoordinates = `${destination.longitude},${destination.latitude}`;
  const requestUrl =
    `${OSRM_API_BASE_URL}/${originCoordinates};${destinationCoordinates}` +
    '?overview=false&steps=false&alternatives=false';

  const response = await fetch(requestUrl, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load route distance (${response.status})`);
  }

  const data = await response.json();
  const routeDistanceMeters = data.routes?.[0]?.distance;

  if (typeof routeDistanceMeters !== 'number') {
    return null;
  }

  return routeDistanceMeters / 1000;
};
