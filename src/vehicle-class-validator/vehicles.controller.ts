import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  ValidationPipe
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../vehicle/vehicle.entity';
import { CreateVehicleDto, encodeToEntityFactory } from './vehicle';

const encodeToEntity = encodeToEntityFactory();

@Controller('vehicles-class-validator')
export class VehiclesClassValidatorController {
  constructor(
    @InjectRepository(VehicleEntity)
    readonly vehiclesRepository: Repository<VehicleEntity>
  ) {}

  @Post()
  async postVehicle(
    @Body(ValidationPipe) payload: CreateVehicleDto
  ): Promise<{ id: number }> {
    try {
      const inserted = await this.vehiclesRepository.save(
        encodeToEntity(payload)
      );
      return {
        id: inserted[0].id
      };
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }
}
