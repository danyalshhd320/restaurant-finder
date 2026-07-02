import path from 'path';
import fs from 'fs/promises';
import { Restaurant } from '../models/restaurants';
import { LocationCreateInput } from '../interfaces/locations';

export const loadSeedData = async (): Promise<LocationCreateInput[]> => {
  const dataPath = path.join(__dirname, '../data/locations.json');
  const data = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(data) as LocationCreateInput[];
};

export const seedRestaurants = async (): Promise<void> => {
  const locations = await loadSeedData();
  await Restaurant.deleteMany({});
  await Restaurant.insertMany(locations);
};
