import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehiclesRepository: Repository<VehicleEntity>
  ) {}

  async getById(vehicleId: number): Promise<VehicleEntity> {
    let vehicle: VehicleEntity | undefined;
    try {
      vehicle = await this.vehiclesRepository.findOne(vehicleId);
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async get(): Promise<VehicleEntity[]> {
    try {
      return await this.vehiclesRepository.find();
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }

  async save(vehicle: VehicleEntity): Promise<number> {
    try {
      const newVehicle = await this.vehiclesRepository.save(vehicle);
      return newVehicle.id;
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }
}
