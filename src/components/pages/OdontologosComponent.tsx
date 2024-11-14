import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Modal from 'react-modal';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Button } from '../ui/button'; // Asegúrate de que tu componente Button soporte iconos o ajusta según sea necesario
import '../../styles/global.css';

// Definir interfaces
interface Consultorio {
  id: number;
  nombre: string;
}

interface Odontologo {
  id: number;
  nombre: string;
  apellido: string;
  numeroLicencia: string;
  telefono: string;
  email: string;
  consultorioId: number;
}

const OdontologosComponent: React.FC = () => {
  // Estados
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [odontologoToEdit, setOdontologoToEdit] = useState<Odontologo | null>(null);

  const [formCreate, setFormCreate] = useState<Omit<Odontologo, 'id'>>({
    nombre: '',
    apellido: '',
    numeroLicencia: '',
    telefono: '',
    email: '',
    consultorioId: 0,
  });

  const [formEdit, setFormEdit] = useState<Omit<Odontologo, 'id'>>({
    nombre: '',
    apellido: '',
    numeroLicencia: '',
    telefono: '',
    email: '',
    consultorioId: 0,
  });

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Configurar react-modal
  useEffect(() => {
    Modal.setAppElement('#root');
    fetchOdontologos();
    fetchConsultorios();
  }, []);

  // Función para fetch odontologos
  const fetchOdontologos = async (search: string = '') => {
    try {
      const response = await axios.get('https://sonrisasbackendelectivaiv.somee.com/api/odontologo', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        let data: Odontologo[] = response.data;

        if (search) {
          const lowerSearch = search.toLowerCase();
          data = data.filter(
            (odontologo) =>
              odontologo.nombre.toLowerCase().includes(lowerSearch) ||
              odontologo.apellido.toLowerCase().includes(lowerSearch) ||
              odontologo.numeroLicencia.toLowerCase().includes(lowerSearch) ||
              odontologo.telefono.toLowerCase().includes(lowerSearch) ||
              odontologo.email.toLowerCase().includes(lowerSearch) ||
              odontologo.consultorioId.toString().includes(lowerSearch)
          );
        }

        setOdontologos(data);
        setLoading(false);
        setCurrentPage(1); // Reiniciar a la primera página al actualizar los datos
      } else {
        setError('Error al obtener la lista de odontólogos.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error al obtener los odontólogos:', err);
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        setError(`Error ${err.response.status}: ${err.response.data.message || 'No se pudo obtener la lista de odontólogos.'}`);
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setError('No se recibió respuesta del servidor.');
      } else {
        // Algo pasó al configurar la solicitud
        setError('Error al configurar la solicitud.');
      }
      setLoading(false);
    }
  };

  // Función para fetch consultorios
  const fetchConsultorios = async () => {
    try {
      const response = await axios.get('https://sonrisasbackendelectivaiv.somee.com/api/consultorio', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setConsultorios(response.data);
      } else {
        setError('Error al obtener la lista de consultorios.');
      }
    } catch (err: any) {
      console.error('Error al obtener los consultorios:', err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || 'No se pudo obtener la lista de consultorios.'}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor.');
      } else {
        setError('Error al configurar la solicitud.');
      }
    }
  };

  // Manejo de cambios en el formulario de Crear
  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormCreate((prev) => ({
      ...prev,
      [name]: name === 'consultorioId' ? Number(value) : value,
    }));
  };

  // Manejo de cambios en el formulario de Editar
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({
      ...prev,
      [name]: name === 'consultorioId' ? Number(value) : value,
    }));
  };

  // Función para crear una nueva cita
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null); // Resetear errores antes de la acción
    try {
      const payload = { ...formCreate };

      const response = await axios.post('https://sonrisasbackendelectivaiv.somee.com/api/odontologo', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        await fetchOdontologos(searchTerm);
        setFormCreate({
          nombre: '',
          apellido: '',
          numeroLicencia: '',
          telefono: '',
          email: '',
          consultorioId: 0,
        });
        setError(null);
      } else {
        setError('Error al agregar el odontólogo.');
      }
    } catch (err: any) {
      console.error('Error al enviar el formulario:', err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || 'No se pudo agregar el odontólogo.'}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor.');
      } else {
        setError('Error al configurar la solicitud.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (odontologo: Odontologo) => {
    setOdontologoToEdit(odontologo);
    setFormEdit({
      nombre: odontologo.nombre,
      apellido: odontologo.apellido,
      numeroLicencia: odontologo.numeroLicencia,
      telefono: odontologo.telefono,
      email: odontologo.email,
      consultorioId: odontologo.consultorioId,
    });
    setIsEditModalOpen(true);
  };

  // Función para enviar la edición de un odontólogo
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!odontologoToEdit) return;
    setActionLoading(true);
    setError(null); // Resetear errores antes de la acción
    try {
      const payload = { ...formEdit };

      const response = await axios.put(
        `https://sonrisasbackendelectivaiv.somee.com/api/odontologo/${odontologoToEdit.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        await fetchOdontologos(searchTerm);
        setIsEditModalOpen(false);
        setOdontologoToEdit(null);
        setFormEdit({
          nombre: '',
          apellido: '',
          numeroLicencia: '',
          telefono: '',
          email: '',
          consultorioId: 0,
        });
        setError(null);
      } else {
        setError('Error al actualizar el odontólogo.');
      }
    } catch (err: any) {
      console.error('Error al actualizar el odontólogo:', err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || 'No se pudo actualizar el odontólogo.'}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor.');
      } else {
        setError('Error al configurar la solicitud.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Función para eliminar un odontólogo
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este odontólogo?')) return;
    setActionLoading(true);
    setError(null); // Resetear errores antes de la acción
    try {
      await axios.delete(`https://sonrisasbackendelectivaiv.somee.com/api/odontologo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await fetchOdontologos(searchTerm);
      setError(null);
    } catch (err: any) {
      console.error('Error al eliminar el odontólogo:', err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || 'No se pudo eliminar el odontólogo.'}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor.');
      } else {
        setError('Error al configurar la solicitud.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Opciones para react-select en Consultorios
  const consultorioOptions = consultorios.map((consultorio) => ({
    value: consultorio.id,
    label: consultorio.nombre,
  }));

  // Calcular los índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = odontologos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(odontologos.length / itemsPerPage);

  // Funciones para manejar la navegación de páginas
  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generar los números de página para mostrar
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Odontólogos</h1>

      {/* Mensaje de error */}
      {error && (
        <div
          className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span>{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
            aria-label="Cerrar mensaje de error"
          >
            ×
          </button>
        </div>
      )}

      {/* Formulario para Agregar/Editar Odontólogo */}
      <div className="bg-white p-6 border rounded-3xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          {odontologoToEdit ? 'Editar Odontólogo' : 'Agregar Odontólogo'}
        </h2>
        <form onSubmit={odontologoToEdit ? handleEditSubmit : handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="block mb-2 text-gray-600">Ingresa el nombre del odontólogo.</p>
              <input
                type="text"
                name="nombre"
                value={odontologoToEdit ? formEdit.nombre : formCreate.nombre}
                onChange={odontologoToEdit ? handleEditInputChange : handleCreateInputChange}
                placeholder="Nombre"
                className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <p className="block mb-2 text-gray-600">Ingresa el apellido del odontólogo.</p>
              <input
                type="text"
                name="apellido"
                value={odontologoToEdit ? formEdit.apellido : formCreate.apellido}
                onChange={odontologoToEdit ? handleEditInputChange : handleCreateInputChange}
                placeholder="Apellido"
                className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <p className="block mb-2 text-gray-600">Ingresa el número de licencia del odontólogo.</p>
              <input
                type="text"
                name="numeroLicencia"
                value={odontologoToEdit ? formEdit.numeroLicencia : formCreate.numeroLicencia}
                onChange={odontologoToEdit ? handleEditInputChange : handleCreateInputChange}
                placeholder="Número de Licencia"
                className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <p className="block mb-2 text-gray-600">Ingresa el teléfono de contacto.</p>
              <input
                type="text"
                name="telefono"
                value={odontologoToEdit ? formEdit.telefono : formCreate.telefono}
                onChange={odontologoToEdit ? handleEditInputChange : handleCreateInputChange}
                placeholder="Teléfono"
                className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <p className="block mb-2 text-gray-600">Ingresa el correo electrónico del odontólogo.</p>
              <input
                type="email"
                name="email"
                value={odontologoToEdit ? formEdit.email : formCreate.email}
                onChange={odontologoToEdit ? handleEditInputChange : handleCreateInputChange}
                placeholder="Correo Electrónico"
                className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <p className="block mb-2 text-gray-600">Selecciona el consultorio asignado.</p>
              <Select
                options={consultorioOptions}
                value={
                  consultorioOptions.find(
                    (option) =>
                      option.value ===
                      (odontologoToEdit ? formEdit.consultorioId : formCreate.consultorioId)
                  ) || null
                }
                onChange={(selectedOption) => {
                  if (odontologoToEdit) {
                    setFormEdit((prev) => ({
                      ...prev,
                      consultorioId: selectedOption ? selectedOption.value : 0,
                    }));
                  } else {
                    setFormCreate((prev) => ({
                      ...prev,
                      consultorioId: selectedOption ? selectedOption.value : 0,
                    }));
                  }
                }}
                isClearable
                placeholder="Selecciona un consultorio"
                className="react-select-container w-full border rounded-2xl focus:outline-none focus:ring-2"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
              disabled={actionLoading}
            >
              {actionLoading ? 'Procesando...' : odontologoToEdit ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de Odontólogos */}
      {loading ? (
        <div className="text-center">
          <p className="text-gray-600">Cargando odontólogos...</p>
        </div>
      ) : (
        <div className="bg-white p-6 border rounded-3xl shadow-lg overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Odontólogos</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar Odontólogo"
                className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  const search = e.target.value;
                  setSearchTerm(search);
                  fetchOdontologos(search);
                }}
              />
              {/* Ícono de búsqueda */}
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
              </svg>
            </div>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Nombre
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Apellido
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Número de Licencia
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Teléfono
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Consultorio
                </th>
                {/* <th className="px-6 py-3 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-semibold">
                  Acciones
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-700">
                    No hay odontólogos registrados.
                  </td>
                </tr>
              ) : (
                currentItems.map((odontologo) => {
                  const consultorio = consultorios.find(
                    (consult) => consult.id === odontologo.consultorioId
                  );

                  return (
                    <tr
                      key={odontologo.id}
                      className="hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                        {odontologo.nombre}
                      </td>
                      <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                        {odontologo.apellido}
                      </td>
                      <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                        {odontologo.numeroLicencia}
                      </td>
                      <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                        {odontologo.telefono}
                      </td>
                      <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                        {odontologo.email}
                      </td>
                      <td className="text-center px-6 py-4 border-b border-gray-200 text-gray-900 whitespace-nowrap">
                        {consultorio ? consultorio.nombre : 'N/A'}
                      </td>
                      {/* <td className="text-center px-6 py-4 border-b border-gray-200 whitespace-nowrap flex justify-center space-x-2">
                        
                        <button
                          onClick={() => handleEdit(odontologo)}
                          className="flex items-center justify-center bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-600 transition-colors"
                          aria-label={`Editar odontólogo ${odontologo.nombre} ${odontologo.apellido}`}
                          title="Editar Odontólogo"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                       
                        <button
                          onClick={() => handleDelete(odontologo.id)}
                          className="flex items-center justify-center bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                          aria-label={`Eliminar odontólogo ${odontologo.nombre} ${odontologo.apellido}`}
                          title="Eliminar Odontólogo"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Controles de Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Página Anterior"
              >
                Anterior
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageClick(number)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === number
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  aria-label={`Ir a la página ${number}`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Página Siguiente"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para Editar Odontólogo */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Odontólogo"
        className="max-w-lg mx-auto my-20 bg-white p-6 rounded-3xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {odontologoToEdit && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Editar Odontólogo
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    value={formEdit.nombre}
                    onChange={handleEditInputChange}
                    placeholder="Nombre"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">Ingresa el nombre del odontólogo.</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="apellido"
                    value={formEdit.apellido}
                    onChange={handleEditInputChange}
                    placeholder="Apellido"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">Ingresa el apellido del odontólogo.</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="numeroLicencia"
                    value={formEdit.numeroLicencia}
                    onChange={handleEditInputChange}
                    placeholder="Número de Licencia"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Ingresa el número de licencia del odontólogo.
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    name="telefono"
                    value={formEdit.telefono}
                    onChange={handleEditInputChange}
                    placeholder="Teléfono"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">Ingresa el teléfono de contacto.</p>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formEdit.email}
                    onChange={handleEditInputChange}
                    placeholder="Correo Electrónico"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Ingresa el correo electrónico del odontólogo.
                  </p>
                </div>
                <div>
                  <Select
                    options={consultorioOptions}
                    value={
                      consultorioOptions.find(
                        (option) => option.value === formEdit.consultorioId
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFormEdit((prev) => ({
                        ...prev,
                        consultorioId: selectedOption ? selectedOption.value : 0,
                      }));
                    }}
                    isClearable
                    placeholder="Selecciona un consultorio"
                    className="react-select-container w-full border rounded-lg focus:outline-none focus:ring-2"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Selecciona el consultorio asignado.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Actualizando...' : 'Guardar Cambios'}
                </Button>
                <Button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OdontologosComponent;
