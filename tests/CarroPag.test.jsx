import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CarroPag from "../src/pages/client/CarroPag";
import { BrowserRouter } from "react-router-dom";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de un producto en el carrito
const mockProducto = {
  id: "1-Simple",
  nombre: "Golden",
  precio: 7990,
  cantidad: 1,
  size: "Simple",
  imagen: "/src/assets/img/Golden.PNG",
  descripcion: "Hamburguesa Golden"
};

// Función auxiliar para renderizar el componente con Router
const renderCarrito = () => {
  // Simular un producto en el carrito
  localStorage.setItem('carrito', JSON.stringify([mockProducto]));
  render(
    <BrowserRouter>
      <CarroPag />
    </BrowserRouter>
  );
};

describe("Componente Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("muestra el producto agregado en el carrito", () => {
    renderCarrito();
    expect(screen.getByText("Golden")).toBeInTheDocument();
  });

  it("muestra el texto 'Subtotal:' en el resumen", () => {
    renderCarrito();
    expect(screen.getByText("Subtotal:")).toBeInTheDocument();
  });
});