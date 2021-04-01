import * as t from 'io-ts';
import { BookingRegisteredSchema } from '../booking/booking';
import { VehicleEnum } from '../common/vehicle';
import { VehicleEntity } from './vehicle.entity';

export const VehicleSchema = t.intersection([
  t.strict({
    plate: t.string,
    modelName: t.string
  }),
  t.union([
    t.strict({
      type: t.literal(VehicleEnum.moto.value),
      engineCapacity: t.number
    }),
    t.strict({
      type: t.literal(VehicleEnum.car.value),
      seats: t.number
    })
  ])
]);

export type Vehicle = t.TypeOf<typeof VehicleSchema>;

export const VehicleRegistered = t.intersection([
  t.strict({
    id: t.number,
    bookings: t.array(BookingRegisteredSchema)
  }),
  VehicleSchema
]);

export type VehicleRegistered = t.TypeOf<typeof VehicleRegistered>;

export const encodeToEntity = (v: Vehicle): VehicleEntity => {
  const ve = new VehicleEntity();
  ve.modelName = v.modelName;
  ve.plate = v.plate;

  switch (v.type) {
    case 'car': {
      ve.type = 'car';
      ve.seats = v.seats;
      break;
    }
    case 'moto': {
      ve.type = 'moto';
      ve.engineCapacity = v.engineCapacity;
      break;
    }
  }

  return ve;
};
