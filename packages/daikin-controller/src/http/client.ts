import fetch, { Response } from "node-fetch";

export class Client {
  protected baseAddress: string;

  constructor(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  protected fetch(endPoint: string, method: string = "GET"): Promise<Response> {
    return fetch(`http://${this.baseAddress}${endPoint}`, {
      method,
    });
  }
}
