import { EnumBuilder, EnumType } from '../enums/enum.utils';

const Vehicle = {
  car: 'car',
  moto: 'moto'
} as const;

export type VehicleType = EnumType<typeof Vehicle>;
export const VehicleEnum = EnumBuilder(Vehicle);
