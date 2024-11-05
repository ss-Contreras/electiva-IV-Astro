import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface Paciente {
  id: number;
  nombre: string;
  cedula: string;
  edad: number;
  // historial: string;
}

const PacienteComponent: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<Paciente>({
    id: 0,
    nombre: '',
    cedula: '',
    edad: 0,
    // historial: '',
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchPacientes = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/paciente');
      if (!response.ok) {
        throw new Error('Error al obtener los pacientes');
      }
      const data = await response.json();
      setPacientes(data);
      setLoading(false);
    } catch (err) {
      setError('No se pudo cargar los pacientes. Intente nuevamente.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'edad' ? Number(value) : value }));
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `https://localhost:7027/api/paciente/${formData.id}`
        : 'https://localhost:7027/api/paciente';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPacientes();
        setFormData({ id: 0, nombre: '', cedula: '', edad: 0 });
        setIsEditing(false);
      } else {
        throw new Error('Error al guardar el paciente');
      }
    } catch (err) {
      setError('No se pudo guardar el paciente. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (paciente: Paciente) => {
    setFormData(paciente);
    setIsEditing(true);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este paciente?')) return;
    setActionLoading(true);
    try {
      const response = await fetch(`https://localhost:7027/api/paciente/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchPacientes();
      } else {
        throw new Error('Error al eliminar el paciente');
      }
    } catch (err) {
      setError('No se pudo eliminar el paciente. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Pacientes</h1>

      {/* Mensaje de error */}
      {error && (
        <div
          className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >agregar
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
            style={{ cursor: 'pointer' }}
          >
            ×
          </span>
        </div>
      )}

      {/* Lista de Pacientes */}
      {loading ? (
        <div className="text-center mt-10">
          <p className="mt-4 text-gray-600">Cargando pacientes...</p>
        </div>
      ) : (
        <div className="bg-white p-6 border rounded-3xl shadow-lg">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h2 className="text-3xl font-semibold mb-4 text-gray-800">Lista de Pacientes</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Buscar paciente"
                  className="w-full p-4 border border-slate-400 rounded-3xl text-black"
                  onChange={(e) => {
                    const search = e.target.value.toLowerCase();
                    if (search) {
                      setPacientes((prev) =>
                        prev.filter(
                          (paciente) =>
                            paciente.nombre.toLowerCase().includes(search) ||
                            paciente.id.toString().includes(search) ||
                            paciente.cedula.toString().includes(search)
                        )
                      );
                    } else {
                      fetchPacientes();
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800">Nombre</th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800">Cédula</th>
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800">Edad</th>
                {/* <th className="py-3 px-4 border-b bg-gray-50 text-gray-800">Historial</th> */}
                <th className="py-3 px-4 border-b bg-gray-50 text-gray-800">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-700"
                  >
                    No hay pacientes para mostrar.
                  </td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr className="text-center" key={paciente.id}>
                    <td className="py-4 px-4 border-b">{paciente.nombre}</td>
                    <td className="py-4 px-4 border-b">{paciente.cedula}</td>
                    <td className="py-4 px-4 border-b">{paciente.edad}</td>
                    {/* <td className="py-4 px-4 border-b">{paciente.historial}</td> */}
                    <td className="py-4 px-4 border-b flex justify-center">
                      <button
                        onClick={() => handleEdit(paciente)}
                        className="bg-yellow-500 text-white px-4 py-2 border rounded-3xl mr-2 hover:bg-yellow-600 transition-colors flex items-center"
                      >
                        <FiEdit className="mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(paciente.id)}
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
      {/* Formulario */}
      <form
        onSubmit={handleCreateOrUpdate}
        className="my-12 bg-white p-8 rounded-3xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
          {isEditing ? 'Editar Paciente' : 'Agregar Paciente'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-600">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Cédula</label>
            <input
              type="text"
              name="cedula"
              placeholder="Cédula"
              value={formData.cedula}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Edad</label>
            <input
              type="number"
              name="edad"
              placeholder="Edad"
              value={formData.edad}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>
          {/* <div>
            <label className="block mb-2 text-gray-600">Historial</label>
            <textarea
              name="historial"
              placeholder="Historial médico"
              value={formData.historial}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              rows={4}
            />
          </div> */}
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center"
          disabled={actionLoading}
        >
          {isEditing ? 'Actualizar' : 'Agregar'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="mt-6 ml-4 bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition duration-300"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: 0, nombre: '', cedula: '', edad: 0});
            }}
            disabled={actionLoading}
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};

export default PacienteComponent;
