import React, { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FiTrash2, FiUpload, FiSearch, FiLoader } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { useDropzone } from 'react-dropzone';
import '../../styles/global.css';
// import './RadiografiasComponent.css'; // Estilos adicionales específicos para las mejoras

// Definición de interfaces
interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
}

interface RadiografiaDTO {
  id: number;
  imageUrl: string;
  descripcion: string;
  fecha: string; // ISO string
  pacienteId: number;
  nombrePaciente?: string;
}

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div
      className={`mb-6 ${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-lg shadow-lg animate-fade-in relative`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <button
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={onClose}
        aria-label="Cerrar mensaje"
      >
        <AiOutlineClose />
      </button>
    </div>
  );
};

interface RadiografiaFormProps {
  pacientes: Paciente[];
  loadingPacientes: boolean;
  onRadiografiaCreated: (radiografia: RadiografiaDTO) => void;
}

const RadiografiaForm: React.FC<RadiografiaFormProps> = ({ pacientes, loadingPacientes, onRadiografiaCreated }) => {
  // Estados del formulario
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Configuración de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        setError('Solo se permiten imágenes en formato .jpg, .jpeg o .png y máximo 5MB.');
        return;
      }
      if (acceptedFiles.length > 0) {
        setImagen(acceptedFiles[0]);
        setError(null);
      }
    },
  });

  // Manejo de cambios en el selector de pacientes
  const handlePacienteChange = (selectedOption: { value: number; label: string } | null) => {
    setPacienteId(selectedOption ? selectedOption.value : null);
  };

  // Generar y revocar el URL de la imagen para la vista previa
  useEffect(() => {
    if (imagen) {
      const url = URL.createObjectURL(imagen);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [imagen]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!imagen) {
      setError('Por favor, selecciona una imagen.');
      return;
    }
    if (!descripcion.trim()) {
      setError('Por favor, ingresa una descripción.');
      return;
    }
    if (!fecha) {
      setError('Por favor, selecciona una fecha.');
      return;
    }
    if (!pacienteId) {
      setError('Por favor, selecciona un paciente.');
      return;
    }

    const formData = new FormData();
    formData.append('Imagen', imagen);
    formData.append('Descripcion', descripcion);
    formData.append('Fecha', fecha);
    formData.append('PacienteId', pacienteId.toString());

    setLoading(true);
    try {
      const response = await axios.post<RadiografiaDTO>('https://electivabackend.somee.com/api/radiografias', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDescripcion('');
      setFecha('');
      setPacienteId(null);
      setImagen(null);
      setLoading(false);
      onRadiografiaCreated(response.data);
    } catch (err: any) {
      console.error('Error al subir radiografía:', err);
      setError('Error al subir la radiografía.');
      setLoading(false);
    }
  };

  const pacienteOptions = pacientes.map((paciente) => ({
    value: paciente.id,
    label: `${paciente.nombre} ${paciente.apellido || ''}`.trim(),
  }));

  return (
    <div className="bg-gradient-to-r from-blue-50 to-white p-10 rounded-3xl shadow-xl mb-8 transition-all duration-500 ease-in-out transform hover:shadow-2xl animate-fade-in">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Subir Nueva Radiografía</h2>
      {error && <Notification type="error" message={error} onClose={() => setError(null)} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-500 ${
            isDragActive ? 'border-blue-500 bg-blue-100 animate-pulse' : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 flex items-center justify-center">
              <FiUpload className="mr-2 animate-bounce" />
              Suelta la imagen aquí...
            </p>
          ) : (
            <p className="text-gray-600 flex flex-col items-center">
              <FiUpload className="text-6xl mb-2 text-blue-600" />
              Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.
              <span className="text-sm text-gray-500">(Solo .jpg, .jpeg, .png - Max 5MB)</span>
            </p>
          )}
        </div>
        {previewUrl && (
          <div className="flex items-center space-x-4 animate-fade-in">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded-xl shadow-lg transition-transform transform hover:scale-105"
            />
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">{imagen?.name}</p>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 mt-1 flex items-center"
                onClick={() => setImagen(null)}
              >
                <AiOutlineClose className="mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        )}
        <div>
          <label htmlFor="descripcion" className="block text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-500 ease-in-out hover:shadow-md"
            placeholder="Ingresa una descripción detallada de la radiografía."
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="fecha" className="block text-gray-700 mb-2">
            Fecha de la Radiografía
          </label>
          <input
            type="datetime-local"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ease-in-out hover:shadow-md"
            required
          />
        </div>
        <div>
          <label htmlFor="paciente" className="block text-gray-700 mb-2">
            Paciente
          </label>
          {loadingPacientes ? (
            <p className="text-gray-500">Cargando pacientes...</p>
          ) : pacientes.length > 0 ? (
            <div className="relative z-50">
              <Select
                id="paciente"
                options={pacienteOptions}
                value={pacienteId ? pacienteOptions.find((option) => option.value === pacienteId) || null : null}
                onChange={handlePacienteChange}
                isClearable
                placeholder="Selecciona un paciente"
                className="react-select-container z-50"
                menuPortalTarget={document.body} // <-- Asegura que el menú aparezca sobre cualquier otro elemento
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Asegura que el menú tenga un índice z alto
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500">No hay pacientes disponibles.</p>
          )}
        </div>
        <button
          type="submit"
          className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-3xl hover:from-blue-700 hover:to-blue-500 transition-all duration-500 ease-in-out transform hover:scale-105 flex justify-center items-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <FiLoader className="mr-2 animate-spin" /> Subiendo...
            </>
          ) : (
            'Subir Radiografía'
          )}
        </button>
      </form>
    </div>
  );
};

interface RadiografiaItemProps {
  radiografia: RadiografiaDTO;
  onEliminar: (id: number) => void;
}

const RadiografiaItem: React.FC<RadiografiaItemProps> = ({ radiografia, onEliminar }) => {
  const handleEliminarClick = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la radiografía de ${radiografia.nombrePaciente}?`)) {
      onEliminar(radiografia.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in relative">
      <img
        src={radiografia.imageUrl}
        alt={`Radiografía de ${radiografia.nombrePaciente || 'Paciente desconocido'}`}
        className="w-full h-48 object-cover transition-transform transform hover:scale-105"
        loading="lazy"
      />
      <div className="p-6">
        <p className="text-gray-800 font-semibold">
          Paciente: {radiografia.nombrePaciente || 'N/A'}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Fecha: {new Date(radiografia.fecha).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="text-gray-700 mt-4 line-clamp-2">{radiografia.descripcion}</p>
        <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out" onClick={handleEliminarClick}>
          <FiTrash2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const RadiografiasComponent: React.FC = () => {
  // Estados
  const [radiografias, setRadiografias] = useState<RadiografiaDTO[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPacientes, setLoadingPacientes] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchPacientes();
    fetchRadiografiasRecientes();
  }, []);

  const fetchPacientes = async () => {
    setLoadingPacientes(true);
    try {
      const response = await axios.get<Paciente[]>('https://electivabackend.somee.com/api/paciente');
      setPacientes(response.data);
    } catch (err: any) {
      console.error('Error al obtener pacientes:', err);
      setError('No se pudo obtener la lista de pacientes.');
    } finally {
      setLoadingPacientes(false);
    }
  };

  const fetchRadiografiasRecientes = async (cantidad: number = 10) => {
    try {
      const response = await axios.get<RadiografiaDTO[]>('https://electivabackend.somee.com/api/radiografias/recientes', {
        params: { cantidad },
      });
      setRadiografias(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error al obtener radiografías:', err);
      setError('No se pudo obtener la lista de radiografías.');
      setLoading(false);
    }
  };

  const handleRadiografiaCreated = (radiografia: RadiografiaDTO) => {
    setRadiografias([radiografia, ...radiografias]);
    setSuccess('Radiografía subida exitosamente.');
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta radiografía?')) return;
    try {
      await axios.delete(`https://electivabackend.somee.com/api/radiografias/${id}`);
      setRadiografias(radiografias.filter((r) => r.id !== id));
      setSuccess('Radiografía eliminada exitosamente.');
    } catch (err: any) {
      console.error('Error al eliminar radiografía:', err);
      setError('No se pudo eliminar la radiografía.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Gestión de Radiografías</h1>
      {error && <Notification type="error" message={error} onClose={() => setError(null)} />}
      {success && <Notification type="success" message={success} onClose={() => setSuccess(null)} />}
      <RadiografiaForm
        pacientes={pacientes}
        loadingPacientes={loadingPacientes}
        onRadiografiaCreated={handleRadiografiaCreated}
      />
      {loading ? (
        <div className="text-center mt-16">
          <FiLoader className="animate-spin text-6xl text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando radiografías...</p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-white to-blue-50 p-8 rounded-3xl shadow-lg transition-all duration-500 ease-in-out transform hover:shadow-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">Radiografías Recientes</h2>
          {radiografias.length === 0 ? (
            <p className="text-center text-gray-600">No hay radiografías disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {radiografias.map((radiografia) => (
                <RadiografiaItem key={radiografia.id} radiografia={radiografia} onEliminar={handleEliminar} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RadiografiasComponent;
