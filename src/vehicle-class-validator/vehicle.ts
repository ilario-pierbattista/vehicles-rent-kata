import { InternalServerErrorException } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsIn, IsNumber, IsString, ValidateIf } from 'class-validator';
import { VehicleEnum, VehicleType } from '../common/vehicle';
import { VehicleEntity } from '../vehicle/vehicle.entity';

export class VehicleDto {
  @IsIn(VehicleEnum.values)
  type!: VehicleType;

  @IsString()
  plate!: string;

  @IsString()
  modelName!: string;
}

export class CarDto extends VehicleDto {
  @ValidateIf((o) => o.type === VehicleEnum.car.value)
  @IsNumber()
  seats!: number;
}

export class MotorbikeDto extends VehicleDto {
  @ValidateIf((o) => o.type === VehicleEnum.moto.value)
  @IsNumber()
  engineCapacity!: number;
}

export class CreateVehicleDto extends IntersectionType(CarDto, MotorbikeDto) {}

type encoderVehicle<T extends VehicleDto> = (v: T) => VehicleEntity;

const encodeVehicleToEntity: encoderVehicle<VehicleDto> = (
  v: VehicleDto
): VehicleEntity => {
  const ve = new VehicleEntity();
  ve.modelName = v.modelName;
  ve.plate = v.plate;
  return ve;
};

const encodeCarToEntity: encoderVehicle<CarDto> = (
  v: CarDto
): VehicleEntity => {
  const ve = encodeVehicleToEntity(v);
  ve.type = VehicleEnum.car.value;
  ve.seats = v.seats;
  return ve;
};

const encodeMotorbikeToEntity = (v: MotorbikeDto): VehicleEntity => {
  const ve = encodeVehicleToEntity(v);
  ve.type = VehicleEnum.moto.value;
  ve.engineCapacity = v.engineCapacity;
  return ve;
};

const ENCODER: Record<VehicleType, encoderVehicle<any>> = {
  [VehicleEnum.car.value]: encodeCarToEntity,
  [VehicleEnum.moto.value]: encodeMotorbikeToEntity
};

export const encodeToEntityFactory = (encoderResolver = ENCODER) => {
  return (v: VehicleDto) => {
    const encoder = encoderResolver[v.type];
    if (encoder) {
      return encoder(v);
    }

    throw new InternalServerErrorException('Encoder not found');
  };
};
