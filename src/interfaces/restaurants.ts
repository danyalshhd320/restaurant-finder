import mongoose from 'mongoose';

export interface RestaurantAttrs {
  name: string;
  type: string;
  openingHours: string;
  image: string;
  radius: number;
  coordinates: { x: number; y: number };
}

export interface RestaurantDoc extends mongoose.Document {
  name: string;
  type: string;
  openingHours: string;
  image: string;
  radius: number;
  coordinates: { x: number; y: number };
}

export interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
  build(attrs: RestaurantAttrs): RestaurantDoc;
}
