import { Body, Controller, Post, UseGuards, Get, Req, HttpException, Param, ParseIntPipe,Patch } from '@nestjs/common';
import { PsicologiaService } from './psicologia.service';
import { RegistrarTurnoDto, BuscarTurnoDto } from './dto/registrar-turno.dto';
import { JwtAuthGuard } from '../users/jwt/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../users/jwt/interfaces/jwtPayload';
import { citasPsicoDto } from '../psicologia/dto/citas-psico.dto';
import { CreateHistoriaDto } from '../psicologia/dto/create-historia.dto';


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
    verTurnosDisponibles(@Body() registro: BuscarTurnoDto ){
        return this.psicologiaService.verTurnosDisponibles(registro);
    }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    registrarTurno(@Body() newTurno: RegistrarTurnoDto, @Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;

        if (payload.roll === 'psicologo' ){
            throw new HttpException('Forbidden', 403);
        }
        return this.psicologiaService.registrarTurno(newTurno, payload.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('misturnos/:id')
    verMisTurnos(@Param('id', ParseIntPipe) id: number, @Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;
        
        if (payload.roll === 'psicologo' ){
            throw new HttpException('Forbidden', 403);
        }

        return this.psicologiaService.verMisTurnos(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('cancelarcita/:id')
    cancelarCita(@Param('id', ParseIntPipe) id: number,@Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;
        
        if (payload.id !== id){
            throw new HttpException('Forbidden', 403);
        }
        return this.psicologiaService.cancelarCita(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('infomascota/:id')
    verInfoMascota(@Param('id', ParseIntPipe) id: number, @Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;
        
        if (payload.id !== id){
            throw new HttpException('Forbidden', 403);
        }
        return this.psicologiaService.infoMascota(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('citas')
    verCitas(@Body() datoCita: citasPsicoDto, @Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;

        if (payload.roll === 'cliente' ){
            throw new HttpException('Forbidden', 403);
        }
        return this.psicologiaService.verCitas(datoCita);
    }

    @UseGuards(JwtAuthGuard)
    @Post('terminarcita')
    terminarCita(@Body() createHistoria: CreateHistoriaDto, @Req() req){
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'jwtConstants.secret');
        const payload = decoded as JwtPayload;

        if (payload.roll === 'cliente' ){
            throw new HttpException('Forbidden', 403);
        }
        return this.psicologiaService.terminarCita(createHistoria);
    }

    
}
