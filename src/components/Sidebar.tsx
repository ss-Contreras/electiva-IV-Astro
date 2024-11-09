import React from 'react'

type Props = {}

const Sidebar = (props: Props) => {
  return (
    
<aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full shadow-lg md:block z-10">
    {/* Logo */}
    <div className="p-6 text-3xl font-bold border-b border-blue-700">
      <a href="/">
        Sonrisas
      </a>
    </div>
    <nav className="flex-1 p-6 overflow-y-auto">
      <ul className="space-y-4">
      <li>
          <a href="/admin/consultorio" className="flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Consultorio
          </a>
        </li>
        <li>
          <a href="/admin/citas" className="flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Citas
          </a>
        </li>
        {/* <li>
          <a href="/admin/pacientes" className="flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Pacientes
          </a>
        </li> */}
        <li>
          <a href="/admin/odontologos" className="flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-5 4v-4m0 0l-3 3m3-3l3 3" />
            </svg>
            Odontologos
          </a>
        </li>
        <li>
          <a href="/admin/radiografias" className="flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
            </svg>
            Radiografías
          </a>
        </li>
        <li>
          <a href="/admin/configuracion" className="flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.467a1 1 0 00-.364 1.118l1.287 3.965c.3.921-.755 1.688-1.54 1.118l-3.392-2.467a1 1 0 00-1.176 0l-3.392 2.467c-.784.57-1.838-.197-1.54-1.118l1.287-3.965a1 1 0 00-.364-1.118L2.86 9.39c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.964z" />
            </svg>
            Configuración
          </a>
        </li>
      </ul>
    </nav>
  
    {/* Botón "Volver" */}
    <div className="p-6 border-t border-blue-700">
      <a href="/admin" className="w-full flex items-center justify-center p-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Admin
      </a>
    </div>
  </aside>
  
  )
}

export default Sidebar