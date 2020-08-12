import fetch, { Response as FetchResponse } from 'node-fetch';

import { IBasicInfo, IResponse } from '../interface';
import { Response } from './response';

export class Client {
  protected baseAddress: string;

  constructor(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  protected fetch(endPoint: string, method = 'GET'): Promise<FetchResponse> {
    return fetch(`http://${this.baseAddress}${endPoint}`, {
      method,
    });
  }

  public async getBasicInfo(): Promise<IResponse<IBasicInfo>> {
    const fetchResponse = await this.fetch('/common/basic_info');
    return Response.fromBuffer(await fetchResponse.buffer());
  }
}
