import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Usuarios } from '../../users/entities/users.entity';
import { Historiaclinica } from '../../psicologia/entities/historiaClinica.entity';

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

    @OneToOne(() => Usuarios)
    @JoinColumn({name: 'Id_Dueno'})
    Usuario: Usuarios

    @OneToMany(() => Historiaclinica, (historia) => historia.mascotas)
    Historia_Clinica: Historiaclinica[]
}