export const ITodoToken = Symbol('ITodoToken');

export const ITodoClientPath = 'ITodoClientPath';

export const ITodoClientToken = Symbol('ITodoClientToken');

export interface ITodoServiceClient {
  test();

  query(): Promise<void>;
}
