import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import {
  obtenerClientePorUid,
  obtenerDireccionesPorCliente,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  obtenerTodasCiudades,
  actualizarPerfilCliente
} from '../../services/usuariosService';
import './MiPerfilPag.css';

export default function MiPerfilPag() {
  const navigate = useNavigate();
  
  // Estado para los datos del cliente
  const [cliente, setCliente] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Estados para editar perfil (solo nombre y teléfono, email NO es editable)
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombreCliente: '',
    telefonoCliente: ''
  });

  // Estados para modal de dirección
  const [showModalDireccion, setShowModalDireccion] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [formDireccion, setFormDireccion] = useState({
    idCiudad: '',
    direccion: '',
    alias: ''
  });

  // Función helper para obtener nombre de ciudad
  const getNombreCiudad = (idCiudad) => {
    const ciudad = ciudades.find(c => c.idCiudad === idCiudad);
    return ciudad ? ciudad.nombreCiudad : `Ciudad ID: ${idCiudad}`;
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
      setMensaje({ tipo: '', texto: '' });

      // Intentar obtener el Firebase UID de diferentes formas
      let firebaseUid = localStorage.getItem('userId');

      // Si no existe, intentar obtenerlo del objeto user guardado
      if (!firebaseUid || firebaseUid === 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log('📦 Objeto user del localStorage:', user);
            console.log('🔑 Campos disponibles:', Object.keys(user));

            // Intentar diferentes nombres de campo posibles
            firebaseUid = user.idUsuario || user.uid || user.firebaseUid || user.userId || user.id;

            if (firebaseUid) {
              console.log('✅ UID encontrado en objeto user:', firebaseUid);
              // Guardarlo para la próxima vez
              localStorage.setItem('userId', firebaseUid);
            }
          } catch (e) {
            console.error('❌ Error parseando user:', e);
          }
        }
      }

      if (!firebaseUid || firebaseUid === 'undefined') {
        console.error('❌ No se pudo obtener el UID del usuario');
        console.log('📋 localStorage completo:', {
          userId: localStorage.getItem('userId'),
          user: localStorage.getItem('user'),
          userName: localStorage.getItem('userName'),
          userRole: localStorage.getItem('userRole')
        });

        setMensaje({
          tipo: 'danger',
          texto: 'No se encontró la sesión del usuario. Por favor, cierra sesión y vuelve a iniciar sesión.'
        });
        return;
      }

      console.log('🔍 Cargando datos del cliente con UID:', firebaseUid);

      // Cargar cliente y ciudades en paralelo
      const [clienteData, ciudadesData] = await Promise.all([
        obtenerClientePorUid(firebaseUid),
        obtenerTodasCiudades()
      ]);

      console.log('✅ Cliente cargado:', clienteData);
      console.log('✅ Ciudades cargadas:', ciudadesData);

      setCliente(clienteData);
      setCiudades(ciudadesData);

      // Inicializar formulario de perfil con los datos del cliente
      // Solo nombre y teléfono son editables, email NO (requiere Firebase)
      setFormPerfil({
        nombreCliente: clienteData.nombreCliente || '',
        telefonoCliente: clienteData.telefonoCliente || ''
      });

      // Cargar direcciones del cliente
      if (clienteData.idCliente) {
        const direccionesData = await obtenerDireccionesPorCliente(clienteData.idCliente);
        console.log('✅ Direcciones cargadas:', direccionesData);
        setDirecciones(direccionesData);
      }

    } catch (error) {
      console.error('❌ Error cargando datos del cliente:', error);
      setMensaje({
        tipo: 'danger',
        texto: error.response?.data?.message || 'Error al cargar los datos del perfil. Por favor, intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar direcciones del cliente
  const recargarDirecciones = async () => {
    try {
      if (cliente?.idCliente) {
        const direccionesData = await obtenerDireccionesPorCliente(cliente.idCliente);
        setDirecciones(direccionesData);
      }
    } catch (error) {
      console.error('❌ Error recargando direcciones:', error);
    }
  };

  // Manejar cambios en el formulario de perfil
  const handleChangePerfil = (e) => {
    const { name, value } = e.target;
    setFormPerfil(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const handleGuardarPerfil = async (e) => {
    e.preventDefault();

    try {
      // Validaciones
      if (!formPerfil.nombreCliente.trim()) {
        setMensaje({ tipo: 'warning', texto: 'El nombre es obligatorio' });
        return;
      }

      // Validar teléfono si está presente
      if (formPerfil.telefonoCliente.trim()) {
        const telefonoLimpio = formPerfil.telefonoCliente.replace(/\D/g, '');
        if (telefonoLimpio.length !== 9) {
          setMensaje({ tipo: 'warning', texto: 'El teléfono debe tener exactamente 9 dígitos' });
          return;
        }
      }

      setGuardando(true);
      setMensaje({ tipo: '', texto: '' });

      console.log('💾 Actualizando perfil del cliente...');

      // El backend requiere que se envíe el email también, aunque no se modifique
      // IMPORTANTE: telefonoCliente debe ser null si está vacío (no string vacío "")
      const emailActual = cliente?.usuario?.email || cliente?.email || '';

      if (!emailActual) {
        setMensaje({
          tipo: 'danger',
          texto: 'Error: No se pudo obtener el email del usuario'
        });
        setGuardando(false);
        return;
      }

      const datosActualizar = {
        nombreCliente: formPerfil.nombreCliente.trim(),
        email: emailActual,
        telefonoCliente: formPerfil.telefonoCliente.trim() || null // null si está vacío
      };

      console.log('📦 Datos a enviar:', datosActualizar);

      // Actualizar perfil usando el endpoint del cliente
      const clienteActualizado = await actualizarPerfilCliente(datosActualizar);

      console.log('✅ Perfil actualizado:', clienteActualizado);

      // Actualizar el estado local
      setCliente(prev => ({
        ...prev,
        nombreCliente: clienteActualizado.nombreCliente,
        telefonoCliente: clienteActualizado.telefonoCliente
      }));

      // Actualizar el nombre en localStorage para que se refleje en el header
      localStorage.setItem('userName', clienteActualizado.nombreCliente);

      setEditandoPerfil(false);
      setMensaje({
        tipo: 'success',
        texto: '✓ Perfil actualizado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      setMensaje({
        tipo: 'danger',
        texto: error.response?.data?.message || 'Error al actualizar el perfil. Por favor, intenta nuevamente.'
      });
    } finally {
      setGuardando(false);
    }
  };

  // Abrir modal para agregar/editar dirección
  const handleAbrirModalDireccion = (direccion = null) => {
    if (direccion) {
      // Modo edición
      setDireccionEditando(direccion);
      setFormDireccion({
        idCiudad: direccion.ciudad?.idCiudad || direccion.idCiudad || '',
        direccion: direccion.direccion || '',
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
        await actualizarDireccion(direccionEditando.idDireccion, {
          idCiudad: parseInt(formDireccion.idCiudad),
          direccion: formDireccion.direccion,
          alias: formDireccion.alias
        });

        // Recargar direcciones
        await recargarDirecciones();

        handleCerrarModalDireccion();
        setMensaje({
          tipo: 'success',
          texto: '✓ Dirección actualizada exitosamente'
        });

      } else {
        // CREAR nueva dirección
        await crearDireccion({
          idCliente: cliente.idCliente,
          idCiudad: parseInt(formDireccion.idCiudad),
          direccion: formDireccion.direccion,
          alias: formDireccion.alias
        });

        // Recargar direcciones
        await recargarDirecciones();

        handleCerrarModalDireccion();
        setMensaje({
          tipo: 'success',
          texto: '✓ Dirección agregada exitosamente'
        });
      }

    } catch (error) {
      console.error('❌ Error guardando dirección:', error);
      setMensaje({
        tipo: 'danger',
        texto: error.response?.data?.message || 'Error al guardar la dirección. Por favor, intenta nuevamente.'
      });
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar dirección
  const handleEliminarDireccion = async (idDireccion) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setMensaje({ tipo: '', texto: '' });

      await eliminarDireccion(idDireccion);

      // Recargar direcciones
      await recargarDirecciones();

      setMensaje({
        tipo: 'success',
        texto: '✓ Dirección eliminada exitosamente'
      });

    } catch (error) {
      console.error('❌ Error eliminando dirección:', error);
      setMensaje({
        tipo: 'danger',
        texto: error.response?.data?.message || 'Error al eliminar la dirección. Por favor, intenta nuevamente.'
      });
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
                      <p className="mb-0 text-white">{cliente?.nombreCliente || 'No disponible'}</p>
                    </div>

                    <div className="mb-3">
                      <strong className="text-muted">Email:</strong>
                      <p className="mb-0 text-white">{cliente?.usuario?.email || cliente?.email || 'No disponible'}</p>
                      <Form.Text className="text-muted">
                        <i className="bi bi-lock-fill me-1"></i>
                        El email no se puede modificar
                      </Form.Text>
                    </div>

                    <div className="mb-3">
                      <strong className="text-muted">Teléfono:</strong>
                      <p className="mb-0 text-white">{cliente?.telefonoCliente || 'No especificado'}</p>
                    </div>

                    <div className="mb-3">
                      <strong className="text-muted">Miembro desde:</strong>
                      <p className="mb-0 text-white">
                        {cliente?.usuario?.fechaCreacion
                          ? new Date(cliente.usuario.fechaCreacion).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'No disponible'
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  // Modo edición
                  <Form onSubmit={handleGuardarPerfil}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombreCliente"
                        value={formPerfil.nombreCliente}
                        onChange={handleChangePerfil}
                        required
                        placeholder="Ej: Juan Pérez"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={cliente?.usuario?.email || cliente?.email || ''}
                        disabled
                        className="bg-secondary bg-opacity-25"
                      />
                      <Form.Text className="text-muted">
                        <i className="bi bi-lock-fill me-1"></i>
                        El email no se puede modificar por seguridad
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefonoCliente"
                        value={formPerfil.telefonoCliente}
                        onChange={handleChangePerfil}
                        placeholder="912345678"
                        pattern="[0-9]{9}"
                        maxLength="9"
                      />
                      <Form.Text className="text-muted">
                        9 dígitos sin espacios ni símbolos
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
                          setFormPerfil({
                            nombreCliente: cliente.nombreCliente || '',
                            telefonoCliente: cliente.telefonoCliente || ''
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
                        key={direccion.idDireccion}
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
                              {direccion.ciudad?.nombreCiudad || direccion.nombreCiudad || getNombreCiudad(direccion.idCiudad || direccion.ciudad?.idCiudad)}
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
                              onClick={() => handleEliminarDireccion(direccion.idDireccion)}
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
                {ciudades.map((ciudad) => (
                  <option key={ciudad.idCiudad} value={ciudad.idCiudad}>
                    {ciudad.nombreCiudad}
                  </option>
                ))}
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
