import { app } from './app';
import { MONGO_URI, PORT } from './config';
import mongoose from 'mongoose';

const start = async () => {
  await mongoose.connect(MONGO_URI);
  app.log.info('Connected to MongoDB.');

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`Listening on port ${PORT}.`);
};

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
