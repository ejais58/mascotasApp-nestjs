import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt/dist';
import { JwtStrategy } from './jwt/jwt.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([Usuarios]),
    JwtModule.register({
        secret: 'jwtConstants.secret',
        signOptions: { expiresIn: '1h' },
    }),],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy]
  
})
export class UsersModule {}
