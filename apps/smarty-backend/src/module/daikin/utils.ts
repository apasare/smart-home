import { MODE, POWER } from '@apasare/daikin-controller';
import { ThermostatMode } from '../gaction';

export function getGActionThermostatMode(
  deviceThermostatMode: MODE,
): ThermostatMode {
  switch (deviceThermostatMode) {
    case MODE.AUTO:
      return ThermostatMode.AUTO;
    case MODE.COOL:
      return ThermostatMode.COOL;
    case MODE.HEAT:
      return ThermostatMode.HEAT;
    case MODE.DRY:
      return ThermostatMode.DRY;
    case MODE.FAN:
      return ThermostatMode.FAN_ONLY;
    default:
      return ThermostatMode.NONE;
  }
}

export function getDeviceThermostatMode(
  gactionThermostatMode: ThermostatMode,
): MODE {
  switch (gactionThermostatMode) {
    case ThermostatMode.COOL:
      return MODE.COOL;
    case ThermostatMode.HEAT:
      return MODE.HEAT;
    case ThermostatMode.DRY:
      return MODE.DRY;
    case ThermostatMode.FAN_ONLY:
      return MODE.FAN;
    case ThermostatMode.AUTO:
      return MODE.AUTO;
    default:
      throw new Error(`Unsupported thermostat mode "${gactionThermostatMode}"`);
  }
}
