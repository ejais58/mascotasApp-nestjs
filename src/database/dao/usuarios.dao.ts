import { Usuarios } from "src/users/entities/users.entity";
import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { find } from "rxjs";


@Injectable()
export class UsuarioDao{
    constructor(@InjectRepository(Usuarios)private userRespository: Repository<Usuarios>){}

    async allPsicologo(){
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

    async findPsicologoById(id: number){
        const findPsicologo = await this.userRespository.findOne({where:{Id_Usuario: id}});
        return findPsicologo;
    }
}