import { useState } from 'react';
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
} from '../utils/storage';

export const usePersistentTravelState = () => {
  const [profile, setProfile] = useState(() => getProfile());
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());
  const [visitedIds, setVisitedIds] = useState(() => getVisitedIds());
  const [selectedCategory, setSelectedCategory] = useState(() => getLastCategory());

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

  return {
    profile,
    favoriteIds,
    visitedIds,
    selectedCategory,
    onSelectCategory: handleSelectCategory,
    onToggleFavorite: handleToggleFavorite,
    onToggleVisited: handleToggleVisited,
    onSaveProfile: handleSaveProfile,
  };
};
