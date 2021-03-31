import { Controller, Post, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Repository } from 'typeorm';
import { applyToExpressResponse, makeErrorResponse } from '../ErrorResponse';
import { VehicleEntity } from '../vehicle/vehicle.entity';
import { BookingCreation } from './booking';
import { BookingEntity } from './booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(
    @InjectRepository(VehicleEntity)
    readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(BookingEntity)
    readonly bookingRepository: Repository<BookingEntity>
  ) {}

  @Post()
  postBooking(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const payload = pipe(
      TE.fromEither(BookingCreation.decode(req.body)),
      TE.mapLeft((e) => makeErrorResponse(400)(PathReporter.report(E.left(e))))
    );

    return pipe(
      payload,
      TE.chain((p) => () =>
        this.vehicleRepository
          .findOne(p.vehicleId)
          .then((v) =>
            v instanceof VehicleEntity
              ? E.right({ payload: p, vehicle: v })
              : E.left(makeErrorResponse(400)('vehicle not found'))
          )
          .catch(flow(makeErrorResponse(500), E.left))
      ),
      TE.chain(({ payload: p, vehicle: v }) => {
        const booking = new BookingEntity();

        booking.from = p.from;
        booking.to = p.to;
        booking.vehicle = v;

        return () =>
          this.bookingRepository
            .save([booking])
            .then((bs) => E.right(bs[0]))
            .catch(flow(makeErrorResponse(500), E.left));
      }),
      TE.fold(applyToExpressResponse(res), (b) => {
        res.status(201).json({ data: { id: b.id } });

        return T.of(res);
      })
    )();
  }
}
