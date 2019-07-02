import { Response as FetchResponse } from "node-fetch";

export class Response<T> {
  protected response: FetchResponse;
  protected data: Map<string, string>;

  constructor(response: FetchResponse) {
    this.data = new Map<string, string>();
    this.response = response;
  }

  public async get(key: keyof T) {
    if (this.data.size === 0) {
      await this.parseResponse();
    }

    return this.data.get(key.toString());
  }

  protected async parseResponse() {
    const responseString: string = (await this.response.buffer()).toString();
    responseString.split(",").forEach((item) => {
      const keyValue = item.split("=");
      this.data.set(keyValue[0], keyValue[1]);
    });
  }
}
