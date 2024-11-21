import React from 'react';
import { useState } from 'react';
import { FiCalendar, FiUser, FiSettings, FiImage, FiHome, FiSmile, FiTool } from 'react-icons/fi';
import { FaTooth } from 'react-icons/fa';

const Sidebar = () => {
  const [tooltip, setTooltip] = useState('');

  return (
    <aside className="w-56 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col fixed h-full shadow-2xl md:block z-20 transform transition-transform duration-500 ease-in-out hover:translate-x-3">
      {/* Logo */}
      <div className="p-6 text-3xl font-extrabold border-b border-blue-600 hover:text-blue-300 transition-colors duration-300">
        <a href="/" className="flex items-center space-x-3">
          <FaTooth className="h-8 w-8" />
          <span>Sonrisas</span>
        </a>
      </div>
      <nav className="flex-1 p-6 overflow-y-auto">
        <ul className="space-y-4">
          <li
            onMouseEnter={() => setTooltip('Ver y gestionar citas')}
            onMouseLeave={() => setTooltip('')}
            className="group relative"
          >
            <a href="/admin/citas" className="flex items-center p-3 rounded-xl hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-110">
              <FiCalendar className="h-6 w-6 mr-3 text-white group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Citas</span>
            </a>
          </li>
          <li
            onMouseEnter={() => setTooltip('Ver y administrar odontólogos')}
            onMouseLeave={() => setTooltip('')}
            className="group relative"
          >
            <a href="/admin/odontologos" className="flex items-center p-3 rounded-xl hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-110">
              <FiUser className="h-6 w-6 mr-3 text-white group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Odontólogos</span>
            </a>
          </li>
          <li
            onMouseEnter={() => setTooltip('Ver radiografías de pacientes')}
            onMouseLeave={() => setTooltip('')}
            className="group relative"
          >
            <a href="/admin/radiografias" className="flex items-center p-3 rounded-xl hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-110">
              <FiImage className="h-6 w-6 mr-3 text-white group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Radiografías</span>
            </a>
          </li>
          <li
            onMouseEnter={() => setTooltip('Ver consultorios disponibles')}
            onMouseLeave={() => setTooltip('')}
            className="group relative"
          >
            <a href="/admin/consultorio" className="flex items-center p-3 rounded-xl hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-110">
              <FiHome className="h-6 w-6 mr-3 text-white group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Consultorios</span>
            </a>
          </li>
          <li
            onMouseEnter={() => setTooltip('Ver pacientes registrados')}
            onMouseLeave={() => setTooltip('')}
            className="group relative"
          >
            <a href="/admin/pacientes" className="flex items-center p-3 rounded-xl hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-110">
              <FiUser className="h-6 w-6 mr-3 text-white group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Pacientes</span>
            </a>
          </li>
          <li
            onMouseEnter={() => setTooltip('Configuración e información')}
            onMouseLeave={() => setTooltip('')}
            className="group relative"
          >
            <a href="/admin/configuracion" className="flex items-center p-3 rounded-xl hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-110">
              <FiSettings className="h-6 w-6 mr-3 text-white group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Información</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-20 left-60 p-3 bg-black text-white rounded-lg shadow-lg text-sm opacity-90 transition-opacity duration-500">
          {tooltip}
        </div>
      )}

      {/* Botón "Volver" */}
      <div className="p-6 border-t border-blue-600">
        <a href="/admin" className="w-full flex items-center justify-center p-3 rounded-xl bg-blue-800 hover:bg-blue-600 transition-transform transform hover:scale-110 duration-500">
          <FiTool className="h-6 w-6 mr-2" />
          <span>Admin</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
