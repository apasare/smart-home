import fetch, { Response as FetchResponse } from "node-fetch";

import { Response } from "./api";

export interface IBasicInfo {
  type: string;
  reg: string;
  dst: string;
  ver: string;
  rev: string;
  pow: string;
  err: string;
  location: string;
  name: string;
  icon: string;
  method: string;
  port: string;
  id: string;
  pw: string;
  lpw_flag: string;
  adp_kind: string;
  pv: string;
  cpv: string;
  cpv_minor: string;
  led: string;
  en_setzone: string;
  mac: string;
  adp_mode: string;
  en_hol: string;
  grp_name: string;
  en_grp: string;
}

export class DaikinController {
  protected deviceAddress: string;

  constructor(address: string) {
    this.deviceAddress = address;
  }

  public getBasicInfo(): Promise<Response<IBasicInfo>> {
    return this.fetch<IBasicInfo>("/common/basic_info");
  }

  protected async fetch<T>(endPoint: string, method: string = "GET"): Promise<Response<T>> {
    const response: FetchResponse = await fetch(`http://${this.deviceAddress}${endPoint}`, {
      method,
    });
    return new Response<T>(response);
  }
}
