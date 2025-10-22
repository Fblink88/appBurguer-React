import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../src/pages/admin/dashboard";

/* TESTS */

describe("Dashboard Admin", () => {
  afterEach(() => cleanup());

  it("debería renderizar el título principal correctamente", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Busca el <h1> principal (evita conflicto con el saludo del Sidebar)
    expect(
      screen.getByRole("heading", { level: 1, name: "Bienvenido, Administrador" })
    ).toBeInTheDocument();
  });

  it("debería mostrar las tarjetas de KPIs con sus títulos", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const titulos = [
      "Ventas Totales",
      "Usuarios Registrados",
      "Nuevos Clientes",
      "Tickets Soporte",
    ];

    titulos.forEach((titulo) => {
      expect(screen.getByText(titulo)).toBeInTheDocument();
    });
  });

  it("debería renderizar los tres gráficos principales", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId("chart-ventas")).toBeInTheDocument();
    expect(screen.getByTestId("chart-progreso")).toBeInTheDocument();
    expect(screen.getByTestId("chart-categorias")).toBeInTheDocument();
  });

  it("debería incluir el Sidebar en el layout", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Busca el <aside> real que se usa como Sidebar
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("debería crear y limpiar correctamente los gráficos (sin errores)", () => {
    const { unmount } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Verifica que los gráficos existen
    expect(screen.getByTestId("chart-ventas")).toBeInTheDocument();
    expect(screen.getByTestId("chart-progreso")).toBeInTheDocument();
    expect(screen.getByTestId("chart-categorias")).toBeInTheDocument();

    // Simula desmontaje sin errores
    expect(() => unmount()).not.toThrow();
  });
});
