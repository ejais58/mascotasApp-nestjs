import { Module } from '@nestjs/common';
import { PsicologiaController } from './psicologia.controller';
import { PsicologiaService } from './psicologia.service';
import { Turnos } from './entities/turnos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../users/entities/users.entity';
import { Mascotas } from '../mascota/entities/mascota.entity';
import { Estados } from './entities/estados.entity';
import { Historiaclinica } from './entities/historiaClinica.entity';
import { UsuarioDao } from '../database/dao/usuarios.dao';
import { MascotaDao } from '../database/dao/mascotas.dao';
import { TurnosDao } from '../database/dao/turnos.dao';
import { HistoriaclinicaDao } from '../database/dao/historiaclinica.dao';



@Module({
  imports: [TypeOrmModule.forFeature([Turnos, Usuarios, Mascotas, Estados, Historiaclinica])],
  controllers: [PsicologiaController],
  providers: [PsicologiaService, UsuarioDao, MascotaDao, TurnosDao, HistoriaclinicaDao, Historiaclinica]
})
export class PsicologiaModule {}
