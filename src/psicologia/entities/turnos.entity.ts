import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Estados } from './estados.entity';


@Entity()
export class Turnos{
    
    @PrimaryGeneratedColumn()
    Id_Turno: number

    @Column()
    Id_Psicologo_Turno: number

    @Column()
    Id_Mascota_Turno: number

    @Column()
    Fecha_Inicio_Turno: Date

    @Column()
    Fecha_Fin_Turno: Date

    @Column()
    Id_Estado_Turno: number
}