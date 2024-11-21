import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import { FiEdit, FiTrash2, FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import '../../styles/global.css';
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
  odontologoId: number;
  nombreOdontologo: string;
}

interface Odontologo {
  id: number;
  nombre: string;
}

Modal.setAppElement('#root');

const PacienteComponent: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [pacienteToEdit, setPacienteToEdit] = useState<Paciente | null>(null);

  const [formEdit, setFormEdit] = useState<{
    nombre: string;
    cedula: string;
    edad: number;
    fechaCita: string;
    nuevoPaciente: string;
    pacienteRecomendado: string;
    motivoConsulta: string;
    telefono: string;
    email: string;
    direccion: string;
    rutaImagen: string;
    odontologoId: number | null;
  }>({
    nombre: '',
    cedula: '',
    edad: 0,
    fechaCita: '',
    nuevoPaciente: '',
    pacienteRecomendado: '',
    motivoConsulta: '',
    telefono: '',
    email: '',
    direccion: '',
    rutaImagen: '',
    odontologoId: null,
  });

  useEffect(() => {
    fetchPacientes();
    fetchOdontologos();
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await axios.get<Paciente[]>('https://electivabackend.somee.com/api/paciente');
      setPacientes(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo cargar los pacientes. Intente nuevamente.');
      setLoading(false);
    }
  };

  const fetchOdontologos = async () => {
    try {
      const response = await axios.get<Odontologo[]>('https://electivabackend.somee.com/api/odontologo');
      setOdontologos(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo cargar los odontólogos. Intente nuevamente.');
    }
  };

  // Filtrar pacientes basados en el término de búsqueda
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cedula.includes(searchTerm) ||
    paciente.nombreOdontologo.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Pacientes</h1>

      {error && (
        <div
          className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
          role="alert"
        >
          <span>{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
            aria-label="Cerrar mensaje de error"
          >
            <FiX />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-10">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando pacientes...</p>
        </div>
      ) : (
        <div className="bg-white p-6 border rounded-3xl shadow-lg overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">Lista de Pacientes</h2>
            <input
              type="text"
              placeholder="Buscar Paciente"
              className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-gray-800 text-left text-sm uppercase font-semibold">
                  Nombre
                </th>
                <th className="py-3 px-4 border-b text-gray-800 text-left text-sm uppercase font-semibold">
                  Cédula
                </th>
                <th className="py-3 px-4 border-b text-gray-800 text-left text-sm uppercase font-semibold">
                  Odontólogo
                </th>
                <th className="py-3 px-4 border-b text-gray-800 text-center text-sm uppercase font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPacientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-700">
                    No hay pacientes para mostrar.
                  </td>
                </tr>
              ) : (
                currentPacientes.map((paciente) => (
                  <tr className="text-center" key={paciente.id}>
                    <td className="py-4 px-4 border-b text-left">{paciente.nombre}</td>
                    <td className="py-4 px-4 border-b text-left">{paciente.cedula}</td>
                    <td className="py-4 px-4 border-b text-left">{paciente.nombreOdontologo}</td>
                    <td className="py-4 px-4 border-b flex justify-center">
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="bg-yellow-500 text-white px-6 py-2 border rounded-3xl mr-2 hover:bg-yellow-600 transition duration-300 flex items-center"
                        aria-label={`Editar paciente ${paciente.nombre}`}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-red-500 text-white px-6 py-2 border rounded-3xl hover:bg-red-600 transition duration-300 flex items-center"
                        aria-label={`Eliminar paciente ${paciente.nombre}`}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {filteredPacientes.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex -space-x-px">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  Anterior
                </Button>
                {[...Array(Math.ceil(filteredPacientes.length / itemsPerPage))].map((_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 leading-tight border border-gray-300 ${
                      currentPage === index + 1
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(filteredPacientes.length / itemsPerPage)}
                  className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === Math.ceil(filteredPacientes.length / itemsPerPage)
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PacienteComponent;
