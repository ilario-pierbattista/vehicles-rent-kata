/* eslint-disable prettier/prettier */
import { Controller, Get, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response } from 'express';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { PathReporter } from 'io-ts/PathReporter';
import type { Repository } from 'typeorm';
import { VehicleRegistered } from './vehicle';
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
          E.mapLeft((e) => PathReporter.report(E.left(e))),
        )
      ),
      TE.fold(
        (e) => {
          response.status(500).json({ message: e });

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