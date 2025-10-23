

import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { usuarios as baseUsuarios, clientes as baseClientes } from "../../data/dataBase";

// --- Funciones de almacenamiento local ---
const readData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error al leer ${key} desde localStorage:`, error);
    return [];
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage:`, error);
  }
};

// --- Función para combinar datos de localStorage y base ---
function mergeAndInitializeData(key, baseData, uniqueIdKey) {
  let storedData = readData(key);
  let needsUpdate = false;

  if (!storedData || storedData.length === 0) {
    storedData = baseData;
    needsUpdate = true;
  } else {
    const storedIds = new Set(storedData.map(item => item[uniqueIdKey]));
    baseData.forEach(baseItem => {
      if (!storedIds.has(baseItem[uniqueIdKey])) {
        storedData.push(baseItem);
        needsUpdate = true;
      }
    });
  }

  if (needsUpdate) {
    saveData(key, storedData);
  }
  
  return storedData;
}


// --- Componente Principal ---
export default function GestionUsuarios() {
  const navigate = useNavigate();

  // --- Estados del componente ---
  const [usuarios, setUsuarios] = useState(() => mergeAndInitializeData("usuarios", baseUsuarios, "run"));
  const [clientes, setClientes] = useState(() => mergeAndInitializeData("clientes", baseClientes, "correo"));
  const [filtroRol, setFiltroRol] = useState("Todos"); // setFiltroRol SÍ se usa en el onChange del select

  // --- Filtro de trabajadores ---
  const usuariosFiltrados =
    filtroRol === "Todos"
      ? usuarios
      : usuarios.filter((u) => u.rol === filtroRol);

  // --- Función para eliminar registros usando ID ÚNICO ---
  const handleEliminar = (key, idAEliminar, uniqueIdKey) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      let data = readData(key);
      const dataActualizada = data.filter(item => item[uniqueIdKey] !== idAEliminar);
      
      if (dataActualizada.length < data.length) {
        saveData(key, dataActualizada);
        key === "usuarios" ? setUsuarios(dataActualizada) : setClientes(dataActualizada);
      } else {
        console.warn(`No se encontró el registro con ${uniqueIdKey}=${idAEliminar} para eliminar.`);
      }
    }
  };

  // --- Navega a la página de edición de usuario usando el RUN ---
  const handleEditarUsuario = (run) => {
    const index = usuarios.findIndex(u => u.run === run);
    if (index !== -1) {
       navigate(`/admin/nuevo-usuario?edit=${index}`);
    } else {
       console.error("No se encontró el usuario para editar con run:", run);
    }
  };

  // --- Navega al formulario para crear un nuevo usuario ---
  // handleNuevoUsuario SÍ se usa en el onClick del botón
  const handleNuevoUsuario = () => {
    navigate("/admin/nuevo-usuario");
  };

  // --- Crea un nuevo cliente ---
  // handleNuevoCliente SÍ se usa en el onClick del botón
  const handleNuevoCliente = () => {
    const nombre = prompt("Ingrese nombre del cliente:");
    const correo = prompt("Ingrese correo del cliente:");
    
    if (!nombre || !correo) return alert("Datos incompletos.");
    
    if (clientes.some(c => c.correo === correo)) {
       return alert("Ya existe un cliente con ese correo.");
    }

    const nuevosClientes = [...clientes, { nombre, correo }];
    saveData("clientes", nuevosClientes);
    setClientes(nuevosClientes);
  };

   // --- Renderizado ---
  return (
    <div className="admin-layout">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => console.log("Cerrando sesión")} />

      <main className="admin-content">
        <h1 className="mb-4">Gestión de Usuarios y Clientes</h1>

        {/* ---------- SECCIÓN 1: TRABAJADORES ---------- */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Trabajadores</h2>
            <button
              className="btn btn-warning fw-semibold"
              onClick={handleNuevoUsuario} // Uso de handleNuevoUsuario
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
              onChange={(e) => setFiltroRol(e.target.value)} // Uso de setFiltroRol
            >
              <option value="Todos">Todos</option>
              <option value="Admin">Admin</option>
              <option value="Cajero">Cajero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Despacho">Despacho</option> {/* Asegúrate que este rol exista en tus datos */}
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
                  usuariosFiltrados.map((u) => ( 
                    <tr key={u.run}> {/* Usar RUN como key */}
                      <td>{u.run}</td>
                      <td>{u.nombre}</td>
                      <td>{u.apellidos}</td>
                      <td>{u.email}</td>
                      <td>{u.rol}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => handleEditarUsuario(u.run)} // Pasar RUN
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar("usuarios", u.run, "run")} // Pasar RUN
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No hay trabajadores registrados {filtroRol !== "Todos" ? `con el rol ${filtroRol}` : ''}
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
              onClick={handleNuevoCliente} // Uso de handleNuevoCliente
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
                  clientes.map((c) => (
                    <tr key={c.correo}> {/* Usar CORREO como key */}
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar("clientes", c.correo, "correo")} // Pasar CORREO
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