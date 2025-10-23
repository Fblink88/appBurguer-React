// Importaciones necesarias para las pruebas unitarias
import { render, screen, fireEvent } from "@testing-library/react"; // Permite renderizar componentes y simular eventos
import { describe, it, expect, vi, beforeEach } from "vitest"; // Framework de testing Vitest
import { MemoryRouter } from "react-router-dom"; // Proporciona un router de memoria para simular navegación
import GestionUsuarios from "../src/pages/admin/gestionUsuarios"; // Componente a probar

// MOCK DEL SIDEBAR
// Se crea un mock (falso componente) del Sidebar para evitar dependencias visuales o errores de renderizado
vi.mock("../components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

// MOCK DE LA BASE DE DATOS
// Se simula la data que normalmente vendría del archivo src/data/dataBase.js
// Esto permite controlar qué datos se usarán en las pruebas sin depender del archivo real
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

// 🧩 MOCK DE NAVEGACIÓN
// Se reemplaza el hook useNavigate de React Router con una función simulada (mockNavigate)
// Esto permite verificar si la navegación fue llamada correctamente en las pruebas
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 🧪 BLOQUE PRINCIPAL DE PRUEBAS
describe("Página de Gestión de Usuarios", () => {

  // beforeEach: se ejecuta antes de cada test
  // Limpia el localStorage y renderiza el componente en un entorno aislado
  beforeEach(() => {
    localStorage.clear();
    render(
      <MemoryRouter>
        <GestionUsuarios />
      </MemoryRouter>
    );
  });

  // Prueba 1: Verifica que los títulos principales existan en la interfaz
  it("debería renderizar correctamente los títulos y secciones", () => {
    expect(screen.getByText("Gestión de Usuarios y Clientes")).toBeInTheDocument();
    expect(screen.getByText("Trabajadores")).toBeInTheDocument();
    expect(screen.getByText("Clientes")).toBeInTheDocument();
  });

  // Prueba 2: Comprueba que los usuarios simulados se muestren correctamente
  it("debería mostrar usuarios desde la base de datos", () => {
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("María")).toBeInTheDocument();
  });

  // Prueba 3: Comprueba que los clientes simulados se muestren correctamente
  it("debería mostrar clientes desde la base de datos", () => {
    expect(screen.getByText("Carlos")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  // Prueba 4: Filtrado por rol
  // Simula cambiar el valor del selector "Filtrar por Rol" para mostrar solo usuarios de rol "Admin"
  it("debería permitir filtrar usuarios por rol", () => {
    const select = screen.getByLabelText("Filtrar por Rol:");
    fireEvent.change(select, { target: { value: "Admin" } });
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.queryByText("María")).not.toBeInTheDocument();
  });

  // Prueba 5: Navegación al crear un nuevo trabajador
  // Simula hacer clic en el botón y verifica que la función navigate se haya ejecutado con la ruta esperada
  it("debería navegar al crear un nuevo trabajador", () => {
    const btn = screen.getByText("Nuevo Trabajador");
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/nuevo-usuario");
  });

  // Prueba 6: Eliminación de usuario
  // Simula la confirmación y el clic en el botón de eliminar, comprobando que la lista de usuarios se reduzca
  it("debería eliminar un usuario del listado", () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true); // Simula confirmación positiva del usuario
    const deleteButtons = screen.getAllByRole("button", { name: "" }); // Obtiene los botones sin texto (probablemente íconos)
    const initialCount = screen.getAllByText(/@test.com/).length; // Cuenta inicial de usuarios
    fireEvent.click(deleteButtons[1]); // Elimina el segundo usuario (María)
    const newCount = screen.getAllByText(/@test.com/).length; // Nuevo conteo después de eliminar
    expect(newCount).toBeLessThan(initialCount);
  });
});
