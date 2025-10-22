import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NuevoUsuario from "../src/pages/admin/nuevoUsuario";

// --- Mock del Sidebar ---
vi.mock("../components/Sidebar", () => ({
  default: () => <div>Sidebar mock</div>,
}));

// --- Mock de useNavigate y useSearchParams (por defecto sin edición) ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams("")],
  };
});

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("NuevoUsuario.jsx con validaciones y edición", () => {
  it("debería renderizar todos los campos del formulario", () => {
    render(
      <BrowserRouter>
        <NuevoUsuario />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/RUN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rol/i)).toBeInTheDocument();
  });

  it("debería mostrar mensajes de error en rojo cuando se intenta enviar vacío", () => {
    render(
      <BrowserRouter>
        <NuevoUsuario />
      </BrowserRouter>
    );

    const boton = screen.getByRole("button", { name: /crear usuario|guardar cambios/i });
    fireEvent.click(boton);

    expect(screen.getByText("Debe ingresar un RUN.")).toBeInTheDocument();
    expect(screen.getByText("Debe ingresar un nombre.")).toBeInTheDocument();
    expect(screen.getByText("Debe ingresar los apellidos.")).toBeInTheDocument();
    expect(screen.getByText("Debe ingresar un correo.")).toBeInTheDocument();
    expect(screen.getByText("Debe seleccionar un rol.")).toBeInTheDocument();
  });

  it("debería guardar correctamente un nuevo usuario si los campos son válidos", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });
    render(
      <BrowserRouter>
        <NuevoUsuario />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/RUN/i), { target: { value: "11111111-1" } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Pedro" } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: "Soto" } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "pedro@test.com" } });
    fireEvent.change(screen.getByLabelText(/Rol/i), { target: { value: "Admin" } });

    fireEvent.click(screen.getByRole("button", { name: /crear usuario/i }));

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"));
    expect(usuariosGuardados).toHaveLength(1);
    expect(usuariosGuardados[0].nombre).toBe("Pedro");

    expect(alertMock).toHaveBeenCalledWith("Usuario creado correctamente.");
    expect(mockNavigate).toHaveBeenCalledWith("/admin/gestion-usuarios");

    alertMock.mockRestore();
  });

  it("debería cargar los datos en modo edición y actualizar correctamente", async () => {
    // Reinicia los módulos para aplicar el nuevo mock antes de la importación
    vi.resetModules();

    // Pre-carga un usuario simulado
    const usuarioOriginal = [
      { run: "22222222-2", nombre: "Ana", apellidos: "López", email: "ana@test.com", rol: "Cajero" },
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuarioOriginal));

    // Define el mock ANTES de importar el componente
    vi.doMock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams("edit=0")],
      };
    });

    // Importa el componente con el mock ya aplicado
    const { default: NuevoUsuarioEdit } = await import("../src/pages/admin/nuevoUsuario");

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

    render(
      <BrowserRouter>
        <NuevoUsuarioEdit />
      </BrowserRouter>
    );

    // Espera a que los valores precargados aparezcan
    expect(await screen.findByDisplayValue("Ana")).toBeInTheDocument();
    expect(screen.getByDisplayValue("López")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ana@test.com")).toBeInTheDocument();

    // Simula edición
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Ana María" } });
    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    // Verifica que se actualizó el localStorage
    const usuariosActualizados = JSON.parse(localStorage.getItem("usuarios"));
    expect(usuariosActualizados[0].nombre).toBe("Ana María");

    // Verifica alert y redirección
    expect(alertMock).toHaveBeenCalledWith("Usuario actualizado correctamente.");
    expect(mockNavigate).toHaveBeenCalledWith("/admin/gestion-usuarios");

    alertMock.mockRestore();
  });

});
