import {
  AIR_FLOW_DIRECTION,
  FAN_SPEED,
  RET,
  POWER,
  MODE,
} from '../response.interface';

export interface ControlInfo {
  ret: RET;
  pow: POWER;
  mode: MODE;
  stemp: string;
  shum: string;
  f_rate: FAN_SPEED;
  f_dir: AIR_FLOW_DIRECTION;
  adv: string;
}

export interface SetControlInfo {
  ret: RET;
  adv?: string;
}
