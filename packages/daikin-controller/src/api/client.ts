import fetch, { Response as FetchResponse } from 'node-fetch';

import { BasicInfo, ControlInfo, IResponse, SensorInfo } from '../interface';
import { Response } from './response';

export class Client {
  static readonly RESOURCE_BASIC_INFO = '/common/basic_info';
  static readonly RESOURCE_SENSOR_INFO = '/aircon/get_sensor_info';
  static readonly RESOURCE_CONTROL_INFO = '/aircon/get_control_info';
  static readonly RESOURCE_TIMER_INFO = '/aircon/get_scdltimer_info';
  static readonly RESOURCE_TIMER_BODY = '/aircon/get_scdltimer_body';
  static readonly RESOURCE_SET_CONTROL_INFO = '/aircon/set_control_info';

  protected baseAddress: string;

  constructor(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  protected fetch(endPoint: string, method = 'GET'): Promise<FetchResponse> {
    return fetch(`http://${this.baseAddress}${endPoint}`, {
      method,
    });
  }

  public async getBasicInfo(): Promise<IResponse<BasicInfo>> {
    const fetchResponse = await this.fetch(Client.RESOURCE_BASIC_INFO);
    return Response.fromBuffer(await fetchResponse.buffer());
  }

  public async getControlInfo(): Promise<IResponse<ControlInfo>> {
    const fetchResponse = await this.fetch(Client.RESOURCE_CONTROL_INFO);
    return Response.fromBuffer(await fetchResponse.buffer());
  }

  public async getSensorInfo(): Promise<IResponse<SensorInfo>> {
    const fetchResponse = await this.fetch(Client.RESOURCE_SENSOR_INFO);
    return Response.fromBuffer(await fetchResponse.buffer());
  }
}
