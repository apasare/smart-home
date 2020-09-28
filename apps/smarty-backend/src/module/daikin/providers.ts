import { FactoryProvider } from '@nestjs/common';
import { GActionCommandInterface } from '../gaction';
import { OnOffCommand } from './gaction';

export const DAIKIN_GACTION_COMMANDS_TOKEN = 'DAIKIN_GACTION_COMMANDS';
export type GActionCommands = Map<string, GActionCommandInterface>;

export const commandsProvider: FactoryProvider = {
  provide: DAIKIN_GACTION_COMMANDS_TOKEN,
  useFactory: (onOffCommand: OnOffCommand): GActionCommands => {
    const commands: GActionCommands = new Map();
    commands.set(onOffCommand.getName(), onOffCommand);
    return commands;
  },
  inject: [OnOffCommand],
};
