import { db, Pacientes } from 'astro:db';

export default async function () {
  await db.insert(Pacientes).values([
    {
      nombre: "Juan Pérez",
      cedula: "1234567890",
      edad: 45,
      fechaCita: new Date('2024-08-20'),
      pacienteNuevo: true,
      pacienteRecomendado: false,
      motivoConsulta: "Dolor de diente",
      rutaImagenes: "images/juan_perez.jpg",
    },
    {
      nombre: "María González",
      cedula: "0987654321",
      edad: 30,
      fechaCita: new Date('2024-08-22'),
      pacienteNuevo: false,
      pacienteRecomendado: true,
      motivoConsulta: "Revisión general",
      rutaImagenes: "images/maria_gonzales.png",
    },
    {
      nombre: "Sergio Contreras",
      cedula: "1006875130",
      edad: 21,
      fechaCita: new Date('2024-08-22'),
      pacienteNuevo: false,
      pacienteRecomendado: false,
      motivoConsulta: "Me duele el pie",
      rutaImagenes: "images/person.png",
    },
    {
      nombre: "Pepito Pérez",
      cedula: "0987654321",
      edad: 40,
      fechaCita: new Date('2024-08-22'),
      pacienteNuevo: false,
      pacienteRecomendado: true,
      motivoConsulta: "Revisión general",
      rutaImagenes: "images/person2.png",
    },
  ]);
}
