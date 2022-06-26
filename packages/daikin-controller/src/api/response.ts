import { IResponse } from '../interface';

export class Response<T> implements IResponse<T> {
  protected data = new Map<keyof T, T[keyof T]>();

  public setData(data: [keyof T, T[keyof T]][]): this {
    this.data = new Map(data);
    return this;
  }

  public getData(): Map<keyof T, T[keyof T]> {
    return this.data;
  }

  public get<K extends keyof T>(key: K): T[K] | undefined {
    return this.data.get(key) as T[K] | undefined;
  }

  public static fromBuffer<T>(bodyBuffer: Buffer): Response<T> {
    const response = new Response<T>();

    const responseString: string = bodyBuffer.toString();
    const data: [keyof T, T[keyof T]][] = [];
    for (const item of responseString.split(',')) {
      const keyValue = item.split('=');
      data.push([keyValue[0] as keyof T, keyValue[1] as unknown as T[keyof T]]);
    }
    response.setData(data);

    return response;
  }
}
