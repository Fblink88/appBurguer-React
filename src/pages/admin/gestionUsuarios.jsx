import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { usuariosStore } from "../../data/dataBase";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  // Al montar, carga usuarios
  useEffect(() => {
    setUsuarios(usuariosStore.read());

    // Permitir sincronizar si se modifica en otra pestaña
    const handleStorage = (e) => {
      if (e.key === usuariosStore.key) {
        setUsuarios(usuariosStore.read());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const eliminarUsuario = (index) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;
    usuariosStore.remove(index);
    setUsuarios(usuariosStore.read());
  };

  const editarUsuario = (index) => {
    navigate(`/admin/usuarios/nuevo?edit=${index}`);
  };

  return (
    <div className="d-flex">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => alert("Cerrando sesión")} />

      <main className="flex-fill p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-0">Gestión de Usuarios</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/usuarios/nuevo")}
          >
            + Nuevo Usuario
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>RUN</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{u.run}</td>
                      <td>{u.nombre} {u.apellidos}</td>
                      <td>{u.email}</td>
                      <td>{u.rol}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => editarUsuario(i)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarUsuario(i)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
