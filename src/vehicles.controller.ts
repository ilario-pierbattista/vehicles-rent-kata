/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response, Request } from 'express';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { PathReporter } from 'io-ts/PathReporter';
import type { Repository } from 'typeorm';
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
    const x: TE.TaskEither<string, VehicleEntity[]> = () =>
      this.vehiclesRepository
        .find()
        .then((vs) => E.right(vs))
        .catch((_) => E.left('fetch-error'));

    return pipe(
      x,
      TE.chainEitherKW((vs) =>
        pipe(
          vs,
          A.traverse(E.either)(VehicleRegistered.decode),
          E.mapLeft((e) => PathReporter.report(E.left(e)))
        )
      ),
      TE.fold(
        (e) => {
          response.status(400).json({ error: e });

          return T.of(response);
        },
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
    const query: RTE.ReaderTaskEither<number, string, VehicleEntity> = (
      vehicleId
    ) => () =>
        this.vehiclesRepository
          .findOne(vehicleId)
          .then((v) =>
            v instanceof VehicleEntity ? E.right(v) : E.left('not-found')
          )
          .catch((_) => E.left('fetch-error'));

    return pipe(
      query,
      RTE.chainEitherKW((v) =>
        pipe(
          VehicleRegistered.decode(v),
          E.mapLeft((e) => PathReporter.report(E.left(e)))
        )
      ),
      (q) => q(id),
      TE.fold(
        (e) => {
          response.status(400).json({ error: e });

          return T.of(response);
        },
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
        e => PathReporter.report(E.left(e)),
        encodeToEntity
      )
    );

    return pipe(
      TE.fromEither(vehicleEntity),
      TE.chain(ve => () => this.vehiclesRepository.save([ve]).then(E.right).catch(E.left)),
      TE.map(inserted => ({ id: inserted[0].id })),
      TE.fold(
        (e) => {
          response.status(400).json({ error: e });

          return T.of(response);
        },
        (vs) => {
          response.status(200).json({ data: vs });

          return T.of(response);
        }
      )
    )();
  }
}
