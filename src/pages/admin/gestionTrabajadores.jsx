
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';

// Mock data de trabajadores
const mockTrabajadores = [
  { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', email: 'juan@ejemplo.com', rol: 1 },
  { id: 2, nombre: 'Ana Torres', rut: '15.678.234-5', email: 'ana@ejemplo.com', rol: 2 },
  { id: 3, nombre: 'Carlos Ramírez', rut: '18.234.567-0', email: 'carlos@ejemplo.com', rol: 2 },
];

export default function GestionTrabajadores() {
  // --- Estados del componente ---
  const [trabajadores, setTrabajadores] = useState(mockTrabajadores);
  const [trabajadorEditando, setTrabajadorEditando] = useState(null);
  const [showModalTrabajador, setShowModalTrabajador] = useState(false);
  const [formTrabajador, setFormTrabajador] = useState({
    nombre: '',
    rut: '',
    email: '',
    rol: 2
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // --- Abrir modal para crear/editar trabajador ---
  const handleAbrirModalTrabajador = (trabajador = null) => {
    if (trabajador) {
      setTrabajadorEditando(trabajador);
      setFormTrabajador({
        nombre: trabajador.nombre,
        rut: trabajador.rut,
        email: trabajador.email,
        rol: trabajador.rol
      });
    } else {
      setTrabajadorEditando(null);
      setFormTrabajador({
        nombre: '',
        rut: '',
        email: '',
        rol: 2
      });
    }
    setShowModalTrabajador(true);
  };

  // --- Cerrar modal ---
  const handleCerrarModalTrabajador = () => {
    setShowModalTrabajador(false);
    setTrabajadorEditando(null);
    setFormTrabajador({
      nombre: '',
      rut: '',
      email: '',
      rol: 2
    });
  };

  // --- Manejar cambios en formulario ---
  const handleChangeTrabajador = (e) => {
    const { name, value } = e.target;
    setFormTrabajador(prev => ({
      ...prev,
      [name]: name === 'rol' ? parseInt(value) : value
    }));
  };

  // --- Guardar trabajador (crear o actualizar) ---
  const handleGuardarTrabajador = async (e) => {
    e.preventDefault();
    try {
      if (!formTrabajador.nombre.trim() || !formTrabajador.rut.trim() || !formTrabajador.email.trim()) {
        setMensaje({ tipo: 'warning', texto: 'Completa todos los campos obligatorios' });
        return;
      }
      if (!formTrabajador.email.includes('@')) {
        setMensaje({ tipo: 'warning', texto: 'Email inválido' });
        return;
      }
      setGuardando(true);
      setMensaje({ tipo: '', texto: '' });
      if (trabajadorEditando) {
        setTimeout(() => {
          setTrabajadores(prev => prev.map(t =>
            t.id === trabajadorEditando.id ? { ...t, ...formTrabajador } : t
          ));
          handleCerrarModalTrabajador();
          setMensaje({ tipo: 'success', texto: '✓ Trabajador actualizado exitosamente' });
          setGuardando(false);
        }, 800);
      } else {
        setTimeout(() => {
          const nuevoTrabajador = {
            id: Math.max(...trabajadores.map(t => t.id), 0) + 1,
            ...formTrabajador
          };
          setTrabajadores(prev => [...prev, nuevoTrabajador]);
          handleCerrarModalTrabajador();
          setMensaje({ tipo: 'success', texto: '✓ Trabajador creado exitosamente' });
          setGuardando(false);
        }, 800);
      }
    } catch {
      setMensaje({ tipo: 'danger', texto: 'Error al guardar el trabajador.' });
      setGuardando(false);
    }
  };

  // --- Eliminar trabajador ---
  const handleEliminarTrabajador = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este trabajador?')) {
      setTrabajadores(prev => prev.filter(t => t.id !== id));
      setMensaje({ tipo: 'success', texto: '✓ Trabajador eliminado exitosamente' });
    }
  };

  // --- Renderizado ---
  return (
    <div className="admin-layout">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => console.log("Cerrando sesión")} />
      <main className="admin-content">
        <h1 className="mb-4">Gestión de Trabajadores</h1>
        {mensaje.texto && (
          <Alert 
            variant={mensaje.tipo} 
            dismissible 
            onClose={() => setMensaje({ tipo: '', texto: '' })}
            className="mb-4"
          >
            {mensaje.texto}
          </Alert>
        )}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Trabajadores</h2>
            <button
              className="btn btn-warning fw-semibold"
              onClick={() => handleAbrirModalTrabajador()}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Nuevo Trabajador
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>RUT</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trabajadores.length > 0 ? (
                  trabajadores.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.nombre}</td>
                      <td>{t.rut}</td>
                      <td>{t.email}</td>
                      <td>{t.rol === 1 ? 'Admin' : 'Trabajador'}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => handleAbrirModalTrabajador(t)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminarTrabajador(t.id)}
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

        {/* MODAL PARA TRABAJADOR */}
        <Modal show={showModalTrabajador} onHide={handleCerrarModalTrabajador} size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>
              {trabajadorEditando ? 'Editar Trabajador' : 'Nuevo Trabajador'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGuardarTrabajador}>
            <Modal.Body className="bg-dark text-white">
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formTrabajador.nombre}
                  onChange={handleChangeTrabajador}
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>RUT *</Form.Label>
                <Form.Control
                  type="text"
                  name="rut"
                  value={formTrabajador.rut}
                  onChange={handleChangeTrabajador}
                  required
                  placeholder="Ej: 12.345.678-9"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formTrabajador.email}
                  onChange={handleChangeTrabajador}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rol *</Form.Label>
                <Form.Select
                  name="rol"
                  value={formTrabajador.rol}
                  onChange={handleChangeTrabajador}
                  required
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Trabajador</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  El rol determina los permisos y endpoints disponibles
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
              <Button 
                variant="secondary" 
                onClick={handleCerrarModalTrabajador}
                disabled={guardando}
              >
                Cancelar
              </Button>
              <Button 
                variant="warning" 
                type="submit"
                disabled={guardando}
                className="text-dark fw-semibold"
              >
                {guardando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {trabajadorEditando ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </main>
    </div>
  );
}
