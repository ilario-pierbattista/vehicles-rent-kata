import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingEntity } from './booking/booking.entity';
import { BookingRepository } from './booking/booking.repository';
import { BookingsController } from './booking/bookings.controller';
import { VehiclesClassValidatorController } from './vehicle-class-validator/vehicles.controller';
import { VehicleEntity } from './vehicle/vehicle.entity';
import { VehicleRepository } from './vehicle/vehicle.repository';
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
  controllers: [
    VehiclesController,
    VehiclesClassValidatorController,
    BookingsController
  ],
  providers: [BookingRepository, VehicleRepository]
})
export class ApiModule {}
