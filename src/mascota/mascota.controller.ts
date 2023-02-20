import { Controller, Get, UseGuards, Param, ParseIntPipe, Req, HttpException, Query } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { JwtAuthGuard } from '../users/jwt/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../users/jwt/interfaces/jwtPayload';
import { PaginationDto } from '../users/dto/pagination.dto';

@Controller('mascotas')
export class MascotaController {
    constructor(private readonly mascotaService: MascotaService){}
    
    @UseGuards(JwtAuthGuard)
    @Get('usuario/:id')
    async mascotasList(@Param('id', ParseIntPipe) id: number, @Req() req){
        //const payload1 = req.user;
        
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;
        //return payload.id;
         
        if (payload.id !== id){
            throw new HttpException('Forbidden', 403);
        }
        return this.mascotaService.getMascotaByIdUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Query() pagination: PaginationDto, @Req() req){

        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;
        //return payload.id;
         
        if (payload.roll !== 'admin'){
            throw new HttpException('Forbidden', 403);
        }
        return this.mascotaService.getMascotasAdmin(pagination);
    }
}
