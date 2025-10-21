import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

// --- Funciones locales para clientes ---
const readClientes = () => JSON.parse(localStorage.getItem("clientes")) || [];

const createCliente = (cliente) => {
  const clientes = readClientes();
  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));
};

const updateCliente = (index, cliente) => {
  const clientes = readClientes();
  clientes[index] = cliente;
  localStorage.setItem("clientes", JSON.stringify(clientes));
};

export default function NuevoCliente() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIndex = searchParams.get("edit");

  const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
  });

  const [errores, setErrores] = useState({ nombre: "", correo: "" });

  // Si hay edición, precargar datos
  useEffect(() => {
    if (editIndex !== null) {
      const clientes = readClientes();
      if (clientes[editIndex]) setCliente(clientes[editIndex]);
    }
  }, [editIndex]);

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
    setErrores({ ...errores, [name]: "" }); // limpiar error al escribir
  };

  // Validar y guardar cliente
  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = { nombre: "", correo: "" };
    let valido = true;

    if (!cliente.nombre.trim()) {
      nuevosErrores.nombre = "Debe ingresar un nombre";
      valido = false;
    }
    if (!cliente.correo.trim()) {
      nuevosErrores.correo = "Debe ingresar un correo";
      valido = false;
    }

    setErrores(nuevosErrores);

    if (!valido) return;

    if (editIndex !== null) {
      updateCliente(editIndex, cliente);
      alert("Cliente actualizado correctamente.");
    } else {
      createCliente(cliente);
      alert("Cliente creado correctamente.");
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
          {editIndex !== null ? "Editar Cliente" : "Nuevo Cliente"}
        </h1>

        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={cliente.nombre}
              onChange={handleChange}
            />
            {errores.nombre && (
              <p className="text-danger mt-1" role="alert">
                {errores.nombre}
              </p>
            )}
          </div>

          {/* Correo */}
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="form-control"
              value={cliente.correo}
              onChange={handleChange}
            />
            {errores.correo && (
              <p className="text-danger mt-1" role="alert">
                {errores.correo}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-success">
            {editIndex !== null ? "Guardar Cambios" : "Crear Cliente"}
          </button>
        </form>
      </main>
    </div>
  );
}
