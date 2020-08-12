import { Response as FetchResponse } from 'node-fetch';

import { IResponse } from './response.interface';

export interface IResponseFactory {
  create<T>(response: FetchResponse): Promise<IResponse<T>>;
}
