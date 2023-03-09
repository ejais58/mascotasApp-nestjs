export interface RegistrarTurnoDto{
    Id_Psicologo_Turno: number
    Fecha_Inicio_Turno: Date
    Fecha_Fin_Turno: Date
    Id_Mascota_Turno: number
}

export interface BuscarTurnoDto{
    Id_Psicologo_Turno: number
    Fecha_Inicio_Turno: string
    Fecha_Fin_Turno: string
    Id_Mascota_Turno: number
}