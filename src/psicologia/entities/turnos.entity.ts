import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Estados } from './estados.entity';
import { Mascotas } from '../../mascota/entities/mascota.entity';


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

    @OneToOne(() => Estados)
    @JoinColumn({name: 'Id_Estado_Turno'})
    Estado: Estados

    @ManyToOne(() => Mascotas, (mascota) => mascota.Turnos)
    @JoinColumn({name: 'Id_Mascota_Turno'})
    Mascotas: Mascotas
}