export interface LocationResponse {
  id: string;
  name: string;
  type: string;
  'opening-hours': string;
  image: string;
  coordinates: string;
}

export interface NearbyLocationSource {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  radius: number;
}

export interface NearbyLocationWithRadius {
  id: string;
  name: string;
  coordinates: string;
  distance: number;
  radius: number;
}

export interface NearbyLocationItem {
  id: string;
  name: string;
  coordinates: string;
  distance: number;
}

export interface NearbyLocationsResponse {
  'user-location': string;
  locations: NearbyLocationItem[];
}

export interface LocationUpdateInput {
  name: string;
  type: string;
  openingHours: string;
  image: string;
  coordinates: { x: number; y: number };
  radius: number;
}

export interface LocationCreateInput {
  name: string;
  type: string;
  openingHours: string;
  image: string;
  coordinates: { x: number; y: number };
  radius: number;
}
