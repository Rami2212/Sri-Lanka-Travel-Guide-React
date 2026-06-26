import { useLayoutEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import DesktopFooter from './components/DesktopFooter';
import HeaderNavigation from './components/HeaderNavigation';
import { categories } from './data/categories';
import { useAttractions } from './hooks/useAttractions';
import { useImageCount } from './hooks/useImageCount';
import { usePersistedLocation } from './hooks/usePersistedLocation';
import { usePersistentTravelState } from './hooks/usePersistentTravelState';
import { useRoadDistances } from './hooks/useRoadDistances';
import AttractionDetails from './pages/AttractionDetails';
import Attractions from './pages/Attractions';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TravelImages from './pages/TravelImages';
import Visited from './pages/Visited';

const App = () => {
  const { attractions, loading, error } = useAttractions();
  const { imageCount, onImagesChanged } = useImageCount();
  const { profile, favoriteIds, visitedIds, selectedCategory, onSelectCategory, onToggleFavorite, onToggleVisited, onSaveProfile } =
    usePersistentTravelState();
  const { userLocation, locationStatus, locationError, onRequestLocation } = usePersistedLocation();
  const roadDistances = useRoadDistances(userLocation, attractions);

  const sharedPageProps = {
    attractions,
    loading,
    error,
    categories,
    selectedCategory,
    favoriteIds,
    visitedIds,
    onSelectCategory,
    onToggleFavorite,
    onToggleVisited,
    userLocation,
    locationStatus,
    locationError,
    roadDistances,
    onRequestLocation,
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
                onToggleFavorite={onToggleFavorite}
                onToggleVisited={onToggleVisited}
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
                onToggleFavorite={onToggleFavorite}
                onToggleVisited={onToggleVisited}
                userLocation={userLocation}
                roadDistances={roadDistances}
              />
            }
          />
          <Route
            path="/travel-images"
            element={<TravelImages attractions={attractions} onImagesChanged={onImagesChanged} />}
          />
          <Route
            path="/profile"
            element={<Profile profile={profile} onSaveProfile={onSaveProfile} />}
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
