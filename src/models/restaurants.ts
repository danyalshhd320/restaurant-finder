import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { RestaurantAttrs, RestaurantDoc, RestaurantModel } from '../interfaces/restaurants';

const restaurantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
    },
    image: {
      type: String,
    },
    coordinates: {
      x: {
        type: Number,
        required: true,
        min: 0,
      },
      y: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    radius: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret.id || ret._id?.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

restaurantSchema.index({
  'coordinates.x': 1,
  'coordinates.y': 1,
});

restaurantSchema.statics.build = (attrs: RestaurantAttrs) => {
  return new Restaurant(attrs);
};

const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>('Restaurant', restaurantSchema);

export { Restaurant };
