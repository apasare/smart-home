import { Response as FetchResponse } from 'node-fetch';

import { IResponse, IResponseFactory } from '../interface';
import { Response } from './response';

export class ResponseFactory implements IResponseFactory {
  public async create<T>(fetchResponse: FetchResponse): Promise<IResponse<T>> {
    const response = new Response<T>(fetchResponse);

    const responseString: string = (await fetchResponse.buffer()).toString();
    const data = new Map<string, string>();
    for (const item of responseString.split(',')) {
      const keyValue = item.split('=');
      data.set(keyValue[0], keyValue[1]);
    }
    response.setData(data);

    return response;
  }
}
