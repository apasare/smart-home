export enum RET {
  OK = 'OK',
  PARAM_NG = 'PARAM NG',
}

export enum POWER {
  ON = '1',
  OFF = '0',
}

export enum MODE {
  AUTO = '0',
  DRY = '2',
  COOL = '3',
  HEAT = '4',
  FAN = '6',
}

export enum FAN_SPEED {
  AUTO = 'A',
  QUIET = 'B',
  LEVEL_1 = '3',
  LEVEL_2 = '4',
  LEVEL_3 = '5',
  LEVEL_4 = '6',
  LEVEL_5 = '7',
}

export enum AIR_FLOW_DIRECTION {
  OFF = '0',
  UP_DOWN = '1',
  LEFT_RIGHT = '2',
  THREED = '3',
}

export interface IResponse<T = Record<string, unknown>> {
  get(key: keyof T): string | undefined;
}
