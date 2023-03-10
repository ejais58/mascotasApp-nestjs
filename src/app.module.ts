import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MascotaModule } from './mascota/mascota.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { PsicologiaModule } from './psicologia/psicologia.module';

@Module({
  imports: [MascotaModule, UsersModule, DatabaseModule, PsicologiaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
