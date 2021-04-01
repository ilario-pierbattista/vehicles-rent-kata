import { BadRequestException, PipeTransform } from '@nestjs/common';
import { SchemaDefinition, validate } from './io-ts-validator';

export class IoTsValidationPipe<I, A> implements PipeTransform {
  constructor(private readonly schema: SchemaDefinition<I, A>) {}

  transform(value: any): A | never {
    const r = validate<I, A>(this.schema, value);

    if ('res' in r) {
      return r.res;
    }

    throw new BadRequestException(r.errors);
  }
}
