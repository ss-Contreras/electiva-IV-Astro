// src/components/RadiografiasComponent.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { useDropzone } from 'react-dropzone';
import '../../styles/global.css'; // Asegúrate de que esta ruta es correcta

// Definición de interfaces
interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
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

interface RadiografiaDTO {
  id: number;
  imageUrl: string;
  descripcion: string;
  fecha: string; // ISO string
  pacienteId: number;
  nombrePaciente?: string;
  correoElectronicoPaciente?: string;
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
      className={`mb-6 ${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative`}
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Estado para la vista previa
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Configuración de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles: File[], fileRejections: any[]) => { // Tipos explícitos
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
    setSuccess(null);

    // Validaciones
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
      setSuccess('Radiografía subida exitosamente.');
      setDescripcion('');
      setFecha('');
      setPacienteId(null);
      setImagen(null);
      onRadiografiaCreated(response.data);
    } catch (err: any) {
      console.error('Error al subir radiografía:', err);
      setError(err.response?.data?.message || 'Error al subir la radiografía.');
    } finally {
      setLoading(false);
    }
  };

  // Opciones para react-select en Pacientes
  const pacienteOptions = pacientes.map((paciente) => ({
    value: paciente.id,
    label: `${paciente.nombre} ${paciente.apellido || ''}`.trim(),
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Subir Nueva Radiografía</h2>
      {/* Mensajes de Error y Éxito */}
      {error && <Notification type="error" message={error} onClose={() => setError(null)} />}
      {success && <Notification type="success" message={success} onClose={() => setSuccess(null)} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Área de Drag and Drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 flex items-center justify-center">
              <FiUpload className="mr-2" />
              Suelta la imagen aquí...
            </p>
          ) : (
            <p className="text-gray-600 flex flex-col items-center">
              <FiUpload className="text-4xl mb-2" />
              Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.
              <span className="text-sm text-gray-500">(Solo .jpg, .jpeg, .png - Max 5MB)</span>
            </p>
          )}
        </div>
        {/* Vista Previa de la Imagen Seleccionada */}
        {previewUrl && (
          <div className="flex items-center space-x-4">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-24 h-24 object-cover rounded-lg"
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

        {/* Campo de Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Ingresa una descripción detallada de la radiografía."
            required
          ></textarea>
        </div>

        {/* Campo de Fecha */}
        <div>
          <label htmlFor="fecha" className="block text-gray-700 mb-2">
            Fecha de la Radiografía
          </label>
          <input
            type="datetime-local"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Selector de Paciente */}
        <div>
          <label htmlFor="paciente" className="block text-gray-700 mb-2">
            Paciente
          </label>
          {loadingPacientes ? (
            <p className="text-gray-500">Cargando pacientes...</p>
          ) : pacientes.length > 0 ? (
            <Select
              id="paciente"
              options={pacienteOptions}
              value={
                pacienteId
                  ? pacienteOptions.find((option) => option.value === pacienteId) || null
                  : null
              }
              onChange={handlePacienteChange}
              isClearable
              placeholder="Selecciona un paciente"
              className="react-select-container"
            />
          ) : (
            <p className="text-gray-500">No hay pacientes disponibles.</p>
          )}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className={`w-full py-3 px-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Subiendo...' : 'Subir Radiografía'}
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
    onEliminar(radiografia.id);
  };

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <img
        src={radiografia.imageUrl}
        alt={`Radiografía de ${radiografia.nombrePaciente || 'Paciente desconocido'}`}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <p className="text-gray-800 font-semibold">
          Paciente: {radiografia.nombrePaciente || 'N/A'}
        </p>
        <p className="text-gray-600 text-sm">
          Fecha: {new Date(radiografia.fecha).toLocaleString()}
        </p>
        <p className="text-gray-700 mt-2">{radiografia.descripcion}</p>
        <div className="flex justify-end space-x-2 mt-4">
          {/* Botón de Eliminar */}
          <button
            onClick={handleEliminarClick}
            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            aria-label={`Eliminar radiografía de ${radiografia.nombrePaciente || 'Paciente desconocido'}`}
          >
            <FiTrash2 className="mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

interface RadiografiaListProps {
  radiografias: RadiografiaDTO[];
  onEliminar: (id: number) => void;
}

const RadiografiaList: React.FC<RadiografiaListProps> = ({ radiografias, onEliminar }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Radiografías Recientes</h2>
      {radiografias.length === 0 ? (
        <p className="text-center text-gray-600">No hay radiografías disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {radiografias.map((radiografia) => (
            <RadiografiaItem
              key={radiografia.id}
              radiografia={radiografia}
              onEliminar={onEliminar}
            />
          ))}
        </div>
      )}
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

  // Función para obtener la lista de pacientes
  const fetchPacientes = async () => {
    setLoadingPacientes(true);
    try {
      const response = await axios.get<Paciente[]>('https://electivabackend.somee.com/api/paciente');
      setPacientes(response.data);
      setError(null); // Limpiar el error si la carga es exitosa
    } catch (err: any) {
      console.error('Error al obtener pacientes:', err);
      setError('No se pudo obtener la lista de pacientes.');
    } finally {
      setLoadingPacientes(false);
    }
  };

  // Función para obtener radiografías recientes
  const fetchRadiografiasRecientes = async (cantidad: number = 10) => {
    try {
      const response = await axios.get<RadiografiaDTO[]>('https://electivabackend.somee.com/api/radiografias/recientes', {
        params: { cantidad },
      });
      setRadiografias(response.data);
      setError(null); // Limpiar el error si la carga es exitosa
      setLoading(false);
    } catch (err: any) {
      console.error('Error al obtener radiografías:', err);
      setError('No se pudo obtener la lista de radiografías.');
      setLoading(false);
    }
  };

  // Función para buscar radiografías
  const buscarRadiografias = async (termino: string) => {
    try {
      const response = await axios.get<RadiografiaDTO[]>('https://electivabackend.somee.com/api/radiografias/buscar', {
        params: { termino },
      });
      setRadiografias(response.data);
      setError(null); // Limpiar el error si la búsqueda es exitosa
    } catch (err: any) {
      console.error('Error al buscar radiografías:', err);
      setError('No se pudo realizar la búsqueda.');
    }
  };

  useEffect(() => {
    fetchPacientes();
    fetchRadiografiasRecientes();
  }, []);

  // Manejo de la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      fetchRadiografiasRecientes();
    } else {
      buscarRadiografias(term);
    }
  };

  // Función para manejar la creación de una nueva radiografía
  const handleRadiografiaCreated = (radiografia: RadiografiaDTO) => {
    setRadiografias([radiografia, ...radiografias]);
    setSuccess('Radiografía subida exitosamente.');
    setError(null);
  };

  // Función para manejar la eliminación de una radiografía
  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta radiografía?')) return;
    try {
      await axios.delete(`https://electivabackend.somee.com/api/radiografias/${id}`);
      setRadiografias(radiografias.filter((r) => r.id !== id));
      setSuccess('Radiografía eliminada exitosamente.');
      setError(null);
    } catch (err: any) {
      console.error('Error al eliminar radiografía:', err);
      setError('No se pudo eliminar la radiografía.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Gestión de Radiografías</h1>

      {/* Mensajes de Error y Éxito */}
      {error && <Notification type="error" message={error} onClose={() => setError(null)} />}
      {success && <Notification type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Formulario de Subida de Radiografías */}
      <RadiografiaForm
        pacientes={pacientes}
        loadingPacientes={loadingPacientes}
        onRadiografiaCreated={handleRadiografiaCreated}
      />

      {/* Barra de Búsqueda */}
      {/* <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Buscar radiografías..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      {/* Listado de Radiografías */}
      {loading ? (
        <div className="text-center">
          <p className="text-gray-600">Cargando radiografías...</p>
        </div>
      ) : (
        <RadiografiaList radiografias={radiografias} onEliminar={handleEliminar} />
      )}
    </div>
  );
};

export default RadiografiasComponent;
