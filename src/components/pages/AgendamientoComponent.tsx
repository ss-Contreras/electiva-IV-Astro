import React, { useState, useEffect } from 'react';
import { FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const AgendamientoComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    edad: '',
    fechaCita: '',
    nuevoPaciente: 'Si',
    pacienteRecomendado: 'Si',
    motivoConsulta: '',
    telefono: '',
    correoElectronico: '',
    direccion: '',
    odontologoId: '',
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [odontologos, setOdontologos] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const fetchOdontologos = async () => {
      try {
        const response = await axios.get('https://sonrisasbackendelectivaiv.somee.com/api/odontologo');
        if (response.status === 200) {
          setOdontologos(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los odontólogos:', error);
      }
    };

    fetchOdontologos();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' || name === 'odontologoId' ? Number(value) : value,
    }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setValidationErrors([]);

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('cedula', formData.cedula);
      data.append('edad', formData.edad);
      const fechaCitaFormatted = formatDate(formData.fechaCita);
      data.append('fechaCita', fechaCitaFormatted);
      data.append('nuevoPaciente', formData.nuevoPaciente);
      data.append('pacienteRecomendado', formData.pacienteRecomendado);
      data.append('motivoConsulta', formData.motivoConsulta);
      data.append('telefono', formData.telefono);
      data.append('correoElectronico', formData.correoElectronico);
      data.append('direccion', formData.direccion);
      data.append('odontologoId', formData.odontologoId.toString());

      if (imagen) {
        data.append('imagen', imagen);
      }

      const response = await axios.post('https://sonrisasbackendelectivaiv.somee.com/api/paciente', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({
          nombre: '',
          cedula: '',
          edad: '',
          fechaCita: '',
          nuevoPaciente: 'Si',
          pacienteRecomendado: 'Si',
          motivoConsulta: '',
          telefono: '',
          correoElectronico: '',
          direccion: '',
          odontologoId: '',
        });
        setImagen(null);
        setImagenPreview(null);
      } else {
        setSuccess(false);
        if (response.data && response.data.errors) {
          const errors = Object.values(response.data.errors).flat() as string[];
          setValidationErrors(errors);
        } else {
          setValidationErrors(['Ocurrió un error desconocido.']);
        }
      }
    } catch (error: any) {
      console.error('An error occurred:', error);
      if (error.response && error.response.data) {
        console.error('Error response data:', error.response.data);
        const errors: string[] = [];
        if (error.response.data.errors) {
          const backendErrors = error.response.data.errors;
          for (const field in backendErrors) {
            if (backendErrors.hasOwnProperty(field)) {
              const fieldErrors = backendErrors[field];
              fieldErrors.forEach((msg: string) => {
                errors.push(`${field}: ${msg}`);
              });
            }
          }
        } else if (error.response.data.detail) {
          errors.push(error.response.data.detail);
        } else {
          errors.push('Ocurrió un error desconocido.');
        }
        setValidationErrors(errors);
      } else {
        setValidationErrors(['No se pudo conectar con el servidor. Por favor, intente nuevamente más tarde.']);
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-6">
      <h1 className="text-center font-bold text-2xl md:text-4xl lg:text-4xl mb-8">
        Agendamiento
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {/* Columna 1 */}
          <div>
            <label className="mb-2 font-semibold block">Nombre del paciente</label>
            <input
              className="border rounded-md px-2 py-2 w-full text-sm"
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <label className="mb-2 font-semibold block mt-4">Cédula del paciente</label>
            <input
              className="border rounded-md px-2 py-2 w-full text-sm"
              type="text"
              name="cedula"
              placeholder="Identificación"
              value={formData.cedula}
              onChange={handleInputChange}
              required
            />
            <label className="mb-2 font-semibold block mt-4">Edad del paciente</label>
            <input
              className="border rounded-md px-2 py-2 w-full text-sm"
              type="number"
              name="edad"
              placeholder="Edad"
              value={formData.edad}
              onChange={handleInputChange}
              min="0"
              required
            />
            <label className="mb-2 font-semibold block mt-4">Teléfono</label>
            <input
              className="border rounded-md px-2 py-2 w-full text-sm"
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Columna 2 */}
          <div>
            <label className="mb-2 font-semibold block">Fecha de la cita</label>
            <input
              className="border rounded-md px-2 py-2 w-full text-sm"
              type="date"
              name="fechaCita"
              value={formData.fechaCita}
              onChange={handleInputChange}
              required
            />
            <label className="mb-2 font-semibold block mt-4">Paciente nuevo</label>
            <select
              className="border rounded-md px-2 py-2 w-full text-sm"
              name="nuevoPaciente"
              value={formData.nuevoPaciente}
              onChange={handleInputChange}
              required
            >
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
            <label className="mb-2 font-semibold block mt-4">Recomendado</label>
            <select
              className="border rounded-md px-2 py-2 w-full text-sm"
              name="pacienteRecomendado"
              value={formData.pacienteRecomendado}
              onChange={handleInputChange}
              required
            >
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
            <label className="mb-2 font-semibold block mt-4">Correo Electrónico</label>
            <input
              className="border rounded-md px-2 py-2 w-full text-sm"
              type="email"
              name="correoElectronico"
              placeholder="Correo Electrónico"
              value={formData.correoElectronico}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Columna 3 */}
          <div className="min-h-full items-center justify-center p-4">
            <label className="mb-2 font-semibold block">Cargar Imagen</label>
            <div
              {...getRootProps()}
              className={`border-dashed border-2 rounded-md px-2 py-8 w-full text-sm text-center cursor-pointer transition-colors duration-200 ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Suelta la imagen aquí...</p>
              ) : (
                <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una</p>
              )}
            </div>
            {imagenPreview && (
              <div className="mt-4">
                <img
                  src={imagenPreview}
                  alt="Preview"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        {/* Inputs de Dirección y Odontólogo después de los otros inputs */}
        <div className="grid grid-cols-1 gap-y-6 mt-6">
          <label className="mb-2 font-semibold block">Dirección</label>
          <input
            className="border rounded-md px-2 py-2 w-full text-sm"
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleInputChange}
            required
          />
          <label className="mb-2 font-semibold block mt-4">Odontólogo</label>
          <select
            className="border rounded-md px-2 py-2 w-full text-sm"
            name="odontologoId"
            value={formData.odontologoId}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un odontólogo</option>
            {odontologos.map((odontologo) => (
              <option key={odontologo.id} value={odontologo.id}>
                {odontologo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 font-semibold block mt-6">Motivo de la consulta</label>
          <textarea
            className="border rounded-md px-4 py-2 w-full text-sm resize-none"
            placeholder="Motivo"
            name="motivoConsulta"
            value={formData.motivoConsulta}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        {validationErrors.length > 0 && (
          <div className="mt-4 text-red-600">
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="py-2 px-5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <FiUpload className="mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <FiUpload className="mr-2" />
              Enviar
            </>
          )}
        </button>
        {success === true && (
          <div className="mt-4 text-green-600 flex items-center">
            <FiCheckCircle className="mr-2" />
            ¡Paciente registrado exitosamente!
          </div>
        )}
        {success === false && validationErrors.length === 0 && (
          <div className="mt-4 text-red-600 flex items-center">
            <FiXCircle className="mr-2" />
            Hubo un error al registrar el paciente.
          </div>
        )}
      </form>
    </div>
  );
};

export default AgendamientoComponent;
