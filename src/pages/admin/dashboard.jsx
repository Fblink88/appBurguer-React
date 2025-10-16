<<<<<<< HEAD
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

    // Gráfico de barras - Ventas por mes
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
        plugins: {
          datalabels: {
            color: "#000",
            anchor: "end",
            align: "top",
          },
        },
      },
    });

    // Gráfico doughnut - Progreso objetivos
    const progresoChart = new Chart(progresoRef.current, {
      type: "doughnut",
      data: {
        labels: ["Completado", "Pendiente"],
        datasets: [
          {
            data: [75, 25],
            backgroundColor: ["#27ae60", "#c0392b"],
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            color: "#fff",
            formatter: (value) => value + "%",
          },
        },
      },
    });

    // Gráfico pie - Ventas por categoría
    const categoriasChart = new Chart(categoriasRef.current, {
      type: "pie",
      data: {
        labels: ["Hamburguesas", "Acompañamientos", "Bebestibles"],
        datasets: [
          {
            data: [40, 35, 25],
            backgroundColor: ["#2980b9", "#f1c40f", "#8e44ad"],
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            color: "#fff",
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              return ((value / total) * 100).toFixed(1) + "%";
            },
          },
        },
      },
    });

    // limpiar al desmontar
    return () => {
      ventasChart.destroy();
      progresoChart.destroy();
      categoriasChart.destroy();
    };
  }, []);

  return (
    <div className="d-flex">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => alert("Cerrando sesión")} />
      <main className="flex-fill p-4">
        <h1 className="mb-4">Bienvenido, Administrador</h1>

        {/* Tarjetas de KPIs */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h6>Ventas Totales</h6>
              <p className="fs-5 fw-bold">$120,500</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h6>Usuarios Registrados</h6>
              <p className="fs-5 fw-bold">1,245</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h6>Nuevos Clientes</h6>
              <p className="fs-5 fw-bold">58</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h6>Tickets Soporte</h6>
              <p className="fs-5 fw-bold">14</p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Ventas por Mes</h5>
              <canvas ref={ventasRef}></canvas>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Progreso Objetivos</h5>
              <canvas ref={progresoRef}></canvas>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Ventas por Categoría</h5>
              <canvas ref={categoriasRef}></canvas>
            </div>
          </div>
=======
import React from 'react';
import Sidebar from '../../components/Sidebar';


function Dashboard() {
  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };

  return (
    
    <div className="admin-layout"> 
      <Sidebar onLogoutAdmin={handleAdminLogout} />

      <main className="admin-content">
        <div className="container py-5 text-center">
          <h1>Página Dashboard</h1>
          <p>¡Bienvenido al Admin de Golden Burger!</p>
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
        </div>
      </main>
    </div>
  );
}
<<<<<<< HEAD
=======

export default Dashboard;
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
