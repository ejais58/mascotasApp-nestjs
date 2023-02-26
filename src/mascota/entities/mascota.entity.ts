import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mascotas {
    @PrimaryGeneratedColumn()
    Id_Mascota: number

    @Column()
    Nombre_Mascota: string

    @Column()
    Tipo_Mascota: string

    @Column()
    Id_Dueno: number

    @Column()
    Tiempo_Mascota: number
}