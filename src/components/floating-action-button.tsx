import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

const FloatingActionButton = () => {
  // Manejador de clics para el botón.
  // Aquí puedes agregar la lógica para, por ejemplo,
  // abrir un formulario o navegar a una nueva página.
  const handleAddClick = () => {
    console.log('Botón de agregar registro clicado!');
    // Por ejemplo, aquí podrías abrir un modal o redireccionar.
    // window.location.href = '/registro/nuevo';
    // O llamar a una función para abrir un modal:
    // openNewRecordModal();
  };

  return (
    // Contenedor principal que se mantiene fijo en la pantalla.
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón con estilos de Tailwind CSS para un diseño flotante. */}
      <Button
        onClick={handleAddClick}
        className="
          flex items-center justify-center 
          rounded-full 
          shadow-lg
          transition-all duration-300
          transform hover:scale-110
          hover:ring-2 ring-orange-400 hover:dark:ring-blue-500
        "
        aria-label="Agregar nuevo registro"
      >
        {/* Icono de "+" de lucide-react */}
        <Plus className="w-8 h-8" /> Add new record
      </Button>
    </div>
  );
};

export default FloatingActionButton;