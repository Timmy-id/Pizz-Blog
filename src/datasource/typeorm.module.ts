/* eslint-disable prettier/prettier */
import { DataSource } from "typeorm";
import { Global, Module } from "@nestjs/common";
import dataSource from "./database.config";


@Global()
@Module({
    imports: [],
    providers: [{
        provide: DataSource,
        useFactory: async () => {
            try {
                await dataSource.initialize()
                console.log('Database connected successfully');
                return dataSource
            } catch (error) {
                console.log("Error connecting to database")
                throw error
            }
        }
    }],
    exports: [DataSource]
})

export class TypeOrmModule {}