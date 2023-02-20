import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascotas } from '../mascota/entities/mascota.entity';
import { Usuarios } from '../users/entities/users.entity';

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
        entities: [Mascotas, Usuarios]
    })]
})
export class DatabaseModule {}
