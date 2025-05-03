import { Global, Module } from '@nestjs/common';
import { GorseService } from './gorse.service';

@Global()
@Module({
  providers: [GorseService],
  exports: [GorseService],
})
export class GorseModule {}
