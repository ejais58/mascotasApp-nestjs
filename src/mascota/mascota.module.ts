import { Module } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';
import { Mascotas } from './entities/mascota.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaDao } from '../database/dao/mascotas.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Mascotas])],
  controllers: [MascotaController],
  providers: [MascotaService, MascotaDao]
})
export class MascotaModule {}
