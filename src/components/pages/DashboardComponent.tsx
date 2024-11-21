import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiUsers, FiClipboard, FiSettings, FiFileText, FiUserCheck, FiUser } from 'react-icons/fi';
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
      const response = await axios.get('https://electivabackend.somee.com/api/paciente');
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
      const response = await axios.get('https://electivabackend.somee.com/api/citas');
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-6 text-gray-900">Panel de Administración</h1>
      <p className="text-lg text-gray-600 mb-8">
        Bienvenido al panel de administración. Aquí encontrarás información relevante para gestionar el consultorio odontológico de manera eficiente.
      </p>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-white rounded-full">
              <FiUsers className="text-blue-600 w-10 h-10" />
            </div>
            <div className="ml-6">
              <h2 className="text-4xl font-bold">{totalPacientes}</h2>
              <p className="text-xl font-semibold">Total de Pacientes</p>
              <Button className='mt-4 w-full bg-white text-blue-700 font-bold py-2 px-4 rounded-full hover:bg-blue-100 transition-transform transform hover:scale-105 duration-300 shadow-md'>
                <a href='/admin/pacientes'>Ver pacientes</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-8 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-white rounded-full">
              <FiCalendar className="text-green-600 w-10 h-10" />
            </div>
            <div className="ml-6">
              <h2 className="text-4xl font-bold">{totalCitas}</h2>
              <p className="text-xl font-semibold">Total de Citas</p>
              <Button className='mt-4 w-full bg-white text-green-700 font-bold py-2 px-4 rounded-full hover:bg-green-100 transition-transform transform hover:scale-105 duration-300 shadow-md'>
                <a href='/admin/citas'>Ver citas</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-8 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 bg-white rounded-full">
              <FiClipboard className="text-yellow-600 w-10 h-10" />
            </div>
            <div className="ml-6">
              <h2 className="text-4xl font-bold">{citasProximas.length}</h2>
              <p className="text-xl font-semibold">Citas Próximas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Citas Próximas */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Citas Próximas</h2>
        {loading ? (  
          <p className="text-lg text-gray-600">Cargando citas...</p>
        ) : citasProximas.length > 0 ? (
          <ul className="space-y-6">
            {citasProximas.slice(0, 5).map((cita) => (
              <li key={cita.id} className="bg-gray-50 p-6 rounded-lg shadow-md flex items-center transition-all hover:bg-gray-100 hover:shadow-lg transform hover:scale-105">
                {cita.rutaImagen && (
                  <img
                    src={`https://electivabackend.somee.com/${cita.rutaImagen}`}
                    alt={cita.nombrePaciente}
                    className="w-16 h-16 rounded-full mr-6 border-2 border-gray-300 shadow-md"
                  />
                )}
                <div className="ml-3">
                  <p className="text-xl font-bold text-gray-800 mb-1">{cita.estado}</p>
                  <p className="text-lg text-gray-700 font-semibold">{cita.nombrePaciente}</p>
                  <p className="text-lg text-gray-600 mb-2">{cita.correoElectronicoPaciente}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <span className="font-semibold">Hora programada: </span>
                    {new Date(cita.fecha).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mb-1 font-semibold">Odontólogo: {cita.nombreOdontologo}</p>
                  <p className="text-sm text-gray-500">Motivo: {cita.motivo}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600">No hay citas programadas para los próximos días.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
