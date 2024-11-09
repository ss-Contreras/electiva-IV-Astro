export interface Paciente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  }
  
  export interface RadiografiaDTO {
    id: number;
    imageUrl: string;
    descripcion: string;
    fecha: string;
    pacienteId: number;
    nombrePaciente: string;
    emailPaciente: string;
  }
  