import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Mascotas } from '../../mascota/entities/mascota.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MascotaDao{
    constructor(@InjectRepository(Mascotas) private mascotaRepository: Repository<Mascotas>){}

    async findMascotaByTipo(id: number){
        const findMascota = await this.mascotaRepository.findOne({where: {Id_Mascota: id}})
        return findMascota;
    }

    async findMascotaByDuenio(idMascota: number, payloadId: number){
        const findDuenio = await this.mascotaRepository.findOne({where:{Id_Mascota: idMascota ,Id_Dueno: payloadId}});
        return findDuenio;
    }

    async findMascotaDuenio(id: number){
        const findMascota = await this.mascotaRepository.findOne({where: {Id_Dueno: id}});
        return findMascota;
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
                Id_Dueno: id
            }})
    }
}