import { Injectable, HttpException } from '@nestjs/common';
import { RegistrarTurnoDto } from './dto/registrar-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from '../users/entities/users.entity';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Mascotas } from '../mascota/entities/mascota.entity';
import { Turnos } from './entities/turnos.entity';
import { Estados } from './entities/estados.entity';
import { Historiaclinica } from './entities/historiaClinica.entity';
import { citasPsicoDto } from '../psicologia/dto/citas-psico.dto';
import { CreateHistoriaDto } from '../psicologia/dto/create-historia.dto';

@Injectable()
export class PsicologiaService {

    constructor(@InjectRepository(Usuarios) private userRespository: Repository<Usuarios>, 
                @InjectRepository(Mascotas) private mascotaRepository: Repository<Mascotas>,
                @InjectRepository(Turnos) private turnoRepository: Repository<Turnos>,
                @InjectRepository(Historiaclinica) private historiaRepository: Repository<Historiaclinica>){}

    
    
    async findPsicologos(){
        return this.userRespository.find({
                   select: {
                        Id_Usuario: true,
                        Nombre_Usuario: true,
                        Apellido_Usuario: true
                        }, 
                   where: {
                        Roll_Usuario: 'psicologo'
                    }});
    }

    async verTurnosDisponibles(registro: RegistrarTurnoDto){
        const {Id_Psicologo_Turno, Id_Mascota_Turno, Fecha_Inicio_Turno} = registro
        const findTurno = await this.turnoRepository.find({where: {Id_Psicologo_Turno: Id_Psicologo_Turno, Fecha_Inicio_Turno: Fecha_Inicio_Turno}});


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
        const findMascotaTurno = await this.turnoRepository.findOne({where: {Id_Mascota_Turno: Id_Mascota_Turno}});
        //si no encuentra turno, me guarda un turno
        if (!findMascotaTurno){
            //verifico que la fecha de inicio no este en un turno dado
            const verficarFecha = await this.turnoRepository.findBy({Id_Psicologo_Turno: Id_Psicologo_Turno, Fecha_Inicio_Turno: LessThanOrEqual(Fecha_Inicio_Turno), Fecha_Fin_Turno: MoreThan(Fecha_Inicio_Turno)});
            if (verficarFecha.length === 0){
                //ver el tipo de mascota para poder guardar una fecha fin
                const findMascota = await this.mascotaRepository.findOne({where:{Id_Mascota: Id_Mascota_Turno}});
                if (findMascota.Tipo_Mascota === 'perro'){

                    const fechaInicio = new Date(Fecha_Inicio_Turno);
                    const fechaFin = new Date(fechaInicio.getTime() + 30 * 60000);
                    newRegistro.Fecha_Fin_Turno = fechaFin;
                    const newTurno = this.turnoRepository.create(newRegistro);
                    return this.turnoRepository.save(newTurno);

                } else if (findMascota.Tipo_Mascota === 'gato'){

                    const fechaInicio = new Date(Fecha_Inicio_Turno);
                    const fechaFin = new Date(fechaInicio.getTime() + 45 * 60000);
                    newRegistro.Fecha_Fin_Turno = fechaFin;
                    const newTurno = this.turnoRepository.create(newRegistro);
                    return this.turnoRepository.save(newTurno);
                    
                } else {
                    throw new HttpException('La mascota no es un perro o un gato', 403);
                }
                
            }
            throw new HttpException('No se puede guardar turno', 403);
            
        } else{
            //si encuentra turno, me los muestra
            return {turno_Pendiente: findMascotaTurno};
        }
        
        
        
        
        
    }

    async verMisTurnos(id: number){
        //busco mascota por el id del usuario
        const findMascota = await this.mascotaRepository.findOne({where: {Id_Dueno: id}});
        if (!findMascota){
            throw new HttpException('PET NOT FOUND', 404);
        }

        //muestro los turnos que hay para esa mascota
        const findTurno = await this.turnoRepository.find({select: {
                                                            Estado:{
                                                                Nombre_Estado:true
                                                            }},
                                                            relations:{
                                                                Estado: true
                                                            },where: {
                                                                Id_Mascota_Turno: findMascota.Id_Mascota
                                                            }});
        if (!findTurno){
            throw new HttpException('TURNO NOT FOUND', 404);
        }

        return findTurno;
    }

    async cancelarCita(id: number){
        //buscamos cita y actualizamos el estado
        await this.turnoRepository.update({Id_Mascota_Turno: id},{Id_Estado_Turno: 4})
        return "Cita cancelada"
         
    }

    async infoMascota(id: number){
        return this.mascotaRepository.find({select:{
                                    Usuario:{
                                        Id_Usuario: true, 
                                        Nombre_Usuario: true, 
                                        Apellido_Usuario: true
                                    }},
                                    relations: {
                                        Usuario: true,
                                        Historia_Clinica: true
                                    }, 
                                    where: {
                                        Id_Mascota: id
                                    }})
    }


    async verCitas(datoCita: citasPsicoDto){
        const {Id_Psicologo,fecha} = datoCita
        return this.turnoRepository.find({select:{
                                            Estado:{
                                                Nombre_Estado:true
                                            }},
                                            relations:{
                                                Estado:true
                                            },
                                            where:{
                                                Id_Psicologo_Turno:Id_Psicologo, 
                                                Fecha_Inicio_Turno: fecha, 
                                                Id_Estado_Turno: 2
                                            }})
    }


    async terminarCita(createHistoria: CreateHistoriaDto){
        //Ver estado de la cita
        const {Id_Mascota_HistoriaClinica} = createHistoria
        const findEstadoCita = await this.turnoRepository.findOne({where:{Id_Mascota_Turno: Id_Mascota_HistoriaClinica, Id_Estado_Turno: 2}})
        if (!findEstadoCita){
            throw new HttpException('Forbidden - estado de mascota incorrecto', 403);
        }
        
        //actualizar estado de turno a terminado
        await this.turnoRepository.update({Id_Mascota_Turno: Id_Mascota_HistoriaClinica},{Id_Estado_Turno: 3});
        
        //cargar resultados a historia clinica
        const fechaHoy = new Date();
        createHistoria.Fecha_HistoriaClinica = fechaHoy;

        const newHistoria = this.historiaRepository.create(createHistoria)
        return this.historiaRepository.save(newHistoria);
    }
    

}
