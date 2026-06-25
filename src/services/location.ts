/**
 * Location Service
 *
 * Handles all external location-related operations:
 * - Reverse geocoding via OpenStreetMap Nominatim API
 *
 * This is the single owner for location data boundaries.
 * When we move to a paid geocoding provider later, only this file changes.
 */

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
}

interface NominatimResponse {
  address: NominatimAddress;
}

/**
 * Reverse-geocode coordinates into a human-readable city/town name.
 * Uses OpenStreetMap Nominatim (free, no API key required).
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  );

  if (!response.ok) {
    throw new Error(`Nominatim request failed with status ${response.status}`);
  }

  const data: NominatimResponse = await response.json();
  const { address } = data;

  // Prefer the most specific locality available
  return (
    address.city ||
    address.town ||
    address.village ||
    address.county ||
    "Current Location"
  );
}
