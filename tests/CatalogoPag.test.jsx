import React from "react"; 
import { render, screen, fireEvent } from "@testing-library/react";  //
import { describe, it, expect, beforeEach, vi } from "vitest";
import CatalogoPag from "../src/pages/client/CatalogoPag";
import { BrowserRouter } from "react-router-dom";

// Función auxiliar para renderizar el componente con Router
const renderCatalogo = () => {
  render(
    <BrowserRouter>
      <CatalogoPag />
    </BrowserRouter>
  );
};

describe("Componente Catálogo", () => {
  beforeEach(() => { // Antes de cada prueba, se debe mockear scrollIntoView,
  //  para evitar errores en pruebas que involucran navegación por categorías
    Element.prototype.scrollIntoView = vi.fn(); //
  });

  it("renderiza el título de categoría Combos", () => {
    renderCatalogo();
    const tituloCombos = screen.getByRole('heading', { name: /Combos/i, level: 2 });
    expect(tituloCombos).toBeInTheDocument();
  });

  it("muestra el botón de agregar al carrito", () => {
    renderCatalogo();
    const botonesAgregar = screen.getAllByTitle("Agregar al carrito");
    expect(botonesAgregar.length).toBeGreaterThan(0);
  });

  it("hace scroll a la categoría al hacer click en el botón de categoría", () => {
    renderCatalogo(); // Renderiza el componente CatalogoPag dentro de un BrowserRouter
    // Buscar el botón "Burgers"
    const botonCategoria = screen.getByRole('link', { name: /Burgers/i });
    expect(botonCategoria.getAttribute('href')).toBe('#burgers');
    
    fireEvent.click(botonCategoria);
    
    // Verificar que la sección existe
    const seccionBurgers = document.getElementById('burgers');
    expect(seccionBurgers).toBeInTheDocument();
  });
});