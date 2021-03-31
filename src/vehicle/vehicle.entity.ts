import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingEntity } from '../booking/booking.entity';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  plate!: string;

  @Column()
  modelName!: string;

  @Column()
  type!: 'car' | 'moto';

  @Column()
  engineCapacity?: number;

  @Column()
  seats?: number;

  @OneToMany(() => BookingEntity, (booking) => booking.vehicle)
  bookings?: BookingEntity[];
}
