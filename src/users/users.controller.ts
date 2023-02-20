import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
}
