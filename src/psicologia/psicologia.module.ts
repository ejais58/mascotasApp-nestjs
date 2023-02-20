import { Module } from '@nestjs/common';
import { PsicologiaController } from './psicologia.controller';
import { PsicologiaService } from './psicologia.service';

@Module({
  controllers: [PsicologiaController],
  providers: [PsicologiaService]
})
export class PsicologiaModule {}
