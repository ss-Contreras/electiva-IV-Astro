// src/components/ConfiguracionComponent.tsx

import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiUserCheck } from 'react-icons/fi';

interface Paciente {
  id: number;
  nombre: string;
}

interface Odontologo {
  id: number;
  nombre: string;
}

interface Cita {
  id: number;
  fecha: string;
  estado: string;
}

const ConfiguracionComponent: React.FC = () => {
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [totalOdontologos, setTotalOdontologos] = useState<number>(0);
  const [totalCitas, setTotalCitas] = useState<number>(0);
  const [citasPendientes, setCitasPendientes] = useState<number>(0);

  useEffect(() => {
    fetchPacientes();
    fetchOdontologos();
    fetchCitas();
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/paciente');
      const data: Paciente[] = await response.json();
      setTotalPacientes(data.length);
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
    }
  };

  const fetchOdontologos = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/odontologo');
      const data: Odontologo[] = await response.json();
      setTotalOdontologos(data.length);
    } catch (error) {
      console.error('Error al obtener los odontólogos:', error);
    }
  };

  const fetchCitas = async () => {
    try {
      const response = await fetch('https://localhost:7027/api/citas');
      const data: Cita[] = await response.json();
      setTotalCitas(data.length);
      const pendientes = data.filter((cita) => cita.estado === 'Pendiente').length;
      setCitasPendientes(pendientes);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Panel de Configuración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg flex items-center">
          <FiUsers className="text-blue-600 text-4xl mr-4" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Total de Pacientes</h2>
            <p className="text-3xl text-gray-800">{totalPacientes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg flex items-center">
          <FiUserCheck className="text-green-600 text-4xl mr-4" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Total de Odontólogos</h2>
            <p className="text-3xl text-gray-800">{totalOdontologos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg flex items-center">
          <FiCalendar className="text-yellow-600 text-4xl mr-4" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">Citas Pendientes</h2>
            <p className="text-3xl text-gray-800">{citasPendientes}</p>
          </div>
        </div>
      </div>

      {/* Sección informativa adicional */}
      <div className="mt-12 bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Información General</h2>
        <p className="text-gray-600">
          Bienvenido al panel de configuración. Aquí puedes ver un resumen de los datos principales de la aplicación.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
          <li>Total de pacientes registrados en el sistema.</li>
          <li>Total de odontólogos disponibles.</li>
          <li>Número de citas pendientes por atender.</li>
        </ul>
      </div>
    </div>
  );
};

export default ConfiguracionComponent;
