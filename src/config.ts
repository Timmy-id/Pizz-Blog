/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';

dotenv.config()

export const NODE_ENV = process.env.NODE_ENV;
// all the env vars
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT)
    : undefined;
export const DATABASE_NAME = process.env.POSTGRES_DB;
export const DATABASE_PASSWORD = process.env.POSTGRES_PASSWORD;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
export const PORT = process.env.PORT ?? 3000;
export const JWT_SECRET = process.env.JWT_SECRET;