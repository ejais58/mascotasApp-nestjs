import { Injectable, HttpException, Inject } from '@nestjs/common';
import { RegistrarTurnoDto } from './dto/registrar-turno.dto';
import { Historiaclinica } from './entities/historiaClinica.entity';
import { citasPsicoDto } from '../psicologia/dto/citas-psico.dto';
import { CreateHistoriaDto } from '../psicologia/dto/create-historia.dto';
import { UsuarioDao } from '../database/dao/usuarios.dao';
import { MascotaDao } from '../database/dao/mascotas.dao';
import { TurnosDao } from '../database/dao/turnos.dao';
import { HistoriaclinicaDao } from '../database/dao/historiaclinica.dao';

@Injectable()
export class PsicologiaService {

    constructor(@Inject(UsuarioDao) private readonly usuarioDao: UsuarioDao,
                @Inject(MascotaDao) private readonly mascotaDao: MascotaDao,
                @Inject(TurnosDao) private readonly turnoDao : TurnosDao,
                @Inject(Historiaclinica) private readonly historiaDao: HistoriaclinicaDao){}

    
    
    async findPsicologos(){
        return this.usuarioDao.allPsicologo();
    }

    async verTurnosDisponibles(registro: RegistrarTurnoDto){
        const {Id_Psicologo_Turno, Id_Mascota_Turno, Fecha_Inicio_Turno} = registro

        //buscamos si es psicologo
        const findPsicologo = await this.usuarioDao.findPsicologoById(Id_Psicologo_Turno);
        if (findPsicologo.Roll_Usuario !== 'psicologo'){
            throw new HttpException('PSICOLOGO NOT FOUND', 404);
        }

        const fechaHoraInicio = new Date(Fecha_Inicio_Turno);
        fechaHoraInicio.setHours(9,0,0,0)
        const fechaHoraFin = new Date(Fecha_Inicio_Turno);
        fechaHoraFin.setHours(18,0,0,0)

        let siguienteTurno = fechaHoraInicio;
        const arrayTurnosDisponiblesPerro = [];
        const arrayTurnosDisponiblesGato = [];
        
        //ver el tipo de mascota
        const findMascota = await this.mascotaDao.findMascotaByTipo(Id_Mascota_Turno)
        if (findMascota.Tipo_Mascota === 'perro'){
            while (siguienteTurno <= fechaHoraFin) {
                const tiempoFinPerro = new Date(siguienteTurno.getTime() + 30 * 60000)
                //mostrar turnos de ese dia para perros
                const turnoDisponible = await this.turnoDao.turnosDisponibles(siguienteTurno, tiempoFinPerro);

                if (turnoDisponible.length === 0){
                    arrayTurnosDisponiblesPerro.push(new Date(siguienteTurno))
                }
                siguienteTurno = tiempoFinPerro;
            }
            return {turnos_perros: arrayTurnosDisponiblesPerro}
        }
        else if (findMascota.Tipo_Mascota === 'gato') {
            while (siguienteTurno <= fechaHoraFin) {
                const tiempoFinGato = new Date(siguienteTurno.getTime() + 45 * 60000)
                //mostrar turnos de ese dia para perros
                const turnoDisponible = await this.turnoDao.turnosDisponibles(siguienteTurno, tiempoFinGato);

                if (turnoDisponible.length === 0){
                    arrayTurnosDisponiblesGato.push(new Date(siguienteTurno))
                }
                siguienteTurno = tiempoFinGato;
            }
            return {turnos_gatos: arrayTurnosDisponiblesGato}
        }
        
        
        
    }

    async registrarTurno(newRegistro: RegistrarTurnoDto, payloadId: number){
        const {Id_Psicologo_Turno, Id_Mascota_Turno, Fecha_Inicio_Turno} = newRegistro
        

        //buscamos si es psicologo
        const findPsicologo = await this.usuarioDao.findPsicologoById(Id_Psicologo_Turno);
        if (findPsicologo.Roll_Usuario !== 'psicologo'){
            throw new HttpException('PSICOLOGO NOT FOUND', 404);
        }

        //buscamos si es su dueño
        const findDuenio = await this.mascotaDao.findMascotaByDuenio(Id_Mascota_Turno, payloadId)
        if(!findDuenio){
            throw new HttpException('No es su dueño', 404);
        }
        
        //buscar si no hay turnos pendientes para esa mascota
        const findMascotaTurno = await this.turnoDao.findMascotaTurno(Id_Mascota_Turno)
        //si no encuentra turno, me guarda un turno
        if (!findMascotaTurno){
            //verifico que la fecha de inicio no este en un turno dado
            const verficarFecha = await this.turnoDao.findTurnoByFecha(Id_Psicologo_Turno, Fecha_Inicio_Turno)
            if (verficarFecha.length === 0){
                //ver el tipo de mascota para poder guardar una fecha fin
                const findMascota = await this.mascotaDao.findMascotaByTipo(Id_Mascota_Turno)
                if (findMascota.Tipo_Mascota === 'perro'){

                    const fechaInicio = new Date(Fecha_Inicio_Turno);
                    const fechaFin = new Date(fechaInicio.getTime() + 30 * 60000);
                    newRegistro.Fecha_Fin_Turno = fechaFin;
                    //guardar turno
                    return this.turnoDao.registrarTurno(newRegistro);
 

                } else if (findMascota.Tipo_Mascota === 'gato'){

                    const fechaInicio = new Date(Fecha_Inicio_Turno);
                    const fechaFin = new Date(fechaInicio.getTime() + 45 * 60000);
                    newRegistro.Fecha_Fin_Turno = fechaFin;
                    //guardar turno
                    return this.turnoDao.registrarTurno(newRegistro);
                    
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
        return this.mascotaDao.turnosMascota(id);
    }

    async cancelarCita(id: number){
        //buscamos cita y actualizamos el estado
        await this.turnoDao.cancelarTurno(id)
        return "Cita cancelada"
         
    }

    async infoMascota(id: number){
        return this.mascotaDao.infoMascota(id);
    }


    async verCitas(datoCita: citasPsicoDto){
        const {Id_Psicologo,fecha} = datoCita
        return this.turnoDao.verCitas(Id_Psicologo, fecha);
    }


    async terminarCita(createHistoria: CreateHistoriaDto){
        //Ver estado de la cita
        const {Id_Mascota_HistoriaClinica} = createHistoria
        const findEstadoCita = await this.turnoDao.verEstadoCita(Id_Mascota_HistoriaClinica);
        if (!findEstadoCita){
            throw new HttpException('Forbidden - estado de mascota incorrecto', 403);
        }
        
        //actualizar estado de turno a terminado
        await this.turnoDao.actualizarEstadoTurno(Id_Mascota_HistoriaClinica);
        
        //cargar resultados a historia clinica
        const fechaHoy = new Date();
        createHistoria.Fecha_HistoriaClinica = fechaHoy;

        return this.historiaDao.crearHistoria(createHistoria);
    }
    

}
