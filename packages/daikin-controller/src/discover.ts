import { createSocket, Socket } from 'dgram';
import { BasicInfo, IResponse } from './interface';
import { Response } from './api';

export interface IDiscoverOptions {
  listenPort: number;
  listenAddress: string;
  probePort: number;
  probeAddress: string;
  searchTime: number;
  probeMessage: string | Buffer | Uint8Array;
}

export interface IDaikinDevice {
  address: string;
  basic_info: IResponse<BasicInfo>;
}

export interface IUDPDiscoveredDevice {
  address: string;
  message: Buffer;
}

export function udpDiscover(
  options: IDiscoverOptions
): Promise<IUDPDiscoveredDevice[]> {
  return new Promise((resolve, reject) => {
    const devices: IUDPDiscoveredDevice[] = [];
    const udpSocket: Socket = createSocket({
      reuseAddr: true,
      type: 'udp4',
    });

    udpSocket.on('error', (error) => {
      udpSocket.close();
      reject(error);
    });

    udpSocket.on('message', (message, remote) => {
      devices.push({
        message,
        address: remote.address,
      });
    });

    udpSocket.on('listening', () => {
      udpSocket.addMembership('224.0.0.1');
      udpSocket.setBroadcast(true);
      udpSocket.send(
        options.probeMessage,
        options.probePort,
        options.probeAddress
      );

      setTimeout(() => {
        udpSocket.close();
        resolve(devices);
      }, options.searchTime);
    });

    udpSocket.bind({
      address: options.listenAddress,
      port: options.listenPort,
    });
  });
}

export async function discover(
  options: Partial<IDiscoverOptions> = {}
): Promise<IDaikinDevice[]> {
  const discoverOptions: IDiscoverOptions = {
    listenAddress: '0.0.0.0',
    listenPort: 30000,
    probeAddress: '255.255.255.255',
    probeMessage: Buffer.from('DAIKIN_UDP/common/basic_info'),
    probePort: 30050,
    searchTime: 5000,
    ...options,
  };

  const devices: IDaikinDevice[] = [];
  const udpDevices = await udpDiscover(discoverOptions);
  for (const udpDevice of udpDevices) {
    devices.push({
      address: udpDevice.address,
      basic_info: Response.fromBuffer(udpDevice.message),
    });
  }

  return devices;
}
