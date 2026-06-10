import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WardsModule } from './modules/wards/wards.module';
import { RoadsModule } from './modules/roads/roads.module';
import { RiversModule } from './modules/rivers/rivers.module';
import { CooperativesModule } from './modules/cooperatives/cooperatives.module';
import { IrrigationsModule } from './modules/irrigations/irrigations.module';
import { EffectiveModelsModule } from './modules/effective-models/effective-models.module';
import { OcopEntitiesModule } from './modules/ocop-entities/ocop-entities.module';
import { ProductionAreasModule } from './modules/production-areas/production-areas.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      host: process.env.DB_HOST,

      port: Number(process.env.DB_PORT),

      username: process.env.DB_USER,

      password: process.env.DB_PASSWORD,

      database: process.env.DB_NAME,

      synchronize: false,

      autoLoadEntities: true,
    }),

    WardsModule,
    RoadsModule,
    RiversModule,
    CooperativesModule,
    IrrigationsModule,
    EffectiveModelsModule,
    OcopEntitiesModule,
    ProductionAreasModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }