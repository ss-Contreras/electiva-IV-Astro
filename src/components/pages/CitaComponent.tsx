import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
// import { Tooltip } from 'react-tooltip'; // Asegúrate de instalar react-tooltip si deseas usar tooltips
import '../../styles/global.css';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  correoElectronico: string;
}

interface Odontologo {
  id: number;
  nombre: string;
}

interface Cita {
  id: number;
  fecha: string;
  estado: string;
  motivo: string;
  pacienteId: number;
  nombrePaciente: string;
  correoElectronicoPaciente: string;
  odontologoId: number;
  nombreOdontologo: string;
}

const CitaComponent: React.FC = () => {
  // Estados
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [citaToEdit, setCitaToEdit] = useState<Cita | null>(null);

  const [formCreate, setFormCreate] = useState<{
    fecha: string;
    estado: string;
    motivo: string;
    pacienteId: number | null;
    odontologoId: number | null;
  }>({
    fecha: '',
    estado: '',
    motivo: '',
    pacienteId: null,
    odontologoId: null,
  });

  const [formEdit, setFormEdit] = useState<{
    fecha: string;
    estado: string;
    motivo: string;
    pacienteId: number | null;
    odontologoId: number | null;
  }>({
    fecha: '',
    estado: '',
    motivo: '',
    pacienteId: null,
    odontologoId: null,
  });

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchCitas();
    fetchPacientes();
    fetchOdontologos();
  }, []);

  const formatDateToInput = (dateString: string): string => {
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const formatDateToISO = (dateString: string): string => {
    return new Date(dateString).toISOString();
  };

  const fetchCitas = async (search: string = '') => {
    try {
      const url = 'https://localhost:7027/api/citas';
      const response = await fetch(url);

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        let errorMessage = 'Error al obtener las citas';
        if (typeof responseData === 'string') {
          errorMessage = responseData || errorMessage;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      let data: Cita[] = responseData;

      if (search) {
        data = data.filter(
          (cita) =>
            cita.nombrePaciente.toLowerCase().includes(search) ||
            cita.estado.toLowerCase().includes(search) ||
            cita.nombreOdontologo.toLowerCase().includes(search) ||
            cita.fecha.toLowerCase().includes(search) ||
            cita.motivo.toLowerCase().includes(search)
        );
      }

      setCitas(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo cargar las citas. Intente nuevamente.');
      setLoading(false);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/paciente');

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        let errorMessage = 'Error al obtener los pacientes';
        if (typeof responseData === 'string') {
          errorMessage = responseData || errorMessage;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      const data: Paciente[] = responseData;
      setPacientes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo cargar los pacientes. Intente nuevamente.');
    }
  };

  const fetchOdontologos = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/odontologo');

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        let errorMessage = 'Error al obtener los odontólogos';
        if (typeof responseData === 'string') {
          errorMessage = responseData || errorMessage;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      const data: Odontologo[] = responseData;
      setOdontologos(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo cargar los odontólogos. Intente nuevamente.');
    }
  };

  // Manejo de cambios en el formulario de Crear
  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormCreate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSelectPaciente = (selectedOption: any) => {
    setFormCreate((prev) => ({
      ...prev,
      pacienteId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleCreateSelectOdontologo = (selectedOption: any) => {
    setFormCreate((prev) => ({
      ...prev,
      odontologoId: selectedOption ? selectedOption.value : null,
    }));
  };

  // Manejo de cambios en el formulario de Editar
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSelectPaciente = (selectedOption: any) => {
    setFormEdit((prev) => ({
      ...prev,
      pacienteId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleEditSelectOdontologo = (selectedOption: any) => {
    setFormEdit((prev) => ({
      ...prev,
      odontologoId: selectedOption ? selectedOption.value : null,
    }));
  };

  // Función para crear una nueva cita
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const url = 'https://localhost:7027/api/citas';

      const payload = {
        fecha: formatDateToISO(formCreate.fecha),
        estado: formCreate.estado,
        motivo: formCreate.motivo,
        pacienteId: formCreate.pacienteId,
        odontologoId: formCreate.odontologoId,
      };

      console.log('Payload enviado al servidor:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        await fetchCitas(searchTerm);
        setFormCreate({
          fecha: '',
          estado: '',
          motivo: '',
          pacienteId: null,
          odontologoId: null,
        });
        // Opcional: Mostrar mensaje de éxito
        setError(null);
      } else {
        let errorMessage = 'Error al guardar la cita';
        if (typeof responseData === 'string') {
          errorMessage = responseData || errorMessage;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo guardar la cita. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (cita: Cita) => {
    setCitaToEdit(cita);
    setFormEdit({
      fecha: formatDateToInput(cita.fecha),
      estado: cita.estado,
      motivo: cita.motivo, // Asegurarse de que coincide con el nombre del campo
      pacienteId: cita.pacienteId,
      odontologoId: cita.odontologoId,
    });
    setIsEditModalOpen(true);
  };

  // Función para enviar la edición de una cita
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citaToEdit) return;
    setActionLoading(true);
    try {
      const payload = {
        id: citaToEdit.id,
        fecha: formatDateToISO(formEdit.fecha),
        estado: formEdit.estado,
        motivo: formEdit.motivo, // Asegurarse de que coincide con el nombre del campo
        pacienteId: formEdit.pacienteId,
        odontologoId: formEdit.odontologoId,
      };

      console.log('Payload enviado al servidor:', payload);

      const url = `https://localhost:7027/api/citas/${citaToEdit.id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log('Respuesta del servidor:', responseData);

      if (response.ok) {
        await fetchCitas(searchTerm);
        setIsEditModalOpen(false);
        setCitaToEdit(null);
        setFormEdit({
          fecha: '',
          estado: '',
          motivo: '',
          pacienteId: null,
          odontologoId: null,
        });
        setError(null);
      } else {
        let errorMessage = 'Error al actualizar la cita';
        if (typeof responseData === 'string') {
          errorMessage = responseData || errorMessage;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        console.error('Error del servidor:', responseData);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Excepción capturada:', err);
      setError(err.message || 'No se pudo actualizar la cita. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Función para eliminar una cita
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
    setActionLoading(true);
    try {
      const url = `https://localhost:7027/api/citas/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        await fetchCitas(searchTerm);
        setError(null);
      } else {
        let errorMessage = 'Error al eliminar la cita';
        if (typeof responseData === 'string') {
          errorMessage = responseData || errorMessage;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo eliminar la cita. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Opciones para react-select
  const pacienteOptions = pacientes.map((paciente) => ({
    value: paciente.id,
    label: paciente.nombre,
  }));

  const odontologoOptions = odontologos.map((odontologo) => ({
    value: odontologo.id,
    label: odontologo.nombre,
  }));

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

      <form onSubmit={handleCreate} className="bg-white p-6 border rounded-3xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Agregar Cita</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-600">Fecha</label>
            <input
              type="datetime-local"
              name="fecha"
              placeholder="Fecha de la cita"
              value={formCreate.fecha}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Estado</label>
            <select
              name="estado"
              value={formCreate.estado}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-600">Motivo</label>
            <textarea
              name="motivo"
              placeholder="Motivo de la cita"
              value={formCreate.motivo}
              onChange={handleCreateInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Paciente</label>
            <Select
              options={pacienteOptions}
              value={pacienteOptions.find((option) => option.value === formCreate.pacienteId) || null}
              onChange={handleCreateSelectPaciente}
              isClearable
              placeholder="Selecciona un paciente"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Odontólogo</label>
            <Select
              options={odontologoOptions}
              value={odontologoOptions.find((option) => option.value === formCreate.odontologoId) || null}
              onChange={handleCreateSelectOdontologo}
              isClearable
              placeholder="Selecciona un odontólogo"
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

      {/* Lista de Citas */}
      {loading ? (
        <div className="text-center mt-10">
          <p className="mt-4 text-gray-600">Cargando citas...</p>
        </div>
      ) : (
        <div className="bg-white p-6 border rounded-3xl shadow-lg overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Citas</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar Cita"
                className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  setSearchTerm(search);
                  fetchCitas(search);
                }}
              />
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
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">
                  Paciente
                </th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">
                  Estado
                </th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">
                  Motivo
                </th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">
                  Odontólogo
                </th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">
                  Fecha
                </th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {citas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-700">
                    No hay citas para mostrar.
                  </td>
                </tr>
              ) : (
                citas.map((cita) => (
                  <tr className="text-center" key={cita.id}>
                    <td className="py-4 px-4 border-b">{cita.nombrePaciente}</td>
                    <td className="py-4 px-4 border-b">{cita.estado}</td>
                    <td className="py-4 px-4 border-b">{cita.motivo || 'No especificado'}</td>
                    <td className="py-4 px-4 border-b">{cita.nombreOdontologo}</td>
                    <td className="py-4 px-4 border-b">
                      {new Date(cita.fecha).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      {new Date(cita.fecha).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 border-b flex justify-center">
                      {/* Botón de Editar */}
                      <button
                        onClick={() => handleEdit(cita)}
                        className="bg-yellow-500 text-white px-6 py-2 border rounded-3xl mr-2 hover:bg-yellow-600 transition-colors flex items-center"
                        aria-label={`Editar cita de ${cita.nombrePaciente}`}
                        title="Editar Cita"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      {/* Botón de Eliminar */}
                      <button
                        onClick={() => handleDelete(cita.id)}
                        className="bg-red-500 text-white px-6 py-2 border rounded-3xl hover:bg-red-600 transition-colors text-center"
                        aria-label={`Eliminar cita de ${cita.nombrePaciente}`}
                        title="Eliminar Cita"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Editar Cita */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Cita"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {citaToEdit && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Editar Cita</h2>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-gray-600">Fecha</label>
                <input
                  type="datetime-local"
                  name="fecha"
                  value={formEdit.fecha}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Estado</label>
                <select
                  name="estado"
                  value={formEdit.estado}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un estado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Motivo</label>
                <textarea
                  name="motivo"
                  placeholder="Motivo de la cita"
                  value={formEdit.motivo}
                  onChange={handleEditInputChange}
                  className="w-full border p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Paciente</label>
                <Select
                  options={pacienteOptions}
                  value={pacienteOptions.find((option) => option.value === formEdit.pacienteId) || null}
                  onChange={handleEditSelectPaciente}
                  isClearable
                  placeholder="Selecciona un paciente"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Odontólogo</label>
                <Select
                  options={odontologoOptions}
                  value={odontologoOptions.find((option) => option.value === formEdit.odontologoId) || null}
                  onChange={handleEditSelectOdontologo}
                  isClearable
                  placeholder="Selecciona un odontólogo"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Formulario para Agregar Cita */}

    </div>
  );
};

export default CitaComponent;
