import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { CreateHistoriaDto } from '../../psicologia/dto/create-historia.dto';
import { Historiaclinica } from '../../psicologia/entities/historiaClinica.entity';

@Injectable()
export class HistoriaclinicaDao{
    constructor(@InjectRepository(Historiaclinica) private historiaRepository: Repository<Historiaclinica>){}

    async crearHistoria(createHistoria: CreateHistoriaDto){
        const newHistoria = this.historiaRepository.create(createHistoria)
        return this.historiaRepository.save(newHistoria);
    }
}