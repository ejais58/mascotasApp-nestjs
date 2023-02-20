import { Body, Controller, Get, Post, UseGuards, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';
import { Req } from '@nestjs/common/decorators';
import { JwtPayload } from '../users/jwt/interfaces/jwtPayload';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('register')
    postUsuario(@Body() newUser: CreateUserDto){
        return this.usersService.createUser(newUser);
    }

    @Post('login')
    login(@Body() user: LoginUserDto){
        return this.usersService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('psicologos')
    getAllPsicologo(@Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;

        if (payload.roll === 'psicologo' ){
            throw new HttpException('Forbidden', 403);
        }
        return this.usersService.findPsicologos();
    }
}
