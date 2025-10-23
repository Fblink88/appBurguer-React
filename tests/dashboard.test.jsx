// Importaciones necesarias para ejecutar las pruebas



import { describe, it, expect, afterEach, } from "vitest";



import { render, screen, cleanup } from "@testing-library/react"; // renderiza el componente y permite hacer consultas sobre el DOM
import { MemoryRouter } from "react-router-dom"; // simula un entorno de enrutamiento
import Dashboard from "../src/pages/admin/dashboard"; // componente principal del panel de administración que se probará

/* CONJUNTO DE PRUEBAS PARA EL DASHBOARD ADMINISTRADOR */

describe("Dashboard Admin", () => {
  // Limpieza después de cada prueba
  // La función cleanup desmonta el componente del DOM para evitar conflictos entre pruebas
  afterEach(() => cleanup());

  // Prueba 1: Renderizado del título principal
  // Verifica que el encabezado <h1> con el texto esperado esté presente en el DOM
  it("debería renderizar el título principal correctamente", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Busca el encabezado principal por su nivel y texto
    expect(
      screen.getByRole("heading", { level: 1, name: "Bienvenido, Administrador" })
    ).toBeInTheDocument();
  });

  // Prueba 2: Visualización de las tarjetas de indicadores (KPIs)
  // Comprueba que los títulos de las tarjetas principales estén visibles
  it("debería mostrar las tarjetas de KPIs con sus títulos", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Lista de los indicadores clave que deben renderizarse en el Dashboard
    const titulos = [
      "Ventas Totales",
      "Usuarios Registrados",
      "Nuevos Clientes",
      "Tickets Soporte",
    ];

    // Recorre cada título y verifica que esté presente en el DOM
    titulos.forEach((titulo) => {
      expect(screen.getByText(titulo)).toBeInTheDocument();
    });
  });

  // Prueba 3: Renderizado de gráficos principales
  // Asegura que los gráficos del Dashboard existan en el DOM
  it("debería renderizar los tres gráficos principales", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Busca los elementos mediante su atributo data-testid
    expect(screen.getByTestId("chart-ventas")).toBeInTheDocument(); // gráfico de ventas totales
    expect(screen.getByTestId("chart-progreso")).toBeInTheDocument(); // gráfico de progreso
    expect(screen.getByTestId("chart-categorias")).toBeInTheDocument(); // gráfico de categorías de productos
  });

  // Prueba 4: Verificación del Sidebar en el layout
  // Se comprueba que el panel lateral (aside) esté presente, lo que indica que el layout general es correcto
  it("debería incluir el Sidebar en el layout", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Busca el elemento con rol 'complementary' (usado por <aside>)
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  // Prueba 5: Creación y desmontaje correcto de los gráficos
  // Se asegura que los gráficos se crean y eliminan sin generar errores
  it("debería crear y limpiar correctamente los gráficos (sin errores)", () => {
    // Renderiza el Dashboard y obtiene la función unmount (para desmontar el componente)
    const { unmount } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Verifica que los gráficos existen inicialmente
    expect(screen.getByTestId("chart-ventas")).toBeInTheDocument();
    expect(screen.getByTestId("chart-progreso")).toBeInTheDocument();
    expect(screen.getByTestId("chart-categorias")).toBeInTheDocument();

    // Desmonta el componente simulando el cierre de la vista
    // La prueba pasa si no lanza errores al desmontar
    expect(() => unmount()).not.toThrow();
  });
});
