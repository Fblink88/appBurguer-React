import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import './MiPerfilPag.css';

export default function MiPerfilPag() {
  const navigate = useNavigate();
  
  // Estado para los datos del cliente
  const [cliente, setCliente] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Estados para formularios
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  // Estados para modal de dirección
  const [showModalDireccion, setShowModalDireccion] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [formDireccion, setFormDireccion] = useState({
    idCiudad: '',
    direccion: '',
    alias: ''
  });

  // Mapeo de ciudades
  const ciudades = {
    1: 'Viña del Mar',
    2: 'Valparaíso',
    3: 'Curauma',
    4: 'Quilpué',
    5: 'Villa Alemana'
  };

  // Función helper para obtener nombre de ciudad
  const getNombreCiudad = (idCiudad) => {
    return ciudades[idCiudad] || `Ciudad ID: ${idCiudad}`;
  };

  // Verificar si el usuario está logueado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    cargarDatosCliente();
  }, [navigate]);

  // Función para cargar datos del cliente desde la API
  const cargarDatosCliente = async () => {
    try {
      setLoading(true);
      
      // TODO: Reemplazar con llamada real a la API
      // const idUsuario = localStorage.getItem('userId'); // Firebase UID
      // const response = await fetch(`http://localhost:8080/api/clientes/usuario/${idUsuario}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
      //   }
      // });
      // const data = await response.json();
      
      // MOCK DATA - Remover cuando conectes con el backend
      const mockCliente = {
        id: 1,
        nombre: localStorage.getItem('userName') || 'Cliente Demo',
        telefono: '+56912345678',
        email: 'cliente@ejemplo.com',
        fechaRegistro: '2024-01-15'
      };
      
      const mockDirecciones = [
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
      ];
      
      setCliente(mockCliente);
      setDirecciones(mockDirecciones);
      setDatosFormulario({
        nombre: mockCliente.nombre,
        telefono: mockCliente.telefono,
        email: mockCliente.email
      });
      
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
      setMensaje({ 
        tipo: 'danger', 
        texto: 'Error al cargar los datos del perfil. Por favor, intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario de perfil
  const handleChangeFormulario = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    
    try {
      setGuardando(true);
      setMensaje({ tipo: '', texto: '' });
      
      // Validaciones básicas
      if (!datosFormulario.nombre.trim()) {
        setMensaje({ tipo: 'warning', texto: 'El nombre es obligatorio' });
        return;
      }
      
      if (!datosFormulario.email.trim() || !datosFormulario.email.includes('@')) {
        setMensaje({ tipo: 'warning', texto: 'Ingresa un email válido' });
        return;
      }
      
      // TODO: Reemplazar con llamada real a la API
      // const response = await fetch(`http://localhost:8080/api/clientes/perfil`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
      //   },
      //   body: JSON.stringify({
      //     nombreCliente: datosFormulario.nombre,
      //     email: datosFormulario.email,
      //     telefonoCliente: datosFormulario.telefono
      //   })
      // });
      
      // Si el email cambió, actualizarlo también
      // if (datosFormulario.email !== cliente.email) {
      //   await fetch(`http://localhost:8080/api/clientes/${cliente.id}/email`, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
      //     },
      //     body: JSON.stringify({
      //       nuevoEmail: datosFormulario.email
      //     })
      //   });
      // }
      
      // MOCK - Simular guardado exitoso
      setTimeout(() => {
        setCliente(prev => ({
          ...prev,
          nombre: datosFormulario.nombre,
          telefono: datosFormulario.telefono,
          email: datosFormulario.email
        }));
        
        // Actualizar el nombre en localStorage para que se refleje en el header
        localStorage.setItem('userName', datosFormulario.nombre);
        
        setEditandoPerfil(false);
        setMensaje({ 
          tipo: 'success', 
          texto: '✓ Perfil actualizado exitosamente' 
        });
        setGuardando(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error guardando perfil:', error);
      setMensaje({ 
        tipo: 'danger', 
        texto: 'Error al guardar los cambios. Por favor, intenta nuevamente.' 
      });
      setGuardando(false);
    }
  };

  // Abrir modal para agregar/editar dirección
  const handleAbrirModalDireccion = (direccion = null) => {
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

  // Manejar cambios en el formulario de dirección
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
        // TODO: Reemplazar con llamada real a la API
        // const response = await fetch(
        //   `http://localhost:8080/api/clientes/direcciones/${direccionEditando.id}`,
        //   {
        //     method: 'PUT',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
        //     },
        //     body: JSON.stringify({
        //       idCiudad: parseInt(formDireccion.idCiudad),
        //       direccion: formDireccion.direccion,
        //       alias: formDireccion.alias
        //     })
        //   }
        // );
        
        // MOCK - Simular actualización
        setTimeout(() => {
          setDirecciones(prev => prev.map(dir => 
            dir.id === direccionEditando.id 
              ? { ...dir, ...formDireccion, idCiudad: parseInt(formDireccion.idCiudad) }
              : dir
          ));
          
          handleCerrarModalDireccion();
          setMensaje({ 
            tipo: 'success', 
            texto: '✓ Dirección actualizada exitosamente' 
          });
          setGuardando(false);
        }, 800);
        
      } else {
        // CREAR nueva dirección
        // TODO: Reemplazar con llamada real a la API
        // const response = await fetch(
        //   `http://localhost:8080/api/clientes/direcciones`,
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
        //     },
        //     body: JSON.stringify({
        //       idCliente: cliente.id,
        //       idCiudad: parseInt(formDireccion.idCiudad),
        //       direccion: formDireccion.direccion,
        //       alias: formDireccion.alias
        //     })
        //   }
        // );
        
        // MOCK - Simular creación
        setTimeout(() => {
          const nuevaDireccion = {
            id: direcciones.length + 1,
            ...formDireccion,
            idCiudad: parseInt(formDireccion.idCiudad)
          };
          
          setDirecciones(prev => [...prev, nuevaDireccion]);
          
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
  const handleEliminarDireccion = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      return;
    }
    
    try {
      setGuardando(true);
      
      // TODO: Reemplazar con llamada real a la API
      // const response = await fetch(
      //   `http://localhost:8080/api/clientes/direcciones/${id}`,
      //   {
      //     method: 'DELETE',
      //     headers: {
      //       'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
      //     }
      //   }
      // );
      
      // MOCK - Simular eliminación
      setTimeout(() => {
        setDirecciones(prev => prev.filter(dir => dir.id !== id));
        setMensaje({ 
          tipo: 'success', 
          texto: '✓ Dirección eliminada exitosamente' 
        });
        setGuardando(false);
      }, 500);
      
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      setMensaje({ 
        tipo: 'danger', 
        texto: 'Error al eliminar la dirección. Por favor, intenta nuevamente.' 
      });
      setGuardando(false);
    }
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <>
        <HeaderComp />
        <Container className="my-5 text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3">Cargando perfil...</p>
        </Container>
        <FooterComp />
      </>
    );
  }

  return (
    <>
      <HeaderComp />
      
      <Container className="my-5">
        <h2 className="mb-4">
          <i className="bi bi-person-circle me-2"></i>
          Mi Perfil
        </h2>

        {/* Alertas de mensajes */}
        {mensaje.texto && (
          <Alert 
            variant={mensaje.tipo} 
            dismissible 
            onClose={() => setMensaje({ tipo: '', texto: '' })}
          >
            {mensaje.texto}
          </Alert>
        )}

        <Row>
          {/* Columna izquierda - Datos del perfil */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm perfil-card" style={{ maxHeight: '600px' }}>
              <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-person-badge me-2"></i>
                  Información Personal
                </h5>
                {!editandoPerfil && (
                  <Button 
                    variant="warning" 
                    size="sm"
                    onClick={() => setEditandoPerfil(true)}
                    className="text-dark fw-semibold"
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Editar
                  </Button>
                )}
              </Card.Header>
              <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {!editandoPerfil ? (
                  // Modo visualización
                  <>
                    <div className="mb-3">
                      <strong className="text-muted">Nombre:</strong>
                      <p className="mb-0 text-white">{cliente?.nombre}</p>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted">Teléfono:</strong>
                      <p className="mb-0 text-white">{cliente?.telefono || 'No especificado'}</p>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted">Email:</strong>
                      <p className="mb-0 text-white">{cliente?.email}</p>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted">Fecha de registro:</strong>
                      <p className="mb-0 text-white">
                        {new Date(cliente?.fechaRegistro).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    
                    <Button 
                      variant="warning" 
                      onClick={() => setEditandoPerfil(true)}
                      className="w-100 text-dark fw-semibold"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Editar Perfil
                    </Button>
                  </>
                ) : (
                  // Modo edición
                  <Form onSubmit={handleGuardarPerfil}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={datosFormulario.nombre}
                        onChange={handleChangeFormulario}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={datosFormulario.telefono}
                        onChange={handleChangeFormulario}
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
                        value={datosFormulario.email}
                        onChange={handleChangeFormulario}
                        required
                      />
                      <Form.Text className="text-muted">
                        Si cambias tu email, deberás verificarlo nuevamente
                      </Form.Text>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button 
                        variant="success" 
                        type="submit"
                        disabled={guardando}
                        className="flex-grow-1"
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
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          setEditandoPerfil(false);
                          setDatosFormulario({
                            nombre: cliente.nombre,
                            telefono: cliente.telefono,
                            email: cliente.email
                          });
                        }}
                        disabled={guardando}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Columna derecha - Direcciones */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm perfil-card" style={{ maxHeight: '600px' }}>
              <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Mis Direcciones
                </h5>
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={() => handleAbrirModalDireccion()}
                  className="text-dark fw-semibold"
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Agregar
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {direcciones.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-house-x display-4"></i>
                    <p className="mt-2">No tienes direcciones registradas</p>
                    <Button 
                      variant="outline-warning"
                      onClick={() => handleAbrirModalDireccion()}
                    >
                      Agregar primera dirección
                    </Button>
                  </div>
                ) : (
                  <div className="list-group">
                    {direcciones.map((direccion, index) => (
                      <div 
                        key={direccion.id} 
                        className="list-group-item list-group-item-action mb-2 rounded"
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <Badge bg="secondary" className="me-2">
                                Dirección {index + 1}
                              </Badge>
                              {direccion.alias && (
                                <Badge bg="warning" text="dark">
                                  {direccion.alias}
                                </Badge>
                              )}
                            </div>
                            <p className="mb-1">
                              <strong>{direccion.direccion}</strong>
                            </p>
                            <p className="mb-0 text-muted small">
                              <i className="bi bi-geo-alt-fill me-1"></i>
                              {getNombreCiudad(direccion.idCiudad)}
                            </p>
                          </div>
                          <div className="d-flex flex-column gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAbrirModalDireccion(direccion)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleEliminarDireccion(direccion.id)}
                              disabled={guardando}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para agregar/editar dirección */}
      <Modal show={showModalDireccion} onHide={handleCerrarModalDireccion} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {direccionEditando ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGuardarDireccion}>
          <Modal.Body>
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
                <option value="1">Valparaíso</option>
                <option value="2">Viña del Mar</option>
                <option value="3">Quilpué</option>
                <option value="4">Curauma</option>
                <option value="5">Villa Alemana</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Selecciona la ciudad donde se encuentra tu dirección
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
          <Modal.Footer>
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

      <FooterComp />
    </>
  );
}
