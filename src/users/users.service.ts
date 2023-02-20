import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Usuarios } from './entities/users.entity';
import * as argon2 from 'argon2';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Usuarios) private userRespository: Repository<Usuarios>, private jwtService: JwtService){}

    async createUser(user: CreateUserDto): Promise<Usuarios>{
        //Hash password
        user.Pass_Usuario = await argon2.hash(user.Pass_Usuario, {
            type: argon2.argon2d,
            memoryCost: 2 ** 16,
            hashLength: 50
        });
        
        //Create personal
        const newUser = this.userRespository.create(user);
        return this.userRespository.save(newUser);
    }

    async login(personal: LoginUserDto){
        
        const { Email_Usuario, Pass_Usuario} = personal;

        /*Busco si existe en la base de datos el nombre ingresado en el cliente, 
        y hasheo la contraseña ingresada para comparar con la contraseña de la base de datos*/
        const findUser = await this.userRespository.findOne({where: {Email_Usuario: Email_Usuario}});;
        if (!findUser){
            throw new HttpException('USER NOT FOUND', 404);
        }

        //Validar contraseñas (base de datos y la ingresada por el cliente)
        const validar = await argon2.verify(findUser.Pass_Usuario, Pass_Usuario)
        if (!validar){
            throw new HttpException('PASSWORD INVALID', 403);
        } 

        //generar jwt
        const payload = {id: findUser.Id_Usuario, nombre: findUser.Nombre_Usuario, roll: findUser.Roll_Usuario}
        const token = this.jwtService.sign(payload)
        const data = {token}
        return data;
    }
}
