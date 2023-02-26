import { Module } from '@nestjs/common';
import { PsicologiaController } from './psicologia.controller';
import { PsicologiaService } from './psicologia.service';
import { Turnos } from './entities/turnos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../users/entities/users.entity';
import { Mascotas } from '../mascota/entities/mascota.entity';
import { Estados } from './entities/estados.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Turnos, Usuarios, Mascotas, Estados])],
  controllers: [PsicologiaController],
  providers: [PsicologiaService]
})
export class PsicologiaModule {}
