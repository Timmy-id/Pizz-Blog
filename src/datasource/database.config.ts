/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME } from '../config';


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
    synchronize: true // don't use in production
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;