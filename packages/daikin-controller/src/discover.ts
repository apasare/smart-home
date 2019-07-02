import { createSocket, Socket } from "dgram";

export interface IDiscoverOptions {
  listenPort: number;
  listenAddress: string;
  probePort: number;
  probeAddress: string;
  searchTime: number;
  probeMessage: string | any[] | Buffer | Uint8Array;
}

export interface IDaikinDevice {
  address: string;
  basic_info: string | Buffer;
}

export function discover(options: Partial<IDiscoverOptions> = {}) {
  const discoverOptions: IDiscoverOptions = {
    listenAddress: "0.0.0.0",
    listenPort: 30000,
    probeAddress: "255.255.255.255",
    probeMessage: Buffer.from("DAIKIN_UDP/common/basic_info"),
    probePort: 30050,
    searchTime: 5000,
    ...options,
  };

  const devices: IDaikinDevice[] = [];

  return new Promise<IDaikinDevice[]>((resolve, reject) => {
    const udpSocket: Socket = createSocket({
      reuseAddr: true,
      type: "udp4",
    });

    udpSocket.on("error", (error) => {
      udpSocket.close();
      reject(error);
    });

    udpSocket.on("message", (message, remote) => {
      devices.push({
        address: remote.address,
        basic_info: message,
      });
    });

    udpSocket.on("listening", () => {
      udpSocket.addMembership("224.0.0.1");
      udpSocket.setBroadcast(true);
      udpSocket.send(discoverOptions.probeMessage, discoverOptions.probePort, discoverOptions.probeAddress);

      setTimeout(() => {
        udpSocket.close();
        resolve(devices);
      }, discoverOptions.searchTime);
    });

    udpSocket.bind({
      address: discoverOptions.listenAddress,
      port: discoverOptions.listenPort,
    });
  });
}
