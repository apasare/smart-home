import { Response as FetchResponse } from 'node-fetch';

import { IResponse } from '../interface';

export class Response<T> implements IResponse<T> {
  protected data: Map<string, string> = new Map<string, string>();
  protected response: FetchResponse;

  constructor(response: FetchResponse) {
    this.response = response;
  }

  public setData(data: Map<string, string>): this {
    this.data = new Map([...data]);
    return this;
  }

  public get(key: keyof T): string | undefined {
    return this.data.get(key.toString());
  }
}
