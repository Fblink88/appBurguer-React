import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

// --- Funciones locales para manejar localStorage ---
const readUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];

const createUsuario = (usuario) => {
  const usuarios = readUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

const updateUsuario = (index, usuario) => {
  const usuarios = readUsuarios();
  usuarios[index] = usuario;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

const deleteUsuario = (index) => {
  const usuarios = readUsuarios();
  usuarios.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState(readUsuarios());
  const [filtroRol, setFiltroRol] = useState("Todos");

  useEffect(() => {
    setUsuarios(readUsuarios());
  }, []);

  // --- Filtrar por rol ---
  const usuariosFiltrados =
    filtroRol === "Todos"
      ? usuarios
      : usuarios.filter((u) => u.rol === filtroRol);

  // --- Eliminar usuario ---
  const handleEliminar = (index) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      deleteUsuario(index);
      setUsuarios(readUsuarios());
    }
  };

  // --- Editar usuario ---
  const handleEditar = (index) => {
    navigate(`/admin/nuevo-usuario?edit=${index}`);
  };

  // --- Crear nuevo usuario ---
  const handleNuevo = () => {
    navigate("/admin/nuevo-usuario");
  };

  return (
    <div className="admin-layout">
      <Sidebar
        adminName="Administrador"
        onLogoutAdmin={() => alert("Cerrando sesión")}
      />

      <main className="admin-content">
        <h1 className="mb-4">Gestión de Usuarios</h1>

        {/* Botón + Filtro */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-warning fw-semibold" onClick={handleNuevo}>
            <i className="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
          </button>

          <div>
            <label className="form-label me-2 mb-0">Filtrar por Rol:</label>
            <select
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
        </div>

        {/* Tabla de usuarios */}
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
                        onClick={() => handleEditar(index)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminar(index)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
