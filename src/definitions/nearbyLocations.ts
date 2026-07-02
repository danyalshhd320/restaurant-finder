import { formatCoordinateString } from '../utils';
import type {
  NearbyLocationSource,
  NearbyLocationWithRadius,
  NearbyLocationItem,
} from '../interfaces/locations';

const buildNearbyLocationWithRadius = (
  restaurant: NearbyLocationSource,
  x: number,
  y: number
): NearbyLocationWithRadius => {
  const distance = Math.sqrt(
    (restaurant.coordinates.x - x) ** 2 +
    (restaurant.coordinates.y - y) ** 2
  );

  return {
    id: restaurant.id,
    name: restaurant.name,
    coordinates: formatCoordinateString(restaurant.coordinates.x, restaurant.coordinates.y),
    distance: Number(distance.toFixed(5)),
    radius: restaurant.radius,
  };
};

const isNearbyLocationWithinRange = (
  location: NearbyLocationWithRadius
): boolean => location.distance <= location.radius;

const sortNearbyLocationsByDistance = (
  a: NearbyLocationWithRadius,
  b: NearbyLocationWithRadius
): number => a.distance - b.distance;

export const buildNearbyLocations = (
  restaurants: NearbyLocationSource[],
  x: number,
  y: number
): NearbyLocationItem[] =>
  restaurants
    .map((restaurant) => buildNearbyLocationWithRadius(restaurant, x, y))
    .filter(isNearbyLocationWithinRange)
    .sort(sortNearbyLocationsByDistance)
    .map(({ id, name, coordinates, distance }) => ({ id, name, coordinates, distance }));
