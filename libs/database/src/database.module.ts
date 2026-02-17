import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static forRoot(schema: string, entities: Function[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
            type: 'postgres',
            host: config.get('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get('DB_USERNAME', 'my_family_user'),
            password: config.get('DB_PASSWORD', 'my_family_pass'),
            database: config.get('DB_DATABASE', 'my_family'),
            schema,
            entities,
            synchronize: false,
            logging: config.get('NODE_ENV') === 'development',
            extra: {
              max: 20,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 5000,
            },
          }),
        }),
        TypeOrmModule.forFeature(entities),
      ],
      exports: [TypeOrmModule],
    };
  }
}
