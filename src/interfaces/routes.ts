export interface LocationParams {
  locationId: string;
}

export interface LocationSearchQuery {
  x: string;
  y: string;
}

export interface LocationStoreQuery {
  name: string;
  type: string;
  openingHours?: string;
  'opening-hours'?: string;
  image: string;
  coordinates: string;
  radius: number;
  id?: string;
}
