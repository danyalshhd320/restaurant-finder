import { Restaurant } from '../models/restaurants';
import { NEARBY_LOCATION_RADIUS } from '../config';
import {
  LocationResponse,
  NearbyLocationItem,
  NearbyLocationSource,
  NearbyLocationsResponse,
  LocationCreateInput,
  LocationUpdateInput,
} from '../interfaces/locations';
import { buildNearbyLocations } from '../definitions/nearbyLocations';
import { formatCoordinateString, parseCoordinates } from '../utils';

export const getLocationById = async (locationId: string): Promise<LocationResponse | null> => {
  const location = await Restaurant.findOne({ id: locationId }).lean();

  if (!location) {
    return null;
  }

  return {
    id: location.id,
    name: location.name,
    type: location.type,
    'opening-hours': location.openingHours ?? '',
    image: location.image ?? '',
    coordinates: formatCoordinateString(location.coordinates.x, location.coordinates.y),
  };
};

export const createLocations = async (locations: LocationCreateInput[]): Promise<void> => {
  const docs = locations.map((location) => ({
    name: location.name,
    type: location.type,
    openingHours: location.openingHours,
    image: location.image,
    coordinates: location.coordinates,
    radius: location.radius,
  }));

  await Restaurant.insertMany(docs);
};

export const createRandomLocations = async (count = 100): Promise<void> => {
  const names = ['Da Jia Le', 'Deseado Steakhaus', 'Fire Tiger', 'Green Bamboo', 'Ocean Pearl'];
  const images = ['https://tinyurl.com/1', 'https://tinyurl.com/2', 'https://tinyurl.com/3', 'https://tinyurl.com/4'];
  const types = ['Restaurant', 'Cafe', 'Food Truck'];

  const locations = Array.from({ length: count }, (_element, index) => {
    const x = Math.floor(Math.random() * 10) + 1;
    const y = Math.floor(Math.random() * 10) + 1;

    return {
      name: names[index % names.length],
      type: types[index % types.length],
      openingHours: '10:00AM-11:00PM',
      image: images[index % images.length],
      coordinates: `x=${x},y=${y}`,
      radius: Math.floor(Math.random() * 15) + 1,
    };
  });

  await createLocations(
    locations.map((location) => ({
      name: location.name,
      type: location.type,
      openingHours: location.openingHours,
      image: location.image,
      coordinates: parseCoordinates(location.coordinates)!,
      radius: location.radius,
    }))
  );
};

export const updateLocationById = async (
  locationId: string,
  update: LocationUpdateInput
): Promise<LocationResponse | null> => {
  const updated = await Restaurant.findOneAndUpdate(
    { id: locationId },
    {
      name: update.name,
      type: update.type,
      openingHours: update.openingHours,
      image: update.image,
      coordinates: update.coordinates,
      radius: update.radius,
    },
    {
      new: true,
      lean: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!updated) {
    return null;
  }

  return {
    id: updated.id,
    name: updated.name,
    type: updated.type,
    'opening-hours': updated.openingHours ?? '',
    image: updated.image ?? '',
    coordinates: formatCoordinateString(updated.coordinates.x, updated.coordinates.y),
  };
};

export const getNearbyLocations = async (x: number, y: number): Promise<NearbyLocationsResponse> => {
  const restaurants = await Restaurant.find({
    'coordinates.x': {
      $gte: x - NEARBY_LOCATION_RADIUS,
      $lte: x + NEARBY_LOCATION_RADIUS,
    },
    'coordinates.y': {
      $gte: y - NEARBY_LOCATION_RADIUS,
      $lte: y + NEARBY_LOCATION_RADIUS,
    },
  }).lean();

  const locations: NearbyLocationItem[] = buildNearbyLocations(
    restaurants as NearbyLocationSource[],
    x,
    y
  );

  return {
    'user-location': formatCoordinateString(x, y),
    locations,
  };
};
