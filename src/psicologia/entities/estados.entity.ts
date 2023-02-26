import { Column, Entity, PrimaryColumn } from 'typeorm';



@Entity()
export class Estados{
    @PrimaryColumn()
    Id_Estado: number

    @Column()
    Nombre_Estado: string

    
}