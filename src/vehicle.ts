import * as t from 'io-ts';

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
  t.strict({ id: t.number }),
  Vehicle
]);

export type VehicleRegistered = t.TypeOf<typeof VehicleRegistered>;
