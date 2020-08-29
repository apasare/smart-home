import { RET } from '../response.interface';

export interface SensorInfo {
  ret: RET;
  htemp: string;
  hhum: string;
  otemp: string;
  err: string;
  cmpfreq: string;
}
