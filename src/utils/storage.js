const STORAGE_KEYS = {
  profile: 'sltg_profile',
  favorites: 'sltg_favorites',
  visited: 'sltg_visited',
  category: 'sltg_last_category',
  location: 'sltg_last_location',
};

const defaultProfile = {
  name: 'Traveler',
  bio: 'Exploring Sri Lanka one beautiful stop at a time.',
  image: '',
};

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from localStorage`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to save ${key} to localStorage`, error);
  }
};

export const getProfile = () => readJson(STORAGE_KEYS.profile, defaultProfile);

export const saveProfile = (profile) => {
  const safeProfile = {
    name: profile.name?.trim() || defaultProfile.name,
    bio: profile.bio?.trim() || '',
    image: profile.image || '',
  };
  writeJson(STORAGE_KEYS.profile, safeProfile);
  return safeProfile;
};

export const getFavoriteIds = () => readJson(STORAGE_KEYS.favorites, []);

export const saveFavoriteIds = (ids) => writeJson(STORAGE_KEYS.favorites, ids);

export const getVisitedIds = () => readJson(STORAGE_KEYS.visited, []);

export const saveVisitedIds = (ids) => writeJson(STORAGE_KEYS.visited, ids);

export const getLastCategory = () => localStorage.getItem(STORAGE_KEYS.category) || 'All';

export const saveLastCategory = (category) => {
  localStorage.setItem(STORAGE_KEYS.category, category);
};

export const getStoredLocation = () => readJson(STORAGE_KEYS.location, null);

export const saveStoredLocation = (location) => {
  if (!location) {
    return null;
  }

  const safeLocation = {
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    savedAt: location.savedAt || new Date().toISOString(),
  };

  writeJson(STORAGE_KEYS.location, safeLocation);
  return safeLocation;
};

export const clearStoredLocation = () => {
  localStorage.removeItem(STORAGE_KEYS.location);
};

export const toggleId = (ids, id) => {
  if (ids.includes(id)) {
    return ids.filter((savedId) => savedId !== id);
  }

  return [...ids, id];
};
