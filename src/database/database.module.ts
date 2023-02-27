import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascotas } from '../mascota/entities/mascota.entity';
import { Usuarios } from '../users/entities/users.entity';
import { Turnos } from '../psicologia/entities/turnos.entity';
import { Estados } from '../psicologia/entities/estados.entity';
import { Historiaclinica } from '../psicologia/entities/historiaClinica.entity';

@Module({
    imports: 
    [TypeOrmModule.forRoot({
        type: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'sa',
        password: '123456',
        database: 'NestDB',
        options: { encrypt: false },
        entities: [Mascotas, Usuarios, Turnos, Estados, Historiaclinica]
    })]
})
export class DatabaseModule {}
