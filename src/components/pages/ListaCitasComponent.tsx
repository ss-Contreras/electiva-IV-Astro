import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const itemsPerPage = 4;

  const fetchPacientes = async () => {
    try {
      const response = await axios.get('https://sonrisasbackendelectivaiv.somee.com/api/paciente');
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

  // Filtrar pacientes basados en el término de búsqueda
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cedula.includes(searchTerm)
  );

  // Calcular los pacientes de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPacientes = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);

  // Manejar la paginación
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredPacientes.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página cuando se realiza una búsqueda
  };

  return (
    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-6">
      <h1 className="text-center font-bold text-2xl md:text-4xl lg:text-4xl mb-8">
        Lista de Citas
      </h1>
      <div className="flex justify-between items-center mt-8 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o cédula..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded-md px-4 py-2 w-full max-w-xs text-sm"
        />
        <span className="text-gray-700 ml-4">
          Página {currentPage} de {Math.ceil(filteredPacientes.length / itemsPerPage)}
        </span>
        <div className="space-x-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            className="px-4 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredPacientes.length / itemsPerPage)}
            variant="outline"
            className="px-4 py-2 rounded disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>

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
              {currentPacientes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No hay pacientes registrados.
                  </td>
                </tr>
              ) : (
                currentPacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.nombre}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.cedula}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.edad}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {new Date(paciente.fechaCita).toLocaleDateString()}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.nuevoPaciente}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.pacienteRecomendado}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.motivoConsulta}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.nombreOdontologo}
                    </td>
                    <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                      {paciente.rutaImagen ? (
                        <img
                          src={`https://sonrisasbackendelectivaiv.somee.com${paciente.rutaImagen}`}
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
