import { FactoryProvider } from '@nestjs/common';

import { GActionCommandInterface } from '../gaction';
import { OnOffCommand, ThermostatSetModeCommand } from './gaction';

export const DAIKIN_GACTION_COMMANDS_TOKEN = 'DAIKIN_GACTION_COMMANDS';
export type GActionCommands = Map<string, GActionCommandInterface>;

export const commandsProvider: FactoryProvider = {
  provide: DAIKIN_GACTION_COMMANDS_TOKEN,
  useFactory: (
    onOffCommand: OnOffCommand,
    thermostatSetModeCommand: ThermostatSetModeCommand,
  ): GActionCommands => {
    const commands: GActionCommands = new Map();

    commands.set(onOffCommand.getName(), onOffCommand);
    commands.set(thermostatSetModeCommand.getName(), thermostatSetModeCommand);

    return commands;
  },
  inject: [OnOffCommand, ThermostatSetModeCommand],
};
