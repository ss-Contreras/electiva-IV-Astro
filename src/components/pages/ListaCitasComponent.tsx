import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  edad: number;
  fechaCita: string;
  nuevoPaciente: string;
  pacienteRecomendado: string;
  motivoConsulta: string;
  rutaImagen: string;
  telefono: string;
  correoElectronico: string;
  direccion: string;
  nombreOdontologo: string;
  odontologoId: number;
}

const ListaCitasComponent: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = async () => {
    try {
      const response = await axios.get('https://localhost:7027/api/paciente');
      if (response.status === 200) {
        setPacientes(response.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error al obtener los pacientes:', err);
      setError('No se pudo obtener la lista de pacientes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-6">
      <h1 className="text-center font-bold text-2xl md:text-4xl lg:text-4xl mb-8">
        Lista de Citas
      </h1>

      {error && (
        <div className="mb-4 text-red-600 text-center">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <p>Cargando pacientes...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Nombre
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Cédula
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Edad
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Fecha de la Cita
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Paciente Nuevo
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Recomendado
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Motivo de Consulta
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Doctor Asociado
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Paciente
                </th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No hay pacientes registrados.
                  </td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.nombre}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.cedula}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.edad}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {new Date(paciente.fechaCita).toLocaleDateString()}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.nuevoPaciente}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.pacienteRecomendado}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.motivoConsulta}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.nombreOdontologo}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900">
                      {paciente.rutaImagen ? (
                        <img
                          src={`https://localhost:7027${paciente.rutaImagen}`}
                          alt="Paciente"
                          className="w-16 h-16 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        'Sin imagen'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaCitasComponent;
