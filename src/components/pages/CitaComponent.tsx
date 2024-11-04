// src/components/pages/CitaComponent.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from 'react-modal'; // Importar react-modal
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../../styles/global.css'; // Asegúrate de que este archivo existe y contiene los estilos necesarios

// Interfaces para los datos
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
    fecha: string; // ISO string
    estado: string; // Ejemplo: "Pendiente", "Completada", etc.
    motivo: string; // Nuevo campo
    pacienteId: number;
    nombrePaciente: string;
    correoElectronicoPaciente: string; // Nuevo campo
    odontologoId: number;
    nombreOdontologo: string;
}

const CitaComponent: React.FC = () => {
    // Estados para manejar los datos
    const [citas, setCitas] = useState<Cita[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Estados para el Modal de Edición
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [citaToEdit, setCitaToEdit] = useState<Cita | null>(null);

    // Estado del formulario para agregar citas
    const [formCreate, setFormCreate] = useState<{
        fecha: string;
        estado: string;
        motivo: string; // Nuevo campo
        pacienteId: number;
        odontologoId: number;
    }>({
        fecha: '',
        estado: '',
        motivo: '', // Inicialización
        pacienteId: 0,
        odontologoId: 0,
    });

    // Estado del formulario para editar citas
    const [formEdit, setFormEdit] = useState<{
        fecha: string;
        estado: string;
        motivo: string; // Nuevo campo
        pacienteId: number;
        odontologoId: number;
    }>({
        fecha: '',
        estado: '',
        motivo: '', // Inicialización
        pacienteId: 0,
        odontologoId: 0,
    });

    // Configuración de react-modal
    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    // Función para formatear la fecha al formato esperado por datetime-local
    const formatDateToInput = (dateString: string): string => {
        const date = new Date(dateString);
        const tzOffset = date.getTimezoneOffset() * 60000; // Convertir minutos a milisegundos
        const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
        return localISOTime;
    };

    // Función para formatear la fecha al formato ISO antes de enviarla al backend
    const formatDateToISO = (dateString: string): string => {
        return new Date(dateString).toISOString();
    };

    // Funciones para obtener datos desde la API
    const fetchCitas = async (search: string = '') => {
        try {
            // Verifica que el parámetro 'search' es el correcto según tu API
            const url = search
                ? `https://localhost:7027/api/citas?search=${encodeURIComponent(search)}`
                : 'https://localhost:7027/api/citas';
            const response = await fetch(url);
            if (!response.ok) {
                // Intenta obtener el mensaje de error del backend
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener las citas');
            }
            const data: Cita[] = await response.json();
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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener los pacientes');
            }
            const data: Paciente[] = await response.json();
            setPacientes(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'No se pudo cargar los pacientes. Intente nuevamente.');
        }
    };

    const fetchOdontologos = async () => {
        try {
            const response = await fetch('https://localhost:7027/api/odontologo');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener los odontólogos');
            }
            const data: Odontologo[] = await response.json();
            setOdontologos(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'No se pudo cargar los odontólogos. Intente nuevamente.');
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchCitas();
        fetchPacientes();
        fetchOdontologos();
    }, []);

    // Manejo de cambios en los inputs del formulario de creación
    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormCreate(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateSelectPaciente = (selectedOption: any) => {
        if (selectedOption) {
            setFormCreate(prev => ({
                ...prev,
                pacienteId: selectedOption.value,
            }));
        } else {
            setFormCreate(prev => ({
                ...prev,
                pacienteId: 0,
            }));
        }
    };

    const handleCreateSelectOdontologo = (selectedOption: any) => {
        if (selectedOption) {
            setFormCreate(prev => ({
                ...prev,
                odontologoId: selectedOption.value,
            }));
        } else {
            setFormCreate(prev => ({
                ...prev,
                odontologoId: 0,
            }));
        }
    };

    // Manejo de cambios en los inputs del formulario de edición
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormEdit(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSelectPaciente = (selectedOption: any) => {
        if (selectedOption) {
            setFormEdit(prev => ({
                ...prev,
                pacienteId: selectedOption.value,
            }));
        } else {
            setFormEdit(prev => ({
                ...prev,
                pacienteId: 0,
            }));
        }
    };

    const handleEditSelectOdontologo = (selectedOption: any) => {
        if (selectedOption) {
            setFormEdit(prev => ({
                ...prev,
                odontologoId: selectedOption.value,
            }));
        } else {
            setFormEdit(prev => ({
                ...prev,
                odontologoId: 0,
            }));
        }
    };

    // Función para crear una nueva cita
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const url = 'https://localhost:7027/api/citas';

            // Preparar los datos a enviar
            const payload = {
                fecha: formatDateToISO(formCreate.fecha), // Formatear fecha
                estado: formCreate.estado,
                motivo: formCreate.motivo, // Incluir motivo
                pacienteId: formCreate.pacienteId,
                odontologoId: formCreate.odontologoId,
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchCitas(searchTerm); // Refrescar con término de búsqueda actual
                setFormCreate({
                    fecha: '',
                    estado: '',
                    motivo: '', // Reset
                    pacienteId: 0,
                    odontologoId: 0,
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar la cita');
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
            fecha: formatDateToInput(cita.fecha), // Formatear fecha para el input
            estado: cita.estado,
            motivo: cita.motivo,
            pacienteId: cita.pacienteId,
            odontologoId: cita.odontologoId,
        });
        setIsEditModalOpen(true);
    };

    // Función para editar una cita existente
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!citaToEdit) return;
        setActionLoading(true);
        try {
            const payload = {
                fecha: formatDateToISO(formEdit.fecha), // Formatear fecha
                estado: formEdit.estado,
                motivo: formEdit.motivo,
                pacienteId: formEdit.pacienteId,
                odontologoId: formEdit.odontologoId,
            };

            const response = await fetch(`https://localhost:7027/api/citas/${citaToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchCitas(searchTerm);
                setIsEditModalOpen(false);
                setCitaToEdit(null);
                setFormEdit({
                    fecha: '',
                    estado: '',
                    motivo: '',
                    pacienteId: 0,
                    odontologoId: 0,
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la cita');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'No se pudo actualizar la cita. Intente nuevamente.');
        } finally {
            setActionLoading(false);
        }
    };

    // Función para eliminar una cita
    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
        setActionLoading(true);
        try {
            const response = await fetch(`https://localhost:7027/api/citas/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                await fetchCitas(searchTerm);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la cita');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'No se pudo eliminar la cita. Intente nuevamente.');
        } finally {
            setActionLoading(false);
        }
    };

    // Opciones para react-select
    const pacienteOptions = pacientes.map(paciente => ({
        value: paciente.id,
        label: paciente.nombre,
    }));

    const odontologoOptions = odontologos.map(odontologo => ({
        value: odontologo.id,
        label: odontologo.nombre,
    }));

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Citas</h1>

            {/* Mensaje de error */}
            {error && (
                <div
                    className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <span>{error}</span>
                    <span
                        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                        onClick={() => setError(null)}
                        title="Cerrar mensaje de error"
                    >
                        ×
                    </span>
                </div>
            )}

            {/* Lista de Citas */}
            {loading ? (
                <div className="text-center mt-10">
                    <p className="mt-4 text-gray-600">Cargando citas...</p>
                </div>
            ) : (
                <div className="bg-white p-6 border rounded-3xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Lista de Citas</h2>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center p-2">
                                {/* Ícono de búsqueda SVG */}
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
                                    placeholder="Buscar cita por ID, paciente, estado o motivo"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        const search = e.target.value.toLowerCase();
                                        setSearchTerm(search);
                                        if (search) {
                                            fetchCitas(search);
                                        } else {
                                            fetchCitas();
                                        }
                                    }}
                                    className="w-full p-4 border border-slate-400 rounded-3xl text-black"
                                />
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">Paciente</th>
                                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">Estado</th>
                                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">Motivo</th>
                                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">Odontólogo</th>
                                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">Fecha</th>
                                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800 text-center text-sm uppercase font-semibold">Acciones</th>
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
                                            })} {new Date(cita.fecha).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="py-4 px-4 border-b flex justify-center">
                                            <button
                                                onClick={() => handleEdit(cita)}
                                                className="bg-yellow-500 text-white px-4 py-2 border rounded-3xl mr-2 hover:bg-yellow-600 transition-colors flex items-center"
                                            >
                                                <FiEdit className="mr-2" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cita.id)}
                                                className="bg-red-500 text-white px-4 py-2 border rounded-3xl hover:bg-red-600 transition-colors flex items-center"
                                            >
                                                <FiTrash2 className="mr-2" />
                                                Eliminar
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
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-gray-600">Estado</label>
                                <select
                                    name="estado"
                                    value={formEdit.estado}
                                    onChange={handleEditInputChange}
                                    className="w-full border p-2 rounded"
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
                                    value={formEdit.motivo}
                                    onChange={handleEditInputChange}
                                    className="w-full border p-2 rounded"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block mb-2 text-gray-600">Paciente</label>
                                <Select
                                    options={pacienteOptions}
                                    value={pacienteOptions.find(option => option.value === formEdit.pacienteId) || null}
                                    onChange={handleEditSelectPaciente}
                                    isClearable
                                    placeholder="Selecciona un paciente"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-gray-600">Odontólogo</label>
                                <Select
                                    options={odontologoOptions}
                                    value={odontologoOptions.find(option => option.value === formEdit.odontologoId) || null}
                                    onChange={handleEditSelectOdontologo}
                                    isClearable
                                    placeholder="Selecciona un odontólogo"
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
            <form
                onSubmit={handleCreate}
                className="my-12 bg-white p-8 rounded-3xl shadow-lg"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Agregar Cita</h2>
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
                    <div>
                        <label className="block mb-2 text-gray-600">Motivo</label>
                        <textarea
                            name="motivo"
                            placeholder="Motivo de la cita"
                            value={formCreate.motivo}
                            onChange={handleCreateInputChange}
                            className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-600">Paciente</label>
                        <Select
                            options={pacienteOptions}
                            value={pacienteOptions.find(option => option.value === formCreate.pacienteId) || null}
                            onChange={handleCreateSelectPaciente}
                            isClearable
                            placeholder="Selecciona un paciente"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-600">Odontólogo</label>
                        <Select
                            options={odontologoOptions}
                            value={odontologoOptions.find(option => option.value === formCreate.odontologoId) || null}
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
        </div>
    );

};

export default CitaComponent;
