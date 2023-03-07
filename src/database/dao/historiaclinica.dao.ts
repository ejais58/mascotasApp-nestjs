import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Historiaclinica } from "src/psicologia/entities/historiaClinica.entity";
import { Repository } from 'typeorm';
import { CreateHistoriaDto } from '../../psicologia/dto/create-historia.dto';

@Injectable()
export class HistoriaclinicaDao{
    constructor(@InjectRepository(Historiaclinica) private historiaRepository: Repository<Historiaclinica>){}

    async CrearHistoriaClinica(createHistoria: CreateHistoriaDto){
        const newHistoria = this.historiaRepository.create(createHistoria)
        return this.historiaRepository.save(newHistoria);
    }
}