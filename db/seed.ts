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
  ]);
}
