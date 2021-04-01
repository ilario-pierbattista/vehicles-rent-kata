import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IoTsValidationPipe } from '../validation/io-ts-validation.pipe';
import { VehicleEntity } from '../vehicle/vehicle.entity';
import { BookingCreation, BookingRegisteredSchema } from './booking';
import { BookingRepository } from './booking.repository';

@Controller('bookings')
export class BookingsController {
  constructor(
    @InjectRepository(VehicleEntity)
    readonly vehicleRepository: Repository<VehicleEntity>,
    readonly bookingRepository: BookingRepository
  ) {}

  @Post()
  async postBooking(
    @Body(new IoTsValidationPipe(BookingRegisteredSchema))
    createBookingDto: BookingCreation
  ): Promise<{ id: number }> {
    const newBookingId = await this.bookingRepository.saveBooking(
      createBookingDto
    );
    return { id: newBookingId };
  }
}
