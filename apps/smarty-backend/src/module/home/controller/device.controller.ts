import { discover } from '@godvsdeity/daikin-controller';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Device } from '../entity';

@Controller('home/devices')
export class DeviceController {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  @Get()
  public async getDevices(): Promise<unknown> {
    return await this.deviceRepository.find();
  }

  @Get('discover/daikin')
  public async discover(): Promise<unknown> {
    const devices = await discover();

    const homeDevices: Device[] = [];
    for (const device of devices) {
      const physicalId = device.basic_info.get('mac');
      const homeDevice =
        (await this.deviceRepository.findOne({ physicalId })) || new Device();

      homeDevice.address = device.address;
      homeDevice.adapter = 'daikin-ac';
      homeDevice.name = decodeURI(device.basic_info.get('name'));
      homeDevice.physicalId = physicalId;
      homeDevice.additionalData = [...device.basic_info.getData()];

      homeDevices.push(homeDevice);
    }

    return this.deviceRepository.save(homeDevices);
  }
}
