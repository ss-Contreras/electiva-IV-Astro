import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiUsers, FiClipboard } from 'react-icons/fi';
import { Button } from '../ui/button';

interface Cita {
  id: number;
  estado: string;
  fecha: string;
  motivo: string;
  nombreOdontologo: string;
  nombrePaciente: string;
  correoElectronicoPaciente: string;
  rutaImagen?: string; 
  pacienteId: number;
}

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
  rutaLocalImagen: string;
  telefono: string;
  correoElectronico: string;
  direccion: string;
  nombreOdontologo: string;
}

const DashboardComponent: React.FC = () => {
  const [citasProximas, setCitasProximas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [totalCitas, setTotalCitas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // obtener los datos de los pacientes
  const fetchPacienteData = async () => {
    try {
      const response = await axios.get('https://sonrisasbackendelectivaiv.somee.com/api/paciente');
      if (response.status === 200) {
        const pacientesData = response.data;
        setPacientes(pacientesData);
        setTotalPacientes(pacientesData.length);
        return pacientesData; // Devuelve los datos de pacientes
      }
    } catch (error) {
      console.error('Error al obtener los datos de los pacientes:', error);
    }
    return []; // Retorna un array vacío en caso de error
  };

  // obtener los datos de las citas
  const fetchCitaData = async (pacientesData: Paciente[]) => {
    try {
      const response = await axios.get('https://sonrisasbackendelectivaiv.somee.com/api/citas');
      if (response.status === 200) {
        const citasData = response.data;
        setTotalCitas(citasData.length);

        const ahora = new Date();
        const enSieteDias = new Date();
        enSieteDias.setDate(ahora.getDate() + 7);

        const proximas = citasData.filter((cita: any) => {
          const fechaCita = new Date(cita.fecha);
          return fechaCita >= ahora && fechaCita <= enSieteDias;
        });

        // Asociar la imagen de cada paciente a la cita correspondiente
        const citasConImagen = proximas.map((cita: Cita) => {
          const paciente = pacientesData.find((p) => p.id === cita.pacienteId);
          return { ...cita, rutaImagen: paciente?.rutaImagen };
        });

        // Ordenar por fecha
        citasConImagen.sort((a: Cita, b: Cita) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setCitasProximas(citasConImagen);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al obtener los datos de las citas:', error);
      setLoading(false);
    }
  };

  // Cargar datos de pacientes y citas al montar el componente
  useEffect(() => {
    fetchPacienteData().then((pacientesData) => {
      fetchCitaData(pacientesData);
    });
  }, []);
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Panel de Administración</h1>
      <p className="text-lg text-gray-600 mb-8">
        Bienvenido al panel de administración. Aquí encontrarás información relevante para gestionar el consultorio odontológico de manera eficiente.
      </p>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FiUsers className="text-blue-600 w-8 h-8" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">{totalPacientes}</h2>
            <p className="font-semibold">Total de Pacientes</p>
            <Button
              className='transition-colors rounded border font-semibold border-b-slate-400'>
              <a href='admin/pacientes'>
                Ver pacientes
              </a>
            </Button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-4 bg-green-100 rounded-full">
            <FiCalendar className="text-green-600 w-8 h-8" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">{totalCitas}</h2>
            <p className="font-semibold">Total de Citas</p>
            <Button
              className='transition-colors rounded border font-semibold border-b-slate-400'>
              <a href='admin/citas'>
                Ver citas
              </a>
            </Button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <FiClipboard className="text-yellow-600 w-8 h-8" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">{citasProximas.length}</h2>
            <p className="font-semibold">Citas Próximas</p>
          </div>
        </div>
      </div>

      {/* Citas Próximas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Citas Próximas</h2>
        {loading ? (  
          <p>Cargando citas...</p>
        ) : citasProximas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {citasProximas.slice(0, 5).map((cita) => (
              <li key={cita.id} className="py-4 flex items-center">
                {cita.rutaImagen && (
                  <img
                    src={`https://sonrisasbackendelectivaiv.somee.com${cita.rutaImagen}`}
                    alt={cita.nombrePaciente}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-900">{cita.estado}</p>
                  <p className="text-lg font-medium text-gray-500">{cita.nombrePaciente}</p>
                  <p className="text-lg font-medium text-gray-500">{cita.correoElectronicoPaciente}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span>Hora programada: </span>
                    {new Date(cita.fecha).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-sm text-gray-500">Odontólogo: {cita.nombreOdontologo}</p>
                  <p className="text-sm text-gray-500">Motivo: {cita.motivo}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay citas programadas para los próximos días.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
