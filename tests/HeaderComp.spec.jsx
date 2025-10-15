// tests/HeaderComp.spec.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { describe, it, expect } from 'vitest'; 

import HeaderComp from '../src/components/HeaderComp';

// 'describe' agrupa las pruebas de un componente
describe('Componente HeaderComp', () => {

  // 'it' define una prueba específica
  it('debería mostrar el nombre "GOLDEN BURGER"', () => {
    
    // Renderizamos el componente
    render(
      <BrowserRouter>
        <HeaderComp />
      </BrowserRouter>
    );

    // Buscamos el texto en la pantalla
    const brandLink = screen.getByRole('link', { name: /golden burger/i });

    // Verificamos que el texto exista
    expect(brandLink).toBeInTheDocument();
  });

});