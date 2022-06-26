import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger';
import { DaikinACAdapter } from './adapter';
import { OnOffCommand, ThermostatSetModeCommand } from './gaction';
import { commandsProvider } from './providers';

@Module({
  imports: [LoggerModule],
  providers: [
    OnOffCommand,
    ThermostatSetModeCommand,
    commandsProvider,
    DaikinACAdapter,
  ],
})
export class DaikinModule {}
