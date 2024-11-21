// src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      © {new Date().getFullYear()} Sonrisas. Todos los derechos reservados.
    </footer>
  );
};

export default Footer;
