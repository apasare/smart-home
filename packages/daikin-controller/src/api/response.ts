import { IResponse } from '../interface';

export class Response<T> implements IResponse<T> {
  protected data: Map<string, string> = new Map();

  public setData(data: Map<string, string>): this {
    this.data = new Map([...data]);
    return this;
  }

  public get(key: keyof T): string | undefined {
    return this.data.get(key.toString());
  }

  public static fromBuffer<T>(bodyBuffer: Buffer): Response<T> {
    const response = new Response();

    const responseString: string = bodyBuffer.toString();
    const data = new Map<string, string>();
    for (const item of responseString.split(',')) {
      const keyValue = item.split('=');
      data.set(keyValue[0], keyValue[1]);
    }
    response.setData(data);

    return response;
  }
}
