import { useCallback, useEffect, useState } from 'react';
import { getAllTravelImages } from '../utils/indexedDb';

export const useImageCount = () => {
  const [imageCount, setImageCount] = useState(0);

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

  return {
    imageCount,
    onImagesChanged: handleImagesChanged,
  };
};
