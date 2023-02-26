import { Injectable, HttpException } from '@nestjs/common';
import { RegistrarTurnoDto } from './dto/registrar-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { Mascotas } from '../mascota/entities/mascota.entity';
import { Turnos } from './entities/turnos.entity';
import { Estados } from './entities/estados.entity';

@Injectable()
export class PsicologiaService {

    constructor(@InjectRepository(Usuarios) private userRespository: Repository<Usuarios>, 
                @InjectRepository(Mascotas) private mascotaRepository: Repository<Mascotas>,
                @InjectRepository(Turnos) private turnoRepository: Repository<Turnos>){}

    
    
    async findPsicologos(){
        return this.userRespository.find({
                   select: {
                        Id_Usuario: true,
                        Nombre_Usuario: true,
                        Apellido_Usuario: true
                        }, 
                   where: {
                        Roll_Usuario: 'psicologo'
                    }})
    }

    async verTurnosDisponibles(registro: RegistrarTurnoDto){
        const {Id_Psicologo_Turno, Id_Mascota_Turno, Fecha_Inicio_Turno} = registro
        const findTurno = await this.turnoRepository.find({where: {Id_Psicologo_Turno: Id_Psicologo_Turno, Fecha_Inicio_Turno: Fecha_Inicio_Turno}})


        const fechaInicio = new Date(Fecha_Inicio_Turno);
        const horaInicio = fechaInicio.getHours();
        return findTurno;
    }

    async registrarTurno(newRegistro: RegistrarTurnoDto){
        const {Id_Psicologo_Turno, Id_Mascota_Turno, Fecha_Inicio_Turno} = newRegistro
        

        //buscamos si es psicologo
        const findPsicologo = await this.userRespository.findOne({where:{Id_Usuario: Id_Psicologo_Turno}});
        if (findPsicologo.Roll_Usuario !== 'psicologo'){
            throw new HttpException('PSICOLOGO NOT FOUND', 404);
        }

        //buscar si no hay turnos pendientes para esa mascota
        const findMascota = await this.turnoRepository.find({where: {Id_Mascota_Turno: Id_Mascota_Turno}})
        if (!findMascota){
            //si no encuentra turno, me guarda un turno
            const newTurno = this.turnoRepository.create(newRegistro)
            return this.turnoRepository.save(newTurno)
        } else {
            //si encuentra turno, me los muestra
            return {turnos_Pendientes: findMascota};
        }
        
        
        
        
        
    }

    async verMisTurnos(id: number){
        //busco mascota por el id del usuario
        const findMascota = await this.mascotaRepository.findOne({where: {Id_Dueno: id}});
        if (!findMascota){
            throw new HttpException('PET NOT FOUND', 404);
        }

        //muestro los turnos que hay para esa mascota
        const findTurno = await this.turnoRepository.find({where: {Id_Mascota_Turno: findMascota.Id_Mascota}})
        if (!findTurno){
            throw new HttpException('TURNO NOT FOUND', 404);
        }

        return findTurno;
    }
}
