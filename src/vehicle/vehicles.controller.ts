/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response, Request } from 'express';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { PathReporter } from 'io-ts/PathReporter';
import type { Repository } from 'typeorm';
import { applyToExpressResponse, ErrorResponse, makeErrorResponse } from '../ErrorResponse';
import { encodeToEntity, Vehicle, VehicleRegistered } from './vehicle';
import { VehicleEntity } from './vehicle.entity';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    @InjectRepository(VehicleEntity)
    readonly vehiclesRepository: Repository<VehicleEntity>
  ) { }

  @Get()
  getVehicles(@Res() response: Response): Promise<Response> {
    const query: TE.TaskEither<ErrorResponse, VehicleEntity[]> = () =>
      this.vehiclesRepository
        .find({ relations: ['bookings'] })
        .then(E.right)
        .catch(flow(makeErrorResponse(500), E.left));

    return pipe(
      query,
      TE.chainEitherKW((vs) =>
        pipe(
          vs,
          A.traverse(E.either)(VehicleRegistered.decode),
          E.mapLeft((e) => makeErrorResponse(400)(PathReporter.report(E.left(e))))
        )
      ),
      TE.fold(
        applyToExpressResponse(response),
        (vs) => {
          response.status(200).json({ data: vs });

          return T.of(response);
        }
      )
    )();
  }

  @Get(':id')
  getVehicle(
    @Param() id: number,
    @Res() response: Response
  ): Promise<Response> {
    const query: TE.TaskEither<ErrorResponse, VehicleEntity> = () =>
        this.vehiclesRepository
          .findOne(id, { relations: ['bookings'] })
          .then((v) =>
            v instanceof VehicleEntity ? E.right(v) : E.left(makeErrorResponse(404)('not-found'))
          )
          .catch(flow(makeErrorResponse(500), E.left));

    return pipe(
      query,
      TE.chainEitherKW((v) =>
        pipe(
          VehicleRegistered.decode(v),
          E.mapLeft((e) => makeErrorResponse(400)(PathReporter.report(E.left(e))))
        )
      ),
      TE.fold(
        applyToExpressResponse(response),
        (vs) => {
          response.status(200).json({ data: vs });

          return T.of(response);
        }
      )
    )();
  }

  @Post()
  postVehicle(
    @Req() request: Request,
    @Res() response: Response
  ): Promise<Response> {
    const vehicleEntity = pipe(
      Vehicle.decode(request.body),
      E.bimap(
        e => makeErrorResponse(404)(PathReporter.report(E.left(e))),
        encodeToEntity
      )
    );

    return pipe(
      TE.fromEither(vehicleEntity),
      TE.chain(ve => () => this.vehiclesRepository.save([ve]).then(E.right).catch(flow(makeErrorResponse(500), E.left))),
      TE.map(inserted => ({ id: inserted[0].id })),
      TE.fold(
        applyToExpressResponse(response),
        (vs) => {
          response.status(200).json({ data: vs });

          return T.of(response);
        }
      )
    )();
  }
}
