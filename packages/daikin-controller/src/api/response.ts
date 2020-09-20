import { IResponse } from '../interface';

export class Response<T> implements IResponse<T> {
  protected data: Map<string, string> = new Map();

  public setData(data: [string, string][]): this {
    this.data = new Map(data);
    return this;
  }

  public getData(): Map<string, string> {
    return this.data;
  }

  public get(key: keyof T): string | undefined {
    return this.data.get(key.toString());
  }

  public static fromBuffer<T>(bodyBuffer: Buffer): Response<T> {
    const response = new Response();

    const responseString: string = bodyBuffer.toString();
    const data: [string, string][] = [];
    for (const item of responseString.split(',')) {
      const keyValue = item.split('=');
      data.push([keyValue[0], keyValue[1]]);
    }
    response.setData(data);

    return response;
  }
}
