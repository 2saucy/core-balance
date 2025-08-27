import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} CoreBalance. Todos los derechos reservados.</p>
        <p className="mt-1">Hecho con ❤️ por Gucho.</p>
      </div>
    </footer>
  );
};

export default Footer;