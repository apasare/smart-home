import { Client as HttpClient } from "../http";
import { IBasicInfo, IResponse, IResponseFactory } from "../interface";
import { ResponseFactory } from "./response.factory";

export class Client extends HttpClient {
  protected responseFactory: IResponseFactory;

  constructor(baseAddress: string) {
    super(baseAddress);
    this.responseFactory = new ResponseFactory();
  }

  public async getBasicInfo(): Promise<IResponse<IBasicInfo>> {
    const fetchResponse = await this.fetch("/common/basic_info");
    return this.responseFactory.create<IBasicInfo>(fetchResponse);
  }
}
