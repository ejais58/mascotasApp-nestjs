import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Turnos } from '../../psicologia/entities/turnos.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual, MoreThan, LessThan } from 'typeorm';
import { RegistrarTurnoDto } from '../../psicologia/dto/registrar-turno.dto';

@Injectable()
export class TurnosDao{
    constructor(@InjectRepository(Turnos) private turnoRepository: Repository<Turnos>){}

    async turnosDisponibles(fechaInicio: Date, fechaFin: Date){
        const turnoDisponible = await this.turnoRepository.find({where: [{
            Fecha_Inicio_Turno: LessThanOrEqual(fechaInicio),
            Fecha_Fin_Turno: MoreThanOrEqual(fechaInicio)
        },
        {
            Fecha_Inicio_Turno: LessThan(fechaFin),
            Fecha_Fin_Turno: MoreThan(fechaFin)
        }]})

        return turnoDisponible;
    }

    async registrarTurno(newRegistro: RegistrarTurnoDto){
        const newTurno = this.turnoRepository.create(newRegistro);
        return this.turnoRepository.save(newTurno);
    }

    async findMascotaTurno(id: number){
        const findMascotaTurno = await this.turnoRepository.findOne({where: {Id_Mascota_Turno: id}});
        return findMascotaTurno;
    }

    async findTurnoByFecha(idPsico: number, fechaInicio: Date){
        const verficarFecha = await this.turnoRepository.findBy({Id_Psicologo_Turno: idPsico, Fecha_Inicio_Turno: LessThanOrEqual(fechaInicio), Fecha_Fin_Turno: MoreThan(fechaInicio)});
        return verficarFecha;
    }

    async findTurnoPendiente(idMascota: number){
        const findTurno = await this.turnoRepository.find({select: {
            Estado:{
                Nombre_Estado:true
            }},
            relations:{
                Estado: true
            },where: {
                Id_Mascota_Turno: idMascota
            }});
        return findTurno;
    }

    async cancelarTurno(idMascota: number){
        return this.turnoRepository.update({Id_Mascota_Turno: idMascota},{Id_Estado_Turno: 4})
    }

    async verCitas(idPsico: number, fecha: Date){
        return this.turnoRepository.find({select:{
            Estado:{
                Nombre_Estado:true
            }},
            relations:{
                Estado:true
            },
            where:{
                Id_Psicologo_Turno: idPsico, 
                Fecha_Inicio_Turno: fecha, 
                Id_Estado_Turno: 2
            }})
    }

    async verEstadoCita(idMascota: number){
        const findEstadoCita = await this.turnoRepository.findOne({where:{Id_Mascota_Turno: idMascota, Id_Estado_Turno: 2}})
        return findEstadoCita;
    }

    async actualizarEstadoTurno(idMascota: number){
        return this.turnoRepository.update({Id_Mascota_Turno: idMascota},{Id_Estado_Turno: 3});
    }
}