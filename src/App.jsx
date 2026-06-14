import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import {
  getFavoriteIds,
  getLastCategory,
  getProfile,
  getVisitedIds,
  saveFavoriteIds,
  saveLastCategory,
  saveProfile,
  saveVisitedIds,
  toggleId,
} from './utils/storage';

const App = () => {
  const { attractions, loading, error } = useAttractions();
  const [profile, setProfile] = useState(() => getProfile());
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());
  const [visitedIds, setVisitedIds] = useState(() => getVisitedIds());
  const [selectedCategory, setSelectedCategory] = useState(() => getLastCategory());
  const [imageCount, setImageCount] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [locationError, setLocationError] = useState('');

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

  const handleRequestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unsupported');
      setLocationError('');
      return;
    }

    setLocationStatus('loading');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      (geoError) => {
        const denied = geoError.code === geoError.PERMISSION_DENIED;
        setLocationStatus(denied ? 'denied' : 'error');
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
    onRequestLocation: handleRequestLocation,
  };

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
