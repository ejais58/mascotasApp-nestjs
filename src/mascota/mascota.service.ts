import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascotas } from './entities/mascota.entity';
import { PaginationDto } from '../users/dto/pagination.dto';


@Injectable()
export class MascotaService {

    constructor(@InjectRepository(Mascotas) private mascotaRespository: Repository<Mascotas>){}

    getMascotaByIdUser(id: number): Promise<Mascotas[]>{
        return this.mascotaRespository.find({where: {Id_Dueno: id}})
    }

    async getMascotasAdmin({page, limit}: PaginationDto){
        const offset = (page - 1) * limit;
        return this.mascotaRespository.find({skip: offset, take: limit});
    }
}
