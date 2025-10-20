import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

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

export default function NuevoUsuario() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIndex = searchParams.get("edit");

  const [usuario, setUsuario] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    email: "",
    rol: "",
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (editIndex !== null) {
      const usuarios = readUsuarios();
      if (usuarios[editIndex]) setUsuario(usuarios[editIndex]);
    }
  }, [editIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    setErrores({ ...errores, [name]: "" }); // Limpia el error al escribir
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!usuario.run.trim()) nuevosErrores.run = "Debe ingresar un RUN.";
    if (!usuario.nombre.trim()) nuevosErrores.nombre = "Debe ingresar un nombre.";
    if (!usuario.apellidos.trim()) nuevosErrores.apellidos = "Debe ingresar los apellidos.";
    if (!usuario.email.trim()) nuevosErrores.email = "Debe ingresar un correo.";
    if (!usuario.rol.trim()) nuevosErrores.rol = "Debe seleccionar un rol.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    if (editIndex !== null) {
      updateUsuario(editIndex, usuario);
      alert("Usuario actualizado correctamente.");
    } else {
      createUsuario(usuario);
      alert("Usuario creado correctamente.");
    }

    navigate("/admin/gestion-usuarios");
  };

  return (
    <div className="admin-layout">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => alert("Cerrando sesión")} />

      <main className="admin-content">
        <h1 className="mb-4">{editIndex !== null ? "Editar Usuario" : "Nuevo Usuario"}</h1>

        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
          {/* RUN */}
          <div className="mb-3">
            <label htmlFor="run" className="form-label">RUN</label>
            <input
              id="run"
              type="text"
              name="run"
              className="form-control"
              value={usuario.run}
              onChange={handleChange}
            />
            {errores.run && <p className="text-danger">{errores.run}</p>}
          </div>

          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              className="form-control"
              value={usuario.nombre}
              onChange={handleChange}
            />
            {errores.nombre && <p className="text-danger">{errores.nombre}</p>}
          </div>

          {/* Apellidos */}
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">Apellidos</label>
            <input
              id="apellidos"
              type="text"
              name="apellidos"
              className="form-control"
              value={usuario.apellidos}
              onChange={handleChange}
            />
            {errores.apellidos && <p className="text-danger">{errores.apellidos}</p>}
          </div>

          {/* Correo */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              value={usuario.email}
              onChange={handleChange}
            />
            {errores.email && <p className="text-danger">{errores.email}</p>}
          </div>

          {/* Rol */}
          <div className="mb-3">
            <label htmlFor="rol" className="form-label">Rol</label>
            <select
              id="rol"
              name="rol"
              className="form-select"
              value={usuario.rol}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              <option value="Admin">Admin</option>
              <option value="Cajero">Cajero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Despacho">Despacho</option>
            </select>
            {errores.rol && <p className="text-danger">{errores.rol}</p>}
          </div>

          <button type="submit" className="btn btn-success">
            {editIndex !== null ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </form>
      </main>
    </div>
  );
}
