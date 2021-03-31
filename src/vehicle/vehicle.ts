import * as t from 'io-ts';
import { BookingRegistered } from '../booking/booking';
import { VehicleEntity } from './vehicle.entity';

export const Vehicle = t.intersection([
  t.strict({
    plate: t.string,
    modelName: t.string
  }),
  t.union([
    t.strict({
      type: t.literal('moto'),
      engineCapacity: t.number
    }),
    t.strict({
      type: t.literal('car'),
      seats: t.number
    })
  ])
]);

export type Vehicle = t.TypeOf<typeof Vehicle>;

export const VehicleRegistered = t.intersection([
  t.strict({
    id: t.number,
    bookings: t.array(BookingRegistered)
  }),
  Vehicle
]);

export type VehicleRegistered = t.TypeOf<typeof VehicleRegistered>;

export const encodeToEntity: t.Encode<Vehicle, VehicleEntity> = (v) => {
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
