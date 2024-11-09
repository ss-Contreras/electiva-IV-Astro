// src/components/pages/PacienteComponent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import { FiEdit, FiTrash2, FiX, FiCheckCircle } from 'react-icons/fi';
import '../../styles/global.css';

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
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [pacienteToEdit, setPacienteToEdit] = useState<Paciente | null>(null);

  const [formCreate, setFormCreate] = useState<{
    nombre: string;
    cedula: string;
    edad: number;
    fechaCita: string;
    nuevoPaciente: string;
    pacienteRecomendado: string;
    motivoConsulta: string;
    telefono: string;
    email?: string;
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
      const response = await axios.get<Paciente[]>('https://sonrisasbackendelectivaiv.somee.com/api/paciente');
      setPacientes(response.data);
      setFilteredPacientes(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo cargar los pacientes. Intente nuevamente.');
      setLoading(false);
    }
  };

  const fetchOdontologos = async () => {
    try {
      const response = await axios.get<Odontologo[]>('https://sonrisasbackendelectivaiv.somee.com/api/odontologo');
      setOdontologos(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo cargar los odontólogos. Intente nuevamente.');
    }
  };

  useEffect(() => {
    filterPacientes(searchTerm);
  }, [searchTerm, pacientes]);

  const filterPacientes = (term: string) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = pacientes.filter((paciente) =>
      paciente.nombre.toLowerCase().includes(lowerCaseTerm) ||
      paciente.cedula.toLowerCase().includes(lowerCaseTerm) ||
      paciente.nombreOdontologo.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredPacientes(filtered);
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormCreate((prev) => ({
      ...prev,
      [name]: name === 'edad' ? Number(value) : value,
    }));
  };

  const handleCreateSelectOdontologo = (selectedOption: any) => {
    setFormCreate((prev) => ({
      ...prev,
      odontologoId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({
      ...prev,
      [name]: name === 'edad' ? Number(value) : value,
    }));
  };

  const handleEditSelectOdontologo = (selectedOption: any) => {
    setFormEdit((prev) => ({
      ...prev,
      odontologoId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        nombre: formCreate.nombre,
        cedula: formCreate.cedula,
        edad: formCreate.edad,
        fechaCita: formCreate.fechaCita,
        nuevoPaciente: formCreate.nuevoPaciente,
        pacienteRecomendado: formCreate.pacienteRecomendado,
        motivoConsulta: formCreate.motivoConsulta,
        telefono: formCreate.telefono,
        email: formCreate.email,
        direccion: formCreate.direccion,
        rutaImagen: formCreate.rutaImagen,
        odontologoId: formCreate.odontologoId,
      };

      const response = await axios.post('https://sonrisasbackendelectivaiv.somee.com/api/paciente', payload);

      if (response.status === 201 || response.status === 200) {
        await fetchPacientes();
        resetCreateForm();
        setSuccessMessage('Paciente agregado exitosamente.');
      } else {
        throw new Error('Error al guardar el paciente');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo guardar el paciente. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteToEdit) return;
    setActionLoading(true);
    try {
      const payload = {
        nombre: formEdit.nombre,
        cedula: formEdit.cedula,
        edad: formEdit.edad,
        fechaCita: formEdit.fechaCita,
        nuevoPaciente: formEdit.nuevoPaciente,
        pacienteRecomendado: formEdit.pacienteRecomendado,
        motivoConsulta: formEdit.motivoConsulta,
        telefono: formEdit.telefono,
        email: formEdit.email,
        direccion: formEdit.direccion,
        rutaImagen: formEdit.rutaImagen,
        odontologoId: formEdit.odontologoId,
      };

      const response = await axios.put(`https://sonrisasbackendelectivaiv.somee.com/api/paciente/${pacienteToEdit.id}`, payload);

      if (response.status === 200) {
        await fetchPacientes();
        closeEditModal();
        setSuccessMessage('Paciente actualizado exitosamente.');
      } else {
        throw new Error('Error al actualizar el paciente');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo actualizar el paciente. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (paciente: Paciente) => {
    setPacienteToEdit(paciente);
    setFormEdit({
      nombre: paciente.nombre,
      cedula: paciente.cedula,
      edad: paciente.edad,
      fechaCita: paciente.fechaCita,
      nuevoPaciente: paciente.nuevoPaciente,
      pacienteRecomendado: paciente.pacienteRecomendado,
      motivoConsulta: paciente.motivoConsulta,
      telefono: paciente.telefono,
      email: paciente.correoElectronico,
      direccion: paciente.direccion,
      rutaImagen: paciente.rutaImagen,
      odontologoId: paciente.odontologoId,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) return;
    setActionLoading(true);
    try {
      const response = await axios.delete(`https://sonrisasbackendelectivaiv.somee.com/api/paciente/${id}`);
      if (response.status === 200) {
        await fetchPacientes();
        setSuccessMessage('Paciente eliminado exitosamente.');
      } else {
        throw new Error('Error al eliminar el paciente');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'No se pudo eliminar el paciente. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const resetCreateForm = () => {
    setFormCreate({
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
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setPacienteToEdit(null);
    setFormEdit({
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
  };

  const odontologoOptions = odontologos.map((odontologo) => ({
    value: odontologo.id,
    label: odontologo.nombre,
  }));

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Pacientes</h1>

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
            <FiX />
          </button>
        </div>
      )}

      {successMessage && (
        <div
          className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center"
          role="alert"
        >
          <FiCheckCircle className="mr-2" />
          <span>{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
            aria-label="Cerrar mensaje de éxito"
          >
            <FiX />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-10">
          <p className="mt-4 text-gray-600">Cargando pacientes...</p>
        </div>
      ) : (
        <div className="bg-white p-6 border rounded-3xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-3xl font-semibold mb-4 text-gray-800">Lista de Pacientes</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Buscar Paciente"
                  className="w-full p-4 border border-slate-400 rounded-3xl text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
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
              {filteredPacientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-700">
                    No hay pacientes para mostrar.
                  </td>
                </tr>
              ) : (
                filteredPacientes.map((paciente) => (
                  <tr className="text-center" key={paciente.id}>
                    <td className="py-4 px-4 border-b text-left">{paciente.nombre}</td>
                    <td className="py-4 px-4 border-b text-left">{paciente.cedula}</td>
                    <td className="py-4 px-4 border-b text-left">{paciente.nombreOdontologo}</td>
                    <td className="py-4 px-4 border-b flex justify-center">
                      <button
                        onClick={() => handleEdit(paciente)}
                        className="bg-yellow-500 text-white px-6 py-2 border rounded-3xl mr-2 hover:bg-yellow-600 transition-colors flex items-center"
                        aria-label={`Editar paciente ${paciente.nombre}`}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(paciente.id)}
                        className="bg-red-500 text-white px-6 py-2 border rounded-3xl hover:bg-red-600 transition-colors text-center"
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
        </div>
      )}

      {/* Modal para Editar Paciente */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Paciente"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {pacienteToEdit && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Editar Paciente</h2>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-gray-600">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formEdit.nombre}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Cédula *</label>
                <input
                  type="text"
                  name="cedula"
                  value={formEdit.cedula}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Edad *</label>
                <input
                  type="number"
                  name="edad"
                  value={formEdit.edad}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Fecha de Cita *</label>
                <input
                  type="date"
                  name="fechaCita"
                  value={formEdit.fechaCita.split('T')[0]} // Asegura que solo se envíe la fecha
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Paciente Nuevo *</label>
                <input
                  type="text"
                  name="nuevoPaciente"
                  value={formEdit.nuevoPaciente}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Paciente Recomendado *</label>
                <input
                  type="text"
                  name="pacienteRecomendado"
                  value={formEdit.pacienteRecomendado}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Motivo de Consulta *</label>
                <textarea
                  name="motivoConsulta"
                  value={formEdit.motivoConsulta}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formEdit.telefono}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formEdit.email}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={formEdit.direccion}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Ruta de Imagen</label>
                <input
                  type="text"
                  name="rutaImagen"
                  value={formEdit.rutaImagen}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded"
                  placeholder="URL de la imagen"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Odontólogo *</label>
                <Select
                  options={odontologoOptions}
                  value={odontologoOptions.find((option) => option.value === formEdit.odontologoId) || null}
                  onChange={handleEditSelectOdontologo}
                  isClearable
                  placeholder="Selecciona un odontólogo"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  onClick={closeEditModal}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Formulario para Agregar Paciente */}
      <form
        onSubmit={handleCreate}
        className="my-12 bg-white p-8 rounded-3xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Agregar Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-600">Nombre *</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={formCreate.nombre}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Cédula *</label>
            <input
              type="text"
              name="cedula"
              placeholder="Cédula de Identidad"
              value={formCreate.cedula}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Edad *</label>
            <input
              type="number"
              name="edad"
              placeholder="Edad"
              value={formCreate.edad}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Fecha de Cita *</label>
            <input
              type="date"
              name="fechaCita"
              value={formCreate.fechaCita}
              onChange={handleCreateInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Paciente Nuevo *</label>
            <input
              type="text"
              name="nuevoPaciente"
              placeholder="¿Es un nuevo paciente?"
              value={formCreate.nuevoPaciente}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Paciente Recomendado *</label>
            <input
              type="text"
              name="pacienteRecomendado"
              placeholder="Recomendado por"
              value={formCreate.pacienteRecomendado}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Motivo de Consulta *</label>
            <textarea
              name="motivoConsulta"
              placeholder="Motivo de la consulta"
              value={formCreate.motivoConsulta}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Teléfono *</label>
            <input
              type="tel"
              name="telefono"
              placeholder="Número de Teléfono"
              value={formCreate.telefono}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formCreate.email}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Dirección *</label>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección Completa"
              value={formCreate.direccion}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Ruta de Imagen</label>
            <input
              type="text"
              name="rutaImagen"
              placeholder="URL de la imagen"
              value={formCreate.rutaImagen}
              onChange={handleCreateInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Odontólogo *</label>
            <Select
              options={odontologoOptions}
              value={odontologoOptions.find((option) => option.value === formCreate.odontologoId) || null}
              onChange={handleCreateSelectOdontologo}
              isClearable
              placeholder="Selecciona un odontólogo"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center"
            disabled={actionLoading}
          >
            {actionLoading ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PacienteComponent;