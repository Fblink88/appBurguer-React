import React, { useState } from "react"; 
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import Sidebar from "../../components/Sidebar";

// Mock data de clientes con información completa
const mockClientesCompletos = [
  {
    id: 1,
    nombre: 'Juan Pérez González',
    telefono: '+56912345678',
    email: 'juan.perez@ejemplo.com',
    fechaRegistro: '2024-01-15',
    direcciones: [
      {
        id: 1,
        idCiudad: 1,
        direccion: 'Av. Principal 123, Edificio azul, Depto 405',
        alias: 'Casa'
      },
      {
        id: 2,
        idCiudad: 2,
        direccion: 'Los Aromos 456, Casa blanca con portón verde',
        alias: 'Trabajo'
      }
    ]
  },
  {
    id: 2,
    nombre: 'María López Silva',
    telefono: '+56987654321',
    email: 'maria.lopez@ejemplo.com',
    fechaRegistro: '2024-02-20',
    direcciones: [
      {
        id: 3,
        idCiudad: 3,
        direccion: 'Calle Los Pinos 789, Depto 102',
        alias: 'Casa'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Carlos Ramírez',
    telefono: '+56965432178',
    email: 'carlos.ramirez@ejemplo.com',
    fechaRegistro: '2024-03-10',
    direcciones: []
  },
  {
    id: 4,
    nombre: 'Ana Martínez Torres',
    telefono: '+56923456789',
    email: 'ana.martinez@ejemplo.com',
    fechaRegistro: '2024-01-25',
    direcciones: [
      {
        id: 4,
        idCiudad: 4,
        direccion: 'Av. Libertad 321, Casa esquina',
        alias: 'Casa principal'
      },
      {
        id: 5,
        idCiudad: 5,
        direccion: 'Pasaje Las Rosas 555',
        alias: 'Casa de verano'
      },
      {
        id: 6,
        idCiudad: 1,
        direccion: 'Centro Comercial Plaza, Local 45',
        alias: 'Oficina'
      }
    ]
  }
];

// Mapeo de ciudades
const ciudades = {
  1: 'Viña del Mar',
  2: 'Valparaíso',
  3: 'Curauma',
  4: 'Quilpué',
  5: 'Villa Alemana'
};


// --- Componente Principal ---
export default function GestionClientes() {

  // --- Estados del componente ---
  const [clientes, setClientes] = useState(mockClientesCompletos);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // --- Estados para modal de cliente ---
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [formCliente, setFormCliente] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  // --- Estados para modal de dirección ---
  const [showModalDireccion, setShowModalDireccion] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [formDireccion, setFormDireccion] = useState({
    idCiudad: '',
    direccion: '',
    alias: ''
  });

  // --- FUNCIONES PARA CLIENTE ---
  
  // Abrir modal para crear/editar cliente
  const handleAbrirModalCliente = (cliente = null) => {
    if (cliente) {
      // Modo edición
      setClienteEditando(cliente);
      setFormCliente({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email
      });
    } else {
      // Modo creación
      setClienteEditando(null);
      setFormCliente({
        nombre: '',
        telefono: '',
        email: ''
      });
    }
    setShowModalCliente(true);
  };

  // Cerrar modal de cliente
  const handleCerrarModalCliente = () => {
    setShowModalCliente(false);
    setClienteEditando(null);
    setFormCliente({
      nombre: '',
      telefono: '',
      email: ''
    });
  };

  // Manejar cambios en formulario de cliente
  const handleChangeCliente = (e) => {
    const { name, value } = e.target;
    setFormCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cliente (crear o actualizar)
  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    
    try {
      // Validaciones
      if (!formCliente.nombre.trim() || !formCliente.email.trim()) {
        setMensaje({ 
          tipo: 'warning', 
          texto: 'Por favor, completa todos los campos obligatorios' 
        });
        return;
      }

      if (!formCliente.email.includes('@')) {
        setMensaje({ 
          tipo: 'warning', 
          texto: 'Por favor, ingresa un email válido' 
        });
        return;
      }
      
      setGuardando(true);
      setMensaje({ tipo: '', texto: '' });
      
      if (clienteEditando) {
        // ACTUALIZAR cliente existente
        setTimeout(() => {
          setClientes(prev => prev.map(c => 
            c.id === clienteEditando.id 
              ? { ...c, ...formCliente }
              : c
          ));
          
          // Si el cliente editado está seleccionado, actualizar la selección
          if (clienteSeleccionado && clienteSeleccionado.id === clienteEditando.id) {
            setClienteSeleccionado(prev => ({ ...prev, ...formCliente }));
          }
          
          handleCerrarModalCliente();
          setMensaje({ 
            tipo: 'success', 
            texto: '✓ Cliente actualizado exitosamente' 
          });
          setGuardando(false);
        }, 800);
        
      } else {
        // CREAR nuevo cliente
        setTimeout(() => {
          const nuevoCliente = {
            id: Math.max(...clientes.map(c => c.id), 0) + 1,
            ...formCliente,
            fechaRegistro: new Date().toISOString().split('T')[0],
            direcciones: []
          };
          
          setClientes(prev => [...prev, nuevoCliente]);
          
          handleCerrarModalCliente();
          setMensaje({ 
            tipo: 'success', 
            texto: '✓ Cliente creado exitosamente' 
          });
          setGuardando(false);
        }, 800);
      }
      
    } catch (error) {
      console.error('Error guardando cliente:', error);
      setMensaje({ 
        tipo: 'danger', 
        texto: 'Error al guardar el cliente. Por favor, intenta nuevamente.' 
      });
      setGuardando(false);
    }
  };

  // --- Función para eliminar clientes ---
  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      const clientesActualizados = clientes.filter(c => c.id !== id);
      setClientes(clientesActualizados);
      
      // Si el cliente eliminado estaba seleccionado, limpiar selección
      if (clienteSeleccionado && clienteSeleccionado.id === id) {
        setClienteSeleccionado(null);
      }

      setMensaje({ 
        tipo: 'success', 
        texto: '✓ Cliente eliminado exitosamente' 
      });
    }
  };

  // --- FUNCIONES PARA DIRECCIÓN ---

  // Abrir modal para crear/editar dirección
  const handleAbrirModalDireccion = (direccion = null) => {
    if (!clienteSeleccionado) {
      setMensaje({ 
        tipo: 'warning', 
        texto: 'Por favor, selecciona un cliente primero' 
      });
      return;
    }

    if (direccion) {
      // Modo edición
      setDireccionEditando(direccion);
      setFormDireccion({
        idCiudad: direccion.idCiudad,
        direccion: direccion.direccion,
        alias: direccion.alias || ''
      });
    } else {
      // Modo creación
      setDireccionEditando(null);
      setFormDireccion({
        idCiudad: '',
        direccion: '',
        alias: ''
      });
    }
    setShowModalDireccion(true);
  };

  // Cerrar modal de dirección
  const handleCerrarModalDireccion = () => {
    setShowModalDireccion(false);
    setDireccionEditando(null);
    setFormDireccion({
      idCiudad: '',
      direccion: '',
      alias: ''
    });
  };

  // Manejar cambios en formulario de dirección
  const handleChangeDireccion = (e) => {
    const { name, value } = e.target;
    setFormDireccion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar dirección (crear o actualizar)
  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    
    try {
      // Validaciones
      if (!formDireccion.direccion.trim() || !formDireccion.idCiudad) {
        setMensaje({ 
          tipo: 'warning', 
          texto: 'Por favor, completa todos los campos obligatorios de la dirección' 
        });
        return;
      }
      
      setGuardando(true);
      setMensaje({ tipo: '', texto: '' });
      
      if (direccionEditando) {
        // ACTUALIZAR dirección existente
        setTimeout(() => {
          setClientes(prev => prev.map(c => {
            if (c.id === clienteSeleccionado.id) {
              const direccionesActualizadas = c.direcciones.map(dir =>
                dir.id === direccionEditando.id
                  ? { ...dir, ...formDireccion, idCiudad: parseInt(formDireccion.idCiudad) }
                  : dir
              );
              return { ...c, direcciones: direccionesActualizadas };
            }
            return c;
          }));

          // Actualizar cliente seleccionado
          setClienteSeleccionado(prev => ({
            ...prev,
            direcciones: prev.direcciones.map(dir =>
              dir.id === direccionEditando.id
                ? { ...dir, ...formDireccion, idCiudad: parseInt(formDireccion.idCiudad) }
                : dir
            )
          }));
          
          handleCerrarModalDireccion();
          setMensaje({ 
            tipo: 'success', 
            texto: '✓ Dirección actualizada exitosamente' 
          });
          setGuardando(false);
        }, 800);
        
      } else {
        // CREAR nueva dirección
        setTimeout(() => {
          const todasDirecciones = clientes.flatMap(c => c.direcciones);
          const maxId = Math.max(...todasDirecciones.map(d => d.id), 0);
          
          const nuevaDireccion = {
            id: maxId + 1,
            ...formDireccion,
            idCiudad: parseInt(formDireccion.idCiudad)
          };
          
          setClientes(prev => prev.map(c => {
            if (c.id === clienteSeleccionado.id) {
              return { ...c, direcciones: [...c.direcciones, nuevaDireccion] };
            }
            return c;
          }));

          // Actualizar cliente seleccionado
          setClienteSeleccionado(prev => ({
            ...prev,
            direcciones: [...prev.direcciones, nuevaDireccion]
          }));
          
          handleCerrarModalDireccion();
          setMensaje({ 
            tipo: 'success', 
            texto: '✓ Dirección agregada exitosamente' 
          });
          setGuardando(false);
        }, 800);
      }
      
    } catch (error) {
      console.error('Error guardando dirección:', error);
      setMensaje({ 
        tipo: 'danger', 
        texto: 'Error al guardar la dirección. Por favor, intenta nuevamente.' 
      });
      setGuardando(false);
    }
  };

  // Eliminar dirección
  const handleEliminarDireccion = (idDireccion) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      return;
    }
    
    setClientes(prev => prev.map(c => {
      if (c.id === clienteSeleccionado.id) {
        return { ...c, direcciones: c.direcciones.filter(dir => dir.id !== idDireccion) };
      }
      return c;
    }));

    // Actualizar cliente seleccionado
    setClienteSeleccionado(prev => ({
      ...prev,
      direcciones: prev.direcciones.filter(dir => dir.id !== idDireccion)
    }));

    setMensaje({ 
      tipo: 'success', 
      texto: '✓ Dirección eliminada exitosamente' 
    });
  };

  // --- Seleccionar cliente para ver sus direcciones ---
  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  // --- Obtener nombre de ciudad ---
  const getNombreCiudad = (idCiudad) => {
    return ciudades[idCiudad] || `Ciudad ID: ${idCiudad}`;
  };

   // --- Renderizado ---
  return (
    <div className="admin-layout">
      <Sidebar adminName="Administrador" onLogoutAdmin={() => console.log("Cerrando sesión")} />

      <main className="admin-content">
        <h1 className="mb-4">Gestión de Clientes</h1>

        {/* Alertas de mensajes */}
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

        {/* ---------- SECCIÓN: CLIENTES ---------- */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Clientes Registrados</h2>
            <button
              className="btn btn-warning fw-semibold"
              onClick={() => handleAbrirModalCliente()}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Nuevo Cliente
            </button>
          </div>

          {/* Tabla de clientes */}
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Fecha Registro</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((c) => (
                    <tr 
                      key={c.id}
                      onClick={() => handleSeleccionarCliente(c)}
                      style={{ cursor: 'pointer' }}
                      className={clienteSeleccionado?.id === c.id ? 'table-active' : ''}
                    >
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td>{c.telefono}</td>
                      <td>{c.email}</td>
                      <td>{new Date(c.fechaRegistro).toLocaleDateString('es-CL')}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirModalCliente(c);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminar(c.id);
                          }}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- SECCIÓN: DIRECCIONES DEL CLIENTE SELECCIONADO ---------- */}
        {clienteSeleccionado && (
          <section>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>
                Direcciones de {clienteSeleccionado.nombre}
                <button 
                  className="btn btn-sm btn-outline-secondary ms-3"
                  onClick={() => setClienteSeleccionado(null)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Limpiar selección
                </button>
              </h2>
              <button
                className="btn btn-warning fw-semibold"
                onClick={() => handleAbrirModalDireccion()}
              >
                <i className="bi bi-plus-circle me-2"></i>Agregar Dirección
              </button>
            </div>

            {/* Tabla de direcciones */}
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Alias</th>
                    <th>Dirección</th>
                    <th>Ciudad</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clienteSeleccionado.direcciones.length > 0 ? (
                    clienteSeleccionado.direcciones.map((dir) => (
                      <tr key={dir.id}>
                        <td>{dir.id}</td>
                        <td>
                          {dir.alias ? (
                            <span className="badge bg-warning text-dark">{dir.alias}</span>
                          ) : (
                            <span className="text-muted">Sin alias</span>
                          )}
                        </td>
                        <td>{dir.direccion}</td>
                        <td>
                          <i className="bi bi-geo-alt-fill me-1 text-warning"></i>
                          {getNombreCiudad(dir.idCiudad)}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => handleAbrirModalDireccion(dir)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminarDireccion(dir.id)}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        Este cliente no tiene direcciones registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------- MODAL PARA CLIENTE ---------- */}
        <Modal show={showModalCliente} onHide={handleCerrarModalCliente} size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>
              {clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGuardarCliente}>
            <Modal.Body className="bg-dark text-white">
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formCliente.nombre}
                  onChange={handleChangeCliente}
                  required
                  placeholder="Ej: Juan Pérez González"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={formCliente.telefono}
                  onChange={handleChangeCliente}
                  placeholder="+56912345678"
                />
                <Form.Text className="text-muted">
                  Formato: +56912345678
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formCliente.email}
                  onChange={handleChangeCliente}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
              <Button 
                variant="secondary" 
                onClick={handleCerrarModalCliente}
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
                    {clienteEditando ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* ---------- MODAL PARA DIRECCIÓN ---------- */}
        <Modal show={showModalDireccion} onHide={handleCerrarModalDireccion} size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>
              {direccionEditando ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGuardarDireccion}>
            <Modal.Body className="bg-dark text-white">
              <Form.Group className="mb-3">
                <Form.Label>Dirección Completa *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="direccion"
                  value={formDireccion.direccion}
                  onChange={handleChangeDireccion}
                  required
                  placeholder="Ej: Av. Libertador Bernardo O'Higgins 1234, Depto 501, Torre A"
                />
                <Form.Text className="text-muted">
                  Incluye calle, número, depto/casa, referencias, etc.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ciudad *</Form.Label>
                <Form.Select
                  name="idCiudad"
                  value={formDireccion.idCiudad}
                  onChange={handleChangeDireccion}
                  required
                >
                  <option value="">Selecciona una ciudad</option>
                  <option value="1">Viña del Mar</option>
                  <option value="2">Valparaíso</option>
                  <option value="3">Curauma</option>
                  <option value="4">Quilpué</option>
                  <option value="5">Villa Alemana</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Selecciona la ciudad donde se encuentra la dirección
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Alias (Opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="alias"
                  value={formDireccion.alias}
                  onChange={handleChangeDireccion}
                  placeholder="Ej: Casa, Trabajo, Oficina"
                  maxLength="50"
                />
                <Form.Text className="text-muted">
                  Un nombre corto para identificar esta dirección
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
              <Button 
                variant="secondary" 
                onClick={handleCerrarModalDireccion}
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
                    {direccionEditando ? 'Actualizar' : 'Guardar'}
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
