import { useEffect, useState } from 'react';

export const useAttractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAttractions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/locations.json');

        if (!response.ok) {
          throw new Error(`Unable to load attraction data (${response.status})`);
        }

        const data = await response.json();

        if (active) {
          setAttractions(data);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || 'Unable to load attractions.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAttractions();

    return () => {
      active = false;
    };
  }, []);

  return { attractions, loading, error };
};
