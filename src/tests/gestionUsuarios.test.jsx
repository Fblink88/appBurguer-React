import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import GestionUsuarios from "../pages/admin/gestionUsuarios";

// Mock del Sidebar para evitar dependencias visuales
vi.mock("../components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

// Mock de la base de datos (src/data/dataBase.js)
vi.mock("../data/dataBase", () => ({
  usuarios: [
    { run: "11111111-1", nombre: "Juan", apellidos: "Pérez", email: "juan@test.com", rol: "Admin" },
    { run: "22222222-2", nombre: "María", apellidos: "Gómez", email: "maria@test.com", rol: "Cocinero" },
  ],
  clientes: [
    { nombre: "Carlos", correo: "carlos@cliente.com" },
    { nombre: "Ana", correo: "ana@cliente.com" },
  ],
}));

// Mock del navigate de react-router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Página de Gestión de Usuarios", () => {
  beforeEach(() => {
    localStorage.clear();
    render(
      <MemoryRouter>
        <GestionUsuarios />
      </MemoryRouter>
    );
  });

  it("debería renderizar correctamente los títulos y secciones", () => {
    expect(screen.getByText("Gestión de Usuarios y Clientes")).toBeInTheDocument();
    expect(screen.getByText("Trabajadores")).toBeInTheDocument();
    expect(screen.getByText("Clientes")).toBeInTheDocument();
  });

  it("debería mostrar usuarios desde la base de datos", () => {
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("María")).toBeInTheDocument();
  });

  it("debería mostrar clientes desde la base de datos", () => {
    expect(screen.getByText("Carlos")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("debería permitir filtrar usuarios por rol", () => {
    const select = screen.getByLabelText("Filtrar por Rol:");
    fireEvent.change(select, { target: { value: "Admin" } });
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.queryByText("María")).not.toBeInTheDocument();
  });

  it("debería navegar al crear un nuevo trabajador", () => {
    const btn = screen.getByText("Nuevo Trabajador");
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/nuevo-usuario");
  });

  it("debería eliminar un usuario del listado", () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    const deleteButtons = screen.getAllByRole("button", { name: "" });
    const initialCount = screen.getAllByText(/@test.com/).length;
    fireEvent.click(deleteButtons[1]); // elimina el segundo usuario
    const newCount = screen.getAllByText(/@test.com/).length;
    expect(newCount).toBeLessThan(initialCount);
  });
});
