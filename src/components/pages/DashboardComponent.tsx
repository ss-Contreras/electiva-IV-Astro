import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiUsers, FiClipboard } from 'react-icons/fi';
import { Button } from '../ui/button';

interface Cita {
  id: number;
  nombre: string;
  fechaCita: string;
  motivoConsulta: string;
  nombreOdontologo: string;
}

const DashboardComponent: React.FC = () => {
  const [citasProximas, setCitasProximas] = useState<Cita[]>([]);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [totalCitas, setTotalCitas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('https://localhost:7027/api/paciente');
      if (response.status === 200) {
        const pacientes = response.data;
        setTotalPacientes(pacientes.length);
        setTotalCitas(pacientes.length); // Asumiendo que cada paciente tiene una cita

        // Filtrar citas próximas (por ejemplo, próximas 7 días)
        const ahora = new Date();
        const enSieteDias = new Date();
        enSieteDias.setDate(ahora.getDate() + 7);

        const proximas = pacientes.filter((paciente: any) => {
          const fechaCita = new Date(paciente.fechaCita);
          return fechaCita >= ahora && fechaCita <= enSieteDias;
        });

        // Ordenar por fecha
        proximas.sort((a: any, b: any) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime());

        setCitasProximas(proximas);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al obtener los datos del dashboard:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
            <p className="text-gray-600">Total de Pacientes</p>
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
            <p className="text-gray-600">Total de Citas</p>
            <Button
              className='transition-colors rounded border font-semibold border-b-slate-400'>
              Ver citas
            </Button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <FiClipboard className="text-yellow-600 w-8 h-8" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">{citasProximas.length}</h2>
            <p className="text-gray-600">Citas Próximas</p>
          </div>
        </div>
      </div>

      {/* Recordatorios de Citas Próximas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Citas Próximas</h2>
        {loading ? (
          <p>Cargando citas...</p>
        ) : citasProximas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {citasProximas.slice(0, 5).map((cita) => (
              <li key={cita.id} className="py-4 flex items-center">
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-900">{cita.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(cita.fechaCita).toLocaleDateString()} - {cita.motivoConsulta}
                  </p>
                  <p className="text-sm text-gray-500">Odontólogo: {cita.nombreOdontologo}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay citas programadas para los próximos días.</p>
        )}
      </div>

      {/* Sección de Estadísticas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Estadísticas</h2>
        <p className="text-gray-700">
          Pronto podrás ver estadísticas detalladas sobre las citas, pacientes y radiografías.
        </p>
      </div>
    </div>
  );
};

export default DashboardComponent;
