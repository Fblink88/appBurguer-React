import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { usuarios as baseUsuarios, clientes as baseClientes } from "../../data/dataBase";

// --- Funciones de almacenamiento local ---
const readData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export default function GestionUsuarios() {
  const navigate = useNavigate();

  // Inicializa datos si no existen
  useEffect(() => {
    if (!localStorage.getItem("usuarios")) {
      localStorage.setItem("usuarios", JSON.stringify(baseUsuarios));
    }
    if (!localStorage.getItem("clientes")) {
      localStorage.setItem("clientes", JSON.stringify(baseClientes));
    }
  }, []);

  // Estados de la página
  const [usuarios, setUsuarios] = useState(readData("usuarios"));
  const [clientes, setClientes] = useState(readData("clientes"));
  const [filtroRol, setFiltroRol] = useState("Todos");

  // Sincroniza datos actualizados
  useEffect(() => {
    setUsuarios(readData("usuarios"));
    setClientes(readData("clientes"));
  }, []);

  // --- Filtrado de trabajadores ---
  const usuariosFiltrados =
    filtroRol === "Todos"
      ? usuarios
      : usuarios.filter((u) => u.rol === filtroRol);

  // --- CRUD básico ---
  const handleEliminar = (key, index) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      const data = readData(key);
      data.splice(index, 1);
      saveData(key, data);
      key === "usuarios" ? setUsuarios(data) : setClientes(data);
    }
  };

  const handleEditarUsuario = (index) => {
    navigate(`/admin/nuevo-usuario?edit=${index}`);
  };

  const handleNuevoUsuario = () => {
    navigate("/admin/nuevo-usuario");
  };

  const handleNuevoCliente = () => {
    const nombre = prompt("Ingrese nombre del cliente:");
    const correo = prompt("Ingrese correo del cliente:");
    if (!nombre || !correo) return alert("Datos incompletos.");
    const nuevosClientes = [...clientes, { nombre, correo }];
    saveData("clientes", nuevosClientes);
    setClientes(nuevosClientes);
  };

  return (
    <div className="admin-layout">
      <Sidebar
        adminName="Administrador"
        onLogoutAdmin={() => alert("Cerrando sesión")}
      />

      <main className="admin-content">
        <h1 className="mb-4">Gestión de Usuarios y Clientes</h1>

        {/* ---------- SECCIÓN 1: TRABAJADORES ---------- */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Trabajadores</h2>
            <button
              className="btn btn-warning fw-semibold"
              onClick={handleNuevoUsuario}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Nuevo Trabajador
            </button>
          </div>

          {/* Filtro de roles */}
          <div className="mb-3">
            <label htmlFor="filtroRol" className="form-label me-2 mb-0">
              Filtrar por Rol:
            </label>
            <select
              id="filtroRol"
              className="form-select d-inline-block w-auto"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Admin">Admin</option>
              <option value="Cajero">Cajero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Despacho">Despacho</option>
            </select>
          </div>

          {/* Tabla de trabajadores */}
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>RUN</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u, index) => (
                    <tr key={index}>
                      <td>{u.run}</td>
                      <td>{u.nombre}</td>
                      <td>{u.apellidos}</td>
                      <td>{u.email}</td>
                      <td>{u.rol}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => handleEditarUsuario(index)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar("usuarios", index)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No hay trabajadores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- SECCIÓN 2: CLIENTES ---------- */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Clientes</h2>
            <button
              className="btn btn-success fw-semibold"
              onClick={handleNuevoCliente}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Nuevo Cliente
            </button>
          </div>

          {/* Tabla de clientes */}
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((c, index) => (
                    <tr key={index}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar("clientes", index)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
