import { defineDb, defineTable, column } from 'astro:db';

const Pacientes = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    nombre: column.text(),
    cedula: column.text(),
    edad: column.number(),
    fechaCita: column.date(),
    pacienteNuevo: column.boolean(),
    pacienteRecomendado: column.boolean(),
    motivoConsulta: column.text(),
    rutaImagenes: column.text(),
  },
});

export default defineDb({
  tables: { Pacientes },
});

export { Pacientes }; // Exporta el tipo Pacientes
