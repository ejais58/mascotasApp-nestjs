import { Body, Controller, Post, UseGuards, Get, Req, HttpException, Param, ParseIntPipe } from '@nestjs/common';
import { PsicologiaService } from './psicologia.service';
import { RegistrarTurnoDto } from './dto/registrar-turno.dto';
import { JwtAuthGuard } from '../users/jwt/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../users/jwt/interfaces/jwtPayload';

@Controller('psicologia')
export class PsicologiaController {
    constructor(private readonly psicologiaService: PsicologiaService){}


    @UseGuards(JwtAuthGuard)
    @Get()
    verPsicologos(@Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;

        if (payload.roll === 'psicologo' ){
            throw new HttpException('Forbidden', 403);
        }
        return this.psicologiaService.findPsicologos();
    }

    @Get('turnos')
    verTurnosDisponibles(@Body() registro: RegistrarTurnoDto ){
        return this.psicologiaService.verTurnosDisponibles(registro);
    }

    @Post('register')
    registrarTurno(@Body() newTurno: RegistrarTurnoDto){
        return this.psicologiaService.registrarTurno(newTurno);
    }

    @UseGuards(JwtAuthGuard)
    @Get('misturnos/:id')
    verMisTurnos(@Param('id', ParseIntPipe) id: number, @Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;
        
        if (payload.id !== id){
            throw new HttpException('Forbidden', 403);
        }

        return this.psicologiaService.verMisTurnos(id);
    }
}
