import * as t from 'io-ts';
import * as ty from 'io-ts-types';

export const BookingRegisteredSchema = t.strict({
  id: t.number,
  from: ty.date,
  to: ty.date
});

export type BookingRegistered = t.TypeOf<typeof BookingRegisteredSchema>;

export const BookingCreation = t.strict({
  from: ty.DateFromISOString,
  to: ty.DateFromISOString,
  vehicleId: t.number
});

export type BookingCreation = t.TypeOf<typeof BookingCreation>;
