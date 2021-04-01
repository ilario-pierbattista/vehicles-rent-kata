import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';

type ResultType<T> =
  | {
      errors: string;
    }
  | {
      res: T;
    };

export type SchemaDefinition<I, A> = t.Decoder<I, A>;

export function validate<I, A>(
  schema: SchemaDefinition<I, A>,
  payload: I
): ResultType<A> {
  return pipe(
    schema.decode(payload),
    E.fold(
      (errors) => {
        const result: ResultType<A> = {
          errors: formatValidationErrors(errors).join(',')
        };
        return result as ResultType<A>;
      },
      (res) => {
        const result: ResultType<A> = { res };
        return result;
      }
    )
  );
}
