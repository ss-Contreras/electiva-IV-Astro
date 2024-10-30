import React, { useState, useEffect } from 'react';
import SideBar from '../Sidebar';
import { FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

interface Odontologo {
  id: number;
  nombre: string;
  apellido: string;
  numeroLicencia: string | null;
  telefono: string | null;
  email: string | null;
  consultorioId: number;
}

interface Consultorio {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  odontologos: Odontologo[];
}

const ConsultorioComponent: React.FC = () => {
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id: 0,
    nombre: '',
    direccion: '',
    telefono: '',
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchConsultorios = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/consultorio');
      if (!response.ok) {
        throw new Error('Error al obtener los consultorios');
      }
      const data = await response.json();
      setConsultorios(data);
      setLoading(false);
    } catch (err) {
      setError('No se pudo cargar los consultorios. Intente nuevamente.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultorios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `https://localhost:7027/api/consultorio/${formData.id}`
        : 'https://localhost:7027/api/consultorio';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchConsultorios();
        setFormData({ id: 0, nombre: '', direccion: '', telefono: '' });
        setIsEditing(false);
      } else {
        throw new Error('Error al guardar el consultorio');
      }
    } catch (err) {
      setError('No se pudo guardar el consultorio. Intente nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (consultorio: Consultorio) => {
    setFormData({
      id: consultorio.id,
      nombre: consultorio.nombre,
      direccion: consultorio.direccion,
      telefono: consultorio.telefono,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este consultorio?')) return;
    setActionLoading(true);
    try {
      const response = await fetch(`https://localhost:7027/api/consultorio/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchConsultorios();
      } else {
        throw new Error('Error al eliminar el consultorio');
      }
    } catch (err) {
      setError('No se pudo eliminar el consultorio. Intente nuevamente.');
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
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
                style={{ cursor: 'pointer' }}
              >
                ×
              </span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleCreateOrUpdate} className="mb-12 bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              {isEditing ? 'Editar Consultorio' : 'Crear Consultorio'}
              {actionLoading && <FiLoader className="ml-2 animate-spin text-xl" />}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <label className="block mb-2 text-gray-600">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
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
              className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center"
              disabled={actionLoading}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
              {actionLoading && <FiLoader className="ml-2 animate-spin" />}
            </button>
            {isEditing && (
              <button
                type="button"
                className="mt-6 ml-4 bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition duration-300"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: 0, nombre: '', direccion: '', telefono: '' });
                }}
                disabled={actionLoading}
              >
                Cancelar
              </button>
            )}
          </form>

          {/* Lista de Consultorios */}
          {loading ? (
            <div className="text-center mt-10">
              <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Cargando consultorios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {consultorios.map((consultorio) => (
                <div
                  key={consultorio.id}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300"
                >
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
                            {odontologo.nombre} {odontologo.apellido}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleEdit(consultorio)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-xl mr-2 hover:bg-yellow-600 transition duration-300 flex items-center"
                      disabled={actionLoading}
                    >
                      <FiEdit className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(consultorio.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-300 flex items-center"
                      disabled={actionLoading}
                    >
                      <FiTrash2 className="mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultorioComponent;
