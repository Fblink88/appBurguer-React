
import React from 'react';
import { render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/client/Login'; // Asegúrate que esta ruta sea correcta


// 1. Mock de window.alert()
// Simula la función 'alert' para que podamos espiarla
const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

// 2. Mock de localStorage
// Simula el localStorage para controlar los datos en las pruebas
let store = {};
const localStorageMock = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => {
    store[key] = value.toString();
  }),
  clear: vi.fn(() => {
    store = {};
  }),
  removeItem: vi.fn((key) => {
    delete store[key];
  }),
};
// Asigna el mock a la propiedad 'localStorage' de 'window'
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 3. Función auxiliar para renderizar
// Envuelve el componente Login en MemoryRouter para que 'useNavigate' funcione
const renderComponent = () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};


// PRUEBAS


describe('Componente Login', () => {
  // Configura user-event para simular interacciones de usuario
  const user = userEvent.setup();

  // Limpia los mocks y el localStorage antes de CADA prueba
  beforeEach(() => {
    alertMock.mockClear();
    localStorageMock.clear();
    // Inicia 'usuarios' como un array vacío en el storage,
    // ya que el componente intenta leerlo al cargar
    localStorage.setItem('usuarios', JSON.stringify([]));
  });

  // Limpia el DOM después de CADA prueba
  afterEach(() => {
    cleanup();
  });

  // --- PRUEBAS ---

  it('renderiza el formulario de Login por defecto', () => {
    renderComponent();

    // Busca el título del formulario de Login
    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    
    // Busca el título del panel de overlay derecho
    expect(screen.getByRole('heading', { name: /Comienza Registrándote/i })).toBeInTheDocument();
  });

  it('cambia al panel de Registro al hacer clic en "Registro"', async () => {
    renderComponent();

    // 1. Busca el botón para cambiar de panel
    const registerSwitchButton = screen.getByRole('button', { name: 'Registro' });
    
    // 2. Simula el clic del usuario 
    await user.click(registerSwitchButton);

    // 3. Verifica que el formulario de registro esté visible
    expect(screen.getByRole('heading', { name: /Regístrate aquí/i })).toBeInTheDocument();
  });

  it('permite a un usuario registrarse exitosamente', async () => {
    renderComponent();

    // 1. Cambia al panel de registro
    await user.click(screen.getByRole('button', { name: 'Registro' }));

    // 2. Identifica el formulario de registro
    // (Buscamos el formulario por su título para ser específicos)
    const registerForm = screen.getByRole('heading', { name: /Regístrate aquí/i }).closest('form');

    // 3. Rellena los campos del formulario
    //
    await user.type(within(registerForm).getByPlaceholderText('Nombre'), 'Usuario Nuevo');
    //
    await user.type(within(registerForm).getByPlaceholderText('Email'), 'nuevo@duocuc.cl');
    //
    await user.type(within(registerForm).getByPlaceholderText('Contraseña'), 'pass123');

    // 4. Envía el formulario
    await user.click(within(registerForm).getByRole('button', { name: 'Regístrate' }));

    // 5. Verifica la alerta de éxito
    expect(alertMock).toHaveBeenCalledWith('¡Registro exitoso! Ahora puedes iniciar sesión.');

    // 6. Verifica que el usuario se guardó en localStorage
    const expectedUser = { nombre: 'Usuario Nuevo', email: 'nuevo@duocuc.cl', password: 'pass123' };
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'usuarios',
      JSON.stringify([expectedUser])
    );
  });
  
  it('impide el registro si el email no es válido', async () => {
    renderComponent();
    await user.click(screen.getByRole('button', { name: 'Registro' }));
    
    const registerForm = screen.getByRole('heading', { name: /Regístrate aquí/i }).closest('form');
    
    await user.type(within(registerForm).getByPlaceholderText('Nombre'), 'Usuario Mal');
    await user.type(within(registerForm).getByPlaceholderText('Email'), 'mail@invalido.com'); // Dominio inválido
    await user.type(within(registerForm).getByPlaceholderText('Contraseña'), 'pass123');
    
    await user.click(within(registerForm).getByRole('button', { name: 'Regístrate' }));

    // Verifica la alerta de error de dominio;
    expect(alertMock).toHaveBeenCalledWith(
      'El correo debe tener un dominio válido: @duocuc.cl, @profesor.duocuc.cl o @gmail.com'
    );
  });

  it('permite a un usuario existente iniciar sesión', async () => {
    // 1. Setup: Crea un usuario en el mock de localStorage
    const mockUser = { nombre: 'Usuario Antiguo', email: 'antiguo@duocuc.cl', password: 'password' };
    localStorage.setItem('usuarios', JSON.stringify([mockUser]));

    renderComponent();
    
    // 2. Identifica el formulario de login (es el por defecto)
    const loginForm = screen.getByRole('heading', { name: /Iniciar Sesión/i }).closest('form');

    // 3. Rellena los campos
    await user.type(within(loginForm).getByPlaceholderText('Email'), 'antiguo@duocuc.cl');
    await user.type(within(loginForm).getByPlaceholderText('Contraseña'), 'password');

    // 4. Envía el formulario
    await user.click(within(loginForm).getByRole('button', { name: 'Iniciar Sesión' }));

    // 5. Verifica que se guardaron los datos de sesión en localStorage
    //
    expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
    //
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'Usuario Antiguo');
  });

  it('impide iniciar sesión con credenciales incorrectas', async () => {
    renderComponent(); // localStorage está vacío (por el beforeEach)
    
    const loginForm = screen.getByRole('heading', { name: /Iniciar Sesión/i }).closest('form');
    
    await user.type(within(loginForm).getByPlaceholderText('Email'), 'no@existe.com');
    await user.type(within(loginForm).getByPlaceholderText('Contraseña'), 'mala');
    
    await user.click(within(loginForm).getByRole('button', { name: 'Iniciar Sesión' }));

    // Verifica la alerta de error
    expect(alertMock).toHaveBeenCalledWith('Email o contraseña incorrectos');
  });
});