import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post
} from '@nestjs/common';
import { IoTsValidationPipe } from '../validation/io-ts-validation.pipe';
import { encodeToEntity, Vehicle, VehicleSchema } from './vehicle';
import { VehicleRepository } from './vehicle.repository';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesRepository: VehicleRepository) {}

  @Get()
  async getVehicles() {
    return await this.vehiclesRepository.get();
  }

  @Get(':id')
  async getVehicle(@Param() id: number) {
    return await this.vehiclesRepository.getById(id);
  }

  @Post()
  async postVehicle(
    @Body(new IoTsValidationPipe(VehicleSchema)) payload: Vehicle
  ): Promise<{ id: number }> {
    try {
      const newId = await this.vehiclesRepository.save(encodeToEntity(payload));
      return { id: newId };
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }
}
