import { Entity,Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Usuarios {
    @PrimaryGeneratedColumn()
    Id_Usuario: number

    @Column()
    Dni_Usuario: number

    @Column()
    Nombre_Usuario: string

    @Column()
    Apellido_Usuario: string

    @Column()
    Telefono_Usuario: string

    @Column()
    Email_Usuario: string

    @Column()
    Pass_Usuario: string

    @Column()
    Roll_Usuario: string
}