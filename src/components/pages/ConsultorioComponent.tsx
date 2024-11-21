// src/components/ConsultorioComponent.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import SideBar from '../Sidebar';
import { FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { motion } from 'framer-motion';

// Configuración de React Modal
Modal.setAppElement('#root');

interface OdontologoDto {
  id: number;
  nombre: string;
  apellido: string;
  numeroLicencia: string | null;
  telefono: string | null;
  email: string | null;
  consultorioId: number;
}

interface ConsultorioDto {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  odontologos: OdontologoDto[];
  esNuevo?: boolean; // Nueva propiedad opcional
}

const ConsultorioComponent: React.FC = () => {
  const [consultorios, setConsultorios] = useState<ConsultorioDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario para creación
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
  });

  // Estados para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<{
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    odontologos: OdontologoDto[];
  }>({
    id: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    odontologos: [],
  });

  // Función para obtener los consultorios
  const fetchConsultorios = async () => {
    NProgress.start(); // Iniciar la barra de carga
    try {
      const response = await fetch('https://electivabackend.somee.com/api/consultorio');
      if (!response.ok) {
        throw new Error('Error al obtener los consultorios');
      }
      const data: ConsultorioDto[] = await response.json();
      setConsultorios(data);
      setLoading(false);
    } catch (err) {
      setError('No se pudo cargar los consultorios. Intente nuevamente.');
      setLoading(false);
    } finally {
      NProgress.done(); // Finalizar la barra de carga
    }
  };

  useEffect(() => {
    fetchConsultorios();
  }, []);

  // Manejo de cambios en el formulario de creación
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de cambios en el formulario de edición
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para crear un nuevo consultorio
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch('https://electivabackend.somee.com/api/consultorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          direccion: formData.direccion,
          telefono: formData.telefono,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear el consultorio');
      }

      await fetchConsultorios();
      setFormData({ nombre: '', direccion: '', telefono: '' });
    } catch (err: any) {
      setError(err.message || 'No se pudo crear el consultorio. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Función para abrir el modal de edición con los datos del consultorio seleccionado
  const handleEdit = (consultorio: ConsultorioDto) => {
    setEditFormData({
      id: consultorio.id,
      nombre: consultorio.nombre,
      direccion: consultorio.direccion,
      telefono: consultorio.telefono,
      odontologos: consultorio.odontologos,
    });
    setIsModalOpen(true);
  };

  // Función para actualizar un consultorio existente
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://electivabackend.somee.com/api/consultorio/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editFormData.id,
          nombre: editFormData.nombre,
          direccion: editFormData.direccion,
          telefono: editFormData.telefono,
          odontologos: editFormData.odontologos,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el consultorio');
      }

      await fetchConsultorios();
      setIsModalOpen(false);
      setEditFormData({ id: 0, nombre: '', direccion: '', telefono: '', odontologos: [] });
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar el consultorio. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Función para eliminar un consultorio
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este consultorio?')) return;
    setActionLoading(true);
    setError(null);
    try {
      // Corrección: Añadir '/api' al endpoint
      const response = await fetch(`https://electivabackend.somee.com/api/consultorio/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar el consultorio');
      }
      await fetchConsultorios();
    } catch (err: any) {
      setError(err.message || 'No se pudo eliminar el consultorio. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <SideBar />
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 p-8 ml-64">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Administración de Consultorios
          </h1>

          {/* Mensaje de error */}
          {error && (
            <div
              className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
                aria-label="Cerrar mensaje"
              >
                <AiOutlineClose />
              </button>
            </div>
          )}

          {/* Formulario de Creación */}
          <form onSubmit={handleCreate} className="mb-12 bg-white p-8 rounded-3xl shadow-lg animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              Crear Consultorio
              {actionLoading && <FiLoader className="ml-2 animate-spin text-xl" />}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label htmlFor="nombre" className="mb-2 text-gray-600">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="direccion" className="mb-2 text-gray-600">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  id="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="telefono" className="mb-2 text-gray-600">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  id="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className={`mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center ${
                actionLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={actionLoading}
            >
              {actionLoading ? 'Guardando...' : 'Crear'}
              {actionLoading && <FiLoader className="ml-2 animate-spin" />}
            </button>
          </form>

          {/* Lista de Consultorios */}
          {loading ? (
            <div className="flex flex-col items-center mt-10">
              <FiLoader className="animate-spin text-4xl text-blue-600" />
              <p className="mt-4 text-gray-600">Cargando consultorios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {consultorios.map((consultorio, index) => (
                <motion.div
                  key={consultorio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 md:p-8 h-full flex flex-col justify-between rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 duration-300 relative"
                >
                  {/* Badge de Nuevo */}
                  {consultorio.esNuevo && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                      Nuevo
                    </span>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                      {consultorio.nombre}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      <strong>Dirección:</strong> {consultorio.direccion}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <strong>Teléfono:</strong> {consultorio.telefono}
                    </p>
                    {/* Odontólogos */}
                    {consultorio.odontologos && consultorio.odontologos.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Odontólogos:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {consultorio.odontologos.map((odontologo) => (
                            <li key={odontologo.id}>
                              {odontologo.nombre} {odontologo.apellido || ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* Botones de Acción */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(consultorio)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 shadow-md hover:shadow-xl transition duration-300 flex items-center"
                      disabled={actionLoading}
                    >
                      <FiEdit className="mr-2 transition-transform duration-300 hover:rotate-90" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(consultorio.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 shadow-md hover:shadow-xl transition duration-300 flex items-center"
                      disabled={actionLoading}
                    >
                      <FiTrash2 className="mr-2 transition-transform duration-300 hover:rotate-90" />
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Modal de Edición */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Editar Consultorio"
            className="max-w-lg w-full mx-auto bg-white p-6 rounded-3xl shadow-lg outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              Editar Consultorio
              {actionLoading && <FiLoader className="ml-2 animate-spin text-xl" />}
            </h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="edit-nombre" className="mb-2 text-gray-600">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="edit-nombre"
                  placeholder="Nombre"
                  value={editFormData.nombre}
                  onChange={handleEditInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-direccion" className="mb-2 text-gray-600">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  id="edit-direccion"
                  placeholder="Dirección"
                  value={editFormData.direccion}
                  onChange={handleEditInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-telefono" className="mb-2 text-gray-600">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  id="edit-telefono"
                  placeholder="Teléfono"
                  value={editFormData.telefono}
                  onChange={handleEditInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Opcional: Manejar odontologos si es necesario */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition duration-300 flex items-center"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancelar
                  <AiOutlineClose className="ml-2" />
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center ${
                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Actualizando...' : 'Actualizar'}
                  {actionLoading && <FiLoader className="ml-2 animate-spin" />}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ConsultorioComponent;
