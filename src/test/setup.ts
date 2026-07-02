import mongoose from 'mongoose';

declare global {
    namespace NodeJS {
        interface Global {

        }
    }
}

// Allow longer time for database setup in CI/container environments
jest.setTimeout(30000);

beforeAll(async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/locations';

    try {
        await mongoose.connect(mongoUri);
    } catch (err) {
        // Re-throw with additional context so failures are clearer in CI
        throw new Error(`Failed to connect to MongoDB at ${mongoUri}: ${String(err)}`);
    }
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});
