import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { usuariosStore } from "../../data/dataBase";

export default function NuevoUsuario() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIndex = searchParams.get("edit"); // ?edit=IDX si es edición

  // Estado inicial del usuario
  const [usuario, setUsuario] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    email: "",
    rol: ""
  });

  // Si hay parámetro edit, precargar datos
  useEffect(() => {
    if (editIndex !== null) {
      const usuarios = usuariosStore.read();
      if (usuarios[editIndex]) {
        setUsuario(usuarios[editIndex]);
      }
    }
  }, [editIndex]);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  // Guardar usuario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      usuariosStore.update(editIndex, usuario);
    } else {
      usuariosStore.create(usuario);
    }

    navigate("/admin/gestion-usuarios");
  };

  return (
    <div className="admin-layout">
      <Sidebar
        adminName="Administrador"
        onLogoutAdmin={() => alert("Cerrando sesión")}
      />

      <main className="admin-content">
        <h1 className="mb-4">
          {editIndex !== null ? "Editar Usuario" : "Nuevo Usuario"}
        </h1>

        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">RUN</label>
            <input
              type="text"
              name="run"
              className="form-control"
              value={usuario.run}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={usuario.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              className="form-control"
              value={usuario.apellidos}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={usuario.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              name="rol"
              className="form-select"
              value={usuario.rol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="Admin">Admin</option>
              <option value="Cajero">Cajero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Despacho">Despacho</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            {editIndex !== null ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </form>
      </main>
    </div>
  );
}
