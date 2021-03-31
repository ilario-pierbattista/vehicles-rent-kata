import * as t from 'io-ts';
import * as ty from 'io-ts-types';

export const BookingRegistered = t.strict({
  id: t.number,
  from: ty.date,
  to: ty.date
});

export type BookingRegistered = t.TypeOf<typeof BookingRegistered>;
