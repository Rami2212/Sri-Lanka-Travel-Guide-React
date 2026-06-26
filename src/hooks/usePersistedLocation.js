import { useCallback, useEffect, useState } from 'react';
import { clearStoredLocation, getStoredLocation, saveStoredLocation } from '../utils/storage';

const LOCATION_STORAGE_KEY = 'sltg_last_location';

export const usePersistedLocation = () => {
  const storedLocation = getStoredLocation();
  const [userLocation, setUserLocation] = useState(() => storedLocation);
  const [locationStatus, setLocationStatus] = useState(() => (storedLocation ? 'granted' : 'idle'));
  const [locationError, setLocationError] = useState('');

  const clearLocationState = useCallback(() => {
    setUserLocation(null);
    setLocationStatus('idle');
    setLocationError('');
    clearStoredLocation();
  }, []);

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

        if (denied) {
          clearLocationState();
          setLocationStatus('denied');
        } else {
          setLocationStatus('error');
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
  }, [clearLocationState]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== LOCATION_STORAGE_KEY) {
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
    let currentPermissionStatus;

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        currentPermissionStatus = permissionStatus;

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
            clearLocationState();
            setLocationStatus('denied');
          }
        };
      })
      .catch(() => {});

    return () => {
      active = false;

      if (currentPermissionStatus) {
        currentPermissionStatus.onchange = null;
      }
    };
  }, [clearLocationState, handleRequestLocation]);

  return {
    userLocation,
    locationStatus,
    locationError,
    onRequestLocation: handleRequestLocation,
    clearLocationState,
  };
};
