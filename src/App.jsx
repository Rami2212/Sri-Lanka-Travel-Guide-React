import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import DesktopFooter from './components/DesktopFooter';
import HeaderNavigation from './components/HeaderNavigation';
import { categories } from './data/categories';
import { useAttractions } from './hooks/useAttractions';
import AttractionDetails from './pages/AttractionDetails';
import Attractions from './pages/Attractions';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TravelImages from './pages/TravelImages';
import Visited from './pages/Visited';
import { getAllTravelImages } from './utils/indexedDb';
import { buildRoadDistanceKey, getRoadDistanceKm } from './utils/roadDistance';
import {
  clearStoredLocation,
  getFavoriteIds,
  getLastCategory,
  getProfile,
  getStoredLocation,
  getVisitedIds,
  saveFavoriteIds,
  saveLastCategory,
  saveStoredLocation,
  saveProfile,
  saveVisitedIds,
  toggleId,
} from './utils/storage';

const App = () => {
  const { attractions, loading, error } = useAttractions();
  const storedLocation = getStoredLocation();
  const [profile, setProfile] = useState(() => getProfile());
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());
  const [visitedIds, setVisitedIds] = useState(() => getVisitedIds());
  const [selectedCategory, setSelectedCategory] = useState(() => getLastCategory());
  const [imageCount, setImageCount] = useState(0);
  const [userLocation, setUserLocation] = useState(() => storedLocation);
  const [locationStatus, setLocationStatus] = useState(() => (storedLocation ? 'granted' : 'idle'));
  const [locationError, setLocationError] = useState('');
  const [roadDistances, setRoadDistances] = useState({});

  const handleRequestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unsupported');
      setLocationError('');
      return;
    }

    setLocationStatus('loading');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = saveStoredLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          savedAt: new Date().toISOString(),
        });
        setUserLocation(nextLocation);
        setLocationStatus('granted');
      },
      (geoError) => {
        const denied = geoError.code === geoError.PERMISSION_DENIED;
        setLocationStatus(denied ? 'denied' : 'error');
        if (denied) {
          setUserLocation(null);
          setRoadDistances({});
          clearStoredLocation();
        }
        setLocationError(
          denied
            ? 'Location permission was denied. You can still browse attractions, but distance will be hidden.'
            : geoError.message,
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== 'sltg_last_location') {
        return;
      }

      try {
        const nextLocation = event.newValue ? JSON.parse(event.newValue) : null;
        setUserLocation(nextLocation);
        setLocationStatus(nextLocation ? 'granted' : 'idle');
        setLocationError('');
      } catch {
        setUserLocation(null);
        setLocationStatus('idle');
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!('permissions' in navigator) || !navigator.permissions?.query) {
      return undefined;
    }

    let active = true;

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (!active) {
          return;
        }

        if (permissionStatus.state === 'granted') {
          handleRequestLocation();
        }

        permissionStatus.onchange = () => {
          if (!active) {
            return;
          }

          if (permissionStatus.state === 'granted') {
            handleRequestLocation();
            return;
          }

          if (permissionStatus.state === 'denied') {
            setLocationStatus('denied');
            setUserLocation(null);
            setRoadDistances({});
            clearStoredLocation();
          }
        };
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [handleRequestLocation]);

  useEffect(() => {
    const loadImageCount = async () => {
      try {
        const images = await getAllTravelImages();
        setImageCount(images.length);
      } catch {
        setImageCount(0);
      }
    };

    loadImageCount();
  }, []);

  useEffect(() => {
    if (!userLocation || attractions.length === 0) {
      return undefined;
    }

    const abortController = new window.AbortController();
    const destinationEntries = attractions.map((attraction) => ({
      id: attraction.id,
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

  const handleImagesChanged = useCallback((count) => {
    setImageCount(count);
  }, []);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    saveLastCategory(category);
  };

  const handleToggleFavorite = (id) => {
    setFavoriteIds((currentIds) => {
      const nextIds = toggleId(currentIds, id);
      saveFavoriteIds(nextIds);
      return nextIds;
    });
  };

  const handleToggleVisited = (id) => {
    setVisitedIds((currentIds) => {
      const nextIds = toggleId(currentIds, id);
      saveVisitedIds(nextIds);
      return nextIds;
    });
  };

  const handleSaveProfile = (nextProfile) => {
    setProfile(saveProfile(nextProfile));
  };

  const sharedPageProps = {
    attractions,
    loading,
    error,
    categories,
    selectedCategory,
    favoriteIds,
    visitedIds,
    onSelectCategory: handleSelectCategory,
    onToggleFavorite: handleToggleFavorite,
    onToggleVisited: handleToggleVisited,
    userLocation,
    locationStatus,
    locationError,
    roadDistances,
    onRequestLocation: handleRequestLocation,
  };

  return (
    <div className="app-shell min-h-screen">
      <HeaderNavigation />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-12 lg:pt-8">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                {...sharedPageProps}
                profile={profile}
                imageCount={imageCount}
              />
            }
          />
          <Route path="/attractions" element={<Attractions {...sharedPageProps} />} />
          <Route path="/attractions/:id" element={<AttractionDetails {...sharedPageProps} />} />
          <Route
            path="/favorites"
            element={
              <Favorites
                attractions={attractions}
                favoriteIds={favoriteIds}
                visitedIds={visitedIds}
                onToggleFavorite={handleToggleFavorite}
                onToggleVisited={handleToggleVisited}
                userLocation={userLocation}
                roadDistances={roadDistances}
              />
            }
          />
          <Route
            path="/visited"
            element={
              <Visited
                attractions={attractions}
                favoriteIds={favoriteIds}
                visitedIds={visitedIds}
                onToggleFavorite={handleToggleFavorite}
                onToggleVisited={handleToggleVisited}
                userLocation={userLocation}
                roadDistances={roadDistances}
              />
            }
          />
          <Route
            path="/travel-images"
            element={<TravelImages attractions={attractions} onImagesChanged={handleImagesChanged} />}
          />
          <Route
            path="/profile"
            element={<Profile profile={profile} onSaveProfile={handleSaveProfile} />}
          />
        </Routes>
      </main>
      <DesktopFooter />
      <BottomNavigation />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppShell = () => (
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);

export default AppShell;
