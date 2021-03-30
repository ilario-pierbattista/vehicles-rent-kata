import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
