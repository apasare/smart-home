export interface IResponse<T> {
  get(key: keyof T): string | undefined;
}
