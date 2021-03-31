import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingEntity } from './booking/booking.entity';
import { VehicleEntity } from './vehicle/vehicle.entity';
import { VehiclesController } from './vehicle/vehicles.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'pass',
      database: 'vehicles_rent',
      entities: [VehicleEntity, BookingEntity]
    }),
    TypeOrmModule.forFeature([VehicleEntity, BookingEntity])
  ],
  controllers: [VehiclesController],
  providers: []
})
export class ApiModule {}
