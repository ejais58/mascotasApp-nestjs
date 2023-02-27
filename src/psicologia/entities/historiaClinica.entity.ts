import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Mascotas } from '../../mascota/entities/mascota.entity';

@Entity()
export class Historiaclinica{
    @PrimaryGeneratedColumn()
    Id_HistoriaClinica: number

    @Column()
    Id_Mascota_HistoriaClinica: number

    @Column()
    Fecha_HistoriaClinica: Date

    @Column()
    Evaluacion_HistoriaClinica: string

    @ManyToOne(() => Mascotas, (mascota) => mascota.Historia_Clinica)
    @JoinColumn({ name: "Id_Mascota_HistoriaClinica" })
    mascotas: Mascotas
}