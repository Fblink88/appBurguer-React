import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NuevoCliente from "../src/pages/admin/nuevoCliente";

vi.mock("../components/Sidebar", () => ({
  default: () => <div>Sidebar mock</div>,
}));

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

describe("NuevoCliente.jsx con validaciones visuales", () => {
  it("debería renderizar campos de nombre y correo", () => {
    render(
      <BrowserRouter>
        <NuevoCliente />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
  });

  it("debería mostrar mensajes de error en rojo si se intenta enviar vacío", () => {
    render(
      <BrowserRouter>
        <NuevoCliente />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /crear cliente/i }));

    expect(screen.getByText(/debe ingresar un nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/debe ingresar un correo/i)).toBeInTheDocument();
  });

  it("debería crear un nuevo cliente si los campos son válidos", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <BrowserRouter>
        <NuevoCliente />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Pedro Soto" },
    });
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "pedro@test.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear cliente/i }));

    const clientes = JSON.parse(localStorage.getItem("clientes"));
    expect(clientes).toHaveLength(1);
    expect(clientes[0].nombre).toBe("Pedro Soto");
    expect(alertMock).toHaveBeenCalledWith("Cliente creado correctamente.");
    expect(mockNavigate).toHaveBeenCalledWith("/admin/gestion-usuarios");

    alertMock.mockRestore();
  });

  it("debería cargar datos en modo edición y actualizarlos correctamente", async () => {
    vi.resetModules();
    const clienteOriginal = [
      { nombre: "Ana López", correo: "ana@test.com" },
    ];
    localStorage.setItem("clientes", JSON.stringify(clienteOriginal));

    vi.doMock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams("edit=0")],
      };
    });

    const { default: NuevoClienteEdit } = await import("../src/pages/admin/nuevoCliente");
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <NuevoClienteEdit />
      </BrowserRouter>
    );

    expect(await screen.findByDisplayValue("Ana López")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ana@test.com")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Ana María López" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    const clientesActualizados = JSON.parse(localStorage.getItem("clientes"));
    expect(clientesActualizados[0].nombre).toBe("Ana María López");
    expect(alertMock).toHaveBeenCalledWith("Cliente actualizado correctamente.");
    expect(mockNavigate).toHaveBeenCalledWith("/admin/gestion-usuarios");

    alertMock.mockRestore();
  });
});
