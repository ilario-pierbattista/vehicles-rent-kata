import { Response } from 'express';
import * as T from 'fp-ts/Task';

export interface ErrorResponse<E = unknown> {
  status: number;
  error: E;
}

export const makeErrorResponse: (
  status: number
) => <E>(e: E) => ErrorResponse<E> = (status) => (error) => ({
  status,
  error
});

export function applyToExpressResponse(
  response: Response
): <E>(errorResp: ErrorResponse<E>) => T.Task<Response> {
  return (e) => {
    response.status(e.status).json({ error: e.error });

    return T.of(response);
  };
}
