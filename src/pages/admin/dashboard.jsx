import React, { useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function Dashboard() {
  const ventasRef = useRef(null);
  const progresoRef = useRef(null);
  const categoriasRef = useRef(null);

  useEffect(() => {
    Chart.register(ChartDataLabels);

    // === Gráfico de barras - Ventas por mes ===
    const ventasChart = new Chart(ventasRef.current, {
      type: "bar",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            label: "Ventas ($)",
            data: [12000, 15000, 18000, 10000, 22000, 25000],
            backgroundColor: "#f39c12",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#fff", font: { weight: "bold" } },
          },
          datalabels: {
            color: "#fff",
            anchor: "end",
            align: "top",
          },
          title: {
            display: true,
            text: "Ventas por Mes",
            color: "#fff",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          x: {
            ticks: { color: "#fff" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
          y: {
            ticks: { color: "#fff" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
        },
      },
    });

    // === Gráfico doughnut - Progreso de objetivos ===
    const progresoChart = new Chart(progresoRef.current, {
      type: "doughnut",
      data: {
        labels: ["Completado", "Pendiente"],
        datasets: [
          {
            data: [75, 25],
            backgroundColor: ["#27ae60", "#c0392b"],
            borderColor: "#fff",
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: "#fff" } },
          datalabels: {
            color: "#fff",
            formatter: (value) => value + "%",
          },
          title: {
            display: true,
            text: "Progreso de Objetivos",
            color: "#fff",
            font: { size: 16, weight: "bold" },
          },
        },
      },
    });

    // === Gráfico pie - Ventas por categoría ===
    const categoriasChart = new Chart(categoriasRef.current, {
      type: "pie",
      data: {
        labels: ["Hamburguesas", "Acompañamientos", "Bebestibles"],
        datasets: [
          {
            data: [40, 35, 25],
            backgroundColor: ["#2980b9", "#f1c40f", "#8e44ad"],
            borderColor: "#fff",
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: "#fff" } },
          datalabels: {
            color: "#fff",
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              return ((value / total) * 100).toFixed(1) + "%";
            },
          },
          title: {
            display: true,
            text: "Ventas por Categoría",
            color: "#fff",
            font: { size: 16, weight: "bold" },
          },
        },
      },
    });

    return () => {
      ventasChart.destroy();
      progresoChart.destroy();
      categoriasChart.destroy();
    };
  }, []);

  return (
    <div className="d-flex dashboard-container">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => alert("Cerrando sesión")} />
      <main className="flex-fill p-4">
        <h1 className="mb-4 fw-bold">Bienvenido, Administrador</h1>

        {/* Tarjetas de KPIs */}
        <div className="row g-3 mb-4">
          {[
            { title: "Ventas Totales", value: "$120,500" },
            { title: "Usuarios Registrados", value: "1,245" },
            { title: "Nuevos Clientes", value: "58" },
            { title: "Tickets Soporte", value: "14" },
          ].map((card, i) => (
            <div className="col-md-3" key={i}>
              <div className="card text-center p-3 shadow-sm">
                <h6>{card.title}</h6>
                <p>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="chart-card">
              <h5>Ventas por Mes</h5>
              <canvas ref={ventasRef} id="ventasMes" data-testid="chart-ventas"></canvas>
            </div>
          </div>
          <div className="col-md-3">
            <div className="chart-card">
              <h5>Progreso Objetivos</h5>
              <canvas ref={progresoRef} id="progreso" data-testid="chart-progreso"></canvas>
            </div>
          </div>
          <div className="col-md-3">
            <div className="chart-card">
              <h5>Ventas por Categoría</h5>
              <canvas ref={categoriasRef} id="categorias" data-testid="chart-categorias"></canvas>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}