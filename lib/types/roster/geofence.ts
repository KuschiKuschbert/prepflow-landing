export interface VenueLocation {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface GeofenceValidationResult {
  isValid: boolean;
  distance: number;
  isWithinRadius: boolean;
  message: string;
}
