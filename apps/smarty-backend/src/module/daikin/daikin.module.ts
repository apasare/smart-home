import { Module } from '@nestjs/common';

import { DaikinACAdapter } from './adapter';
import { OnOffCommand } from './gaction';
import { commandsProvider } from './providers';

@Module({
  providers: [DaikinACAdapter, commandsProvider, OnOffCommand],
})
export class DaikinModule {}
