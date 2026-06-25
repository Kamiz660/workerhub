/**
 * useGeolocation Hook
 *
 * Encapsulates browser geolocation acquisition and reverse-geocoding
 * into a reusable hook. Owns all side-effect state related to
 * detecting the user's current location.
 *
 * Uses the location service for the actual API call, keeping
 * this hook focused on browser interaction + React state.
 */

import { useState, useCallback } from "react";
import { reverseGeocode } from "@/services/location";

interface UseGeolocationReturn {
  /** Whether a geolocation request is in progress */
  isLocating: boolean;
  /** Request the user's current location, returns the city/town name */
  getCurrentLocation: () => Promise<string | null>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = useCallback(async (): Promise<string | null> => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return null;
    }

    setIsLocating(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const { latitude, longitude } = position.coords;
      const city = await reverseGeocode(latitude, longitude);
      return city;
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Please allow location access to use this feature.");
      return null;
    } finally {
      setIsLocating(false);
    }
  }, []);

  return { isLocating, getCurrentLocation };
}
