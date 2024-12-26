import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;

console.log('MONGO_URI desde config.js:', MONGO_URI);
