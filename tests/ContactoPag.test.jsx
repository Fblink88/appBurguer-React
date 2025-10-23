import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // Necesario por Header/Footer
import ContactoPag from '../src/pages/client/ContactoPag';

// Mock simple para los componentes Header y Footer
// No necesitamos probarlos aquí, solo evitar errores si usan <Link> o hooks.
vi.mock('../src/components/HeaderComp', () => ({
  default: () => <header>Header Mock</header>,
}));
vi.mock('../src/components/FooterComp', () => ({
  default: () => <footer>Footer Mock</footer>,
}));

// Mock para window.alert
vi.stubGlobal('alert', vi.fn());// Mock para console.log
console.log = vi.fn();

// Función auxiliar para renderizar el componente
const renderContacto = () => {
  render(
    <BrowserRouter>
      <ContactoPag />
    </BrowserRouter>
  );
};

describe('Componente ContactoPag', () => {
  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // --- Pruebas de Renderizado ---

  it('debería renderizar la información de contacto correctamente', () => {
    renderContacto();
    expect(screen.getByText('Información de Contacto')).toBeInTheDocument();
    expect(screen.getByText('Etchevers 210, Viña del Mar')).toBeInTheDocument();
    expect(screen.getByText('+569 71334173')).toBeInTheDocument();
    expect(screen.getByText('Goldenpagos2@gmail.com')).toBeInTheDocument();
    // Verifica que los íconos (enlaces) de redes sociales estén
    expect(screen.getByTestId('instagram-link')).toBeInTheDocument();
    expect(screen.getByTestId('facebook-link')).toBeInTheDocument();
  });

  it('debería renderizar el formulario de contacto con sus campos', () => {
    renderContacto();
    expect(screen.getByText('Formulario de Contacto')).toBeInTheDocument();
    // Busca los campos por su etiqueta asociada
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Comentario')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  // --- Pruebas de Funcionalidad del Formulario ---

  it('debería actualizar los contadores de caracteres al escribir', async () => {
    renderContacto();
    const nombreInput = screen.getByLabelText('Nombre');
    const comentarioInput = screen.getByLabelText('Comentario');

    // Simula escribir en el campo Nombre
    fireEvent.change(nombreInput, { target: { value: 'Fabián Basaes' } });
    // Espera a que el DOM se actualice (el estado de React es asíncrono)
    await waitFor(() => {
      expect(screen.getByText('13 / 100 caracteres')).toBeInTheDocument();
    });

    // Simula escribir en el campo Comentario
    fireEvent.change(comentarioInput, { target: { value: 'Este es un comentario de prueba.' } });
    await waitFor(() => {
      expect(screen.getByText('32 / 500 caracteres')).toBeInTheDocument();
    });
  });

  it('debería mostrar mensajes de error si se envía el formulario vacío', async () => {
    renderContacto();
    const submitButton = screen.getByRole('button', { name: 'Enviar' });

    // Simula el clic en Enviar sin rellenar nada
    fireEvent.click(submitButton);

    // Espera a que aparezcan los mensajes de validación de Bootstrap
    // `findAllByText` busca todos los elementos con ese texto (puede haber varios mensajes iguales)
    const errorMessagesNombre = await screen.findAllByText('Debe ingresar un nombre (máx. 100 caracteres).');
    const errorMessagesCorreo = await screen.findAllByText('Ingrese un correo válido.');
    const errorMessagesComentario = await screen.findAllByText('Debe ingresar un comentario (máx. 500 caracteres).');

    // Verifica que al menos un mensaje de error para cada campo esté visible
    expect(errorMessagesNombre.length).toBeGreaterThan(0);
    expect(errorMessagesCorreo.length).toBeGreaterThan(0);
    expect(errorMessagesComentario.length).toBeGreaterThan(0);

    // Verifica que alert y console.log NO fueron llamados
    expect(alert).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('debería enviar el formulario (llamar a alert y console.log) si los campos son válidos', async () => {
    renderContacto();
    const nombreInput = screen.getByLabelText('Nombre');
    const correoInput = screen.getByLabelText('Correo');
    const comentarioInput = screen.getByLabelText('Comentario');
    const submitButton = screen.getByRole('button', { name: 'Enviar' });

    // Rellenamos el formulario con datos válidos
    fireEvent.change(nombreInput, { target: { value: 'Usuario Test' } });
    fireEvent.change(correoInput, { target: { value: 'test@correo.com' } });
    fireEvent.change(comentarioInput, { target: { value: 'Mensaje válido.' } });

    // Enviamos el formulario
    fireEvent.click(submitButton);

    // Esperamos a que la lógica del handleSubmit se ejecute
    await waitFor(() => {
      // Verificamos que se llamó a alert
      expect(alert).toHaveBeenCalledWith("¡Gracias por tu mensaje!");
      // Verificamos que se llamó a console.log con los datos correctos
      expect(console.log).toHaveBeenCalledWith("Formulario enviado:", {
        nombre: 'Usuario Test',
        correo: 'test@correo.com',
        comentario: 'Mensaje válido.'
      });
    });

    
  });
});