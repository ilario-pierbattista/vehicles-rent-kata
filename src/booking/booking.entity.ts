import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { VehicleEntity } from '../vehicle/vehicle.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.bookings)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: VehicleEntity;

  @Column()
  from!: Date;

  @Column()
  to!: Date;
}
