import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { BookingCreation } from './booking';
import { BookingEntity } from './booking.entity';

@Injectable()
export class BookingRepository {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>
  ) {}

  async saveBooking(createBookingDto: BookingCreation): Promise<number> {
    const vehicle = await this.vehicleRepository.getById(
      createBookingDto.vehicleId
    );
    const booking = new BookingEntity();

    booking.from = createBookingDto.from;
    booking.to = createBookingDto.to;
    booking.vehicle = vehicle;

    try {
      const inserted = await this.bookingRepository.save(booking);
      return inserted.id;
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }
}
