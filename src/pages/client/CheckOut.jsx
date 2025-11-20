// src/pages/client/CheckoutPag.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import {
  obtenerClientePorUid,
  obtenerDireccionesPorCliente,
  crearDireccion,
  obtenerTodasCiudades
} from '../../services/usuariosService';
import { crearPedido, actualizarPedidoAPagado } from '../../services/pedidosService';
import { crearPreferenciaPago } from '../../services/pagoService';
import '../../styles/checkout.css';

function CheckoutPag() {
  const navigate = useNavigate();

  // Estados del carrito y pedido
  const [carrito, setCarrito] = useState([]);
  const [tipoPedido, setTipoPedido] = useState('delivery');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Estados del cliente y direcciones
  const [cliente, setCliente] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  // Estados del modal de dirección
  const [showModalDireccion, setShowModalDireccion] = useState(false);
  const [formDireccion, setFormDireccion] = useState({
    idCiudad: '',
    direccion: '',
    alias: ''
  });

  // Cargar carrito y datos del cliente al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      // Verificar carrito
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        const carritoParseado = JSON.parse(carritoGuardado);
        if (carritoParseado.length === 0) {
          navigate('/catalogo');
          return;
        }
        setCarrito(carritoParseado);
      } else {
        navigate('/catalogo');
        return;
      }

      // Cargar datos del cliente
      try {
        const firebaseUid = localStorage.getItem('userId');
        if (!firebaseUid) {
          navigate('/login');
          return;
        }

        // Cargar cliente y ciudades en paralelo
        const [clienteData, ciudadesData] = await Promise.all([
          obtenerClientePorUid(firebaseUid),
          obtenerTodasCiudades()
        ]);

        setCliente(clienteData);
        setCiudades(ciudadesData);

        // Inicializar formulario con datos del cliente
        setFormData({
          nombre: clienteData.nombreCliente || '',
          telefono: clienteData.telefonoCliente || '',
          email: clienteData.usuario?.email || clienteData.email || ''
        });

        // Cargar direcciones del cliente
        if (clienteData.idCliente) {
          const direccionesData = await obtenerDireccionesPorCliente(clienteData.idCliente);
          setDirecciones(direccionesData);

          // Seleccionar la primera dirección por defecto si existe
          if (direccionesData.length > 0) {
            setDireccionSeleccionada(direccionesData[0]);
          }
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calcularDelivery = () => {
    return tipoPedido === 'delivery' ? 2500 : 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularDelivery();
  };

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para recargar direcciones
  const recargarDirecciones = async () => {
    try {
      if (cliente?.idCliente) {
        const direccionesData = await obtenerDireccionesPorCliente(cliente.idCliente);
        setDirecciones(direccionesData);

        if (!direccionSeleccionada && direccionesData.length > 0) {
          setDireccionSeleccionada(direccionesData[0]);
        }
      }
    } catch (error) {
      console.error('Error recargando direcciones:', error);
    }
  };

  // Abrir modal para agregar nueva dirección
  const handleAbrirModalDireccion = () => {
    setFormDireccion({
      idCiudad: '',
      direccion: '',
      alias: ''
    });
    setShowModalDireccion(true);
  };

  // Cerrar modal de dirección
  const handleCerrarModalDireccion = () => {
    setShowModalDireccion(false);
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

  // Guardar nueva dirección
  const handleGuardarDireccion = async (e) => {
    e.preventDefault();

    if (!formDireccion.direccion.trim() || !formDireccion.idCiudad) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      setGuardando(true);

      await crearDireccion({
        idCliente: cliente.idCliente,
        idCiudad: parseInt(formDireccion.idCiudad),
        direccion: formDireccion.direccion,
        alias: formDireccion.alias
      });

      await recargarDirecciones();
      handleCerrarModalDireccion();
      alert('Dirección agregada exitosamente');

    } catch (error) {
      console.error('Error guardando dirección:', error);
      alert('Error al guardar la dirección');
    } finally {
      setGuardando(false);
    }
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa tu nombre');
      return false;
    }

    if (!formData.telefono.trim()) {
      alert('Por favor ingresa tu teléfono');
      return false;
    }

    if (!formData.email.trim()) {
      alert('Por favor ingresa tu email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido');
      return false;
    }

    if (tipoPedido === 'delivery') {
      if (!direccionSeleccionada) {
        alert('Por favor selecciona o agrega una dirección de entrega');
        return false;
      }
    }

    if (!aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  // Crear objeto de pedido para enviar al backend
  const crearObjetoPedido = () => {
    // Mapear el tipo de entrega
    const tipoEntregaId = tipoPedido === 'delivery' ? 1 : 2; // 1=Delivery, 2=Retiro
    
    // Mapear el método de pago
    const metodoPagoId = metodoPago === 'efectivo' ? 1 : 2; // 1=Efectivo, 2=MercadoPago

    return {
      idCliente: cliente.idCliente,
      idEstadoPedido: 1, // 1 = Pendiente de pago
      idMetodoPago: metodoPagoId,
      idTipoEntrega: tipoEntregaId,
      idDireccionEntrega: tipoPedido === 'delivery' ? direccionSeleccionada?.idDireccion : null,
      montoSubtotal: calcularSubtotal(),
      montoEnvio: calcularDelivery(),
      montoTotal: calcularTotal(),
      fechaHoraPedido: new Date().toISOString(),
      notasCliente: null,
      detalles: carrito.map(item => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotalLinea: item.precio * item.cantidad
      }))
    };
  };

  // Manejar pago en efectivo
  const procesarPagoEfectivo = async (pedidoCreado) => {
    try {
      console.log('💵 Procesando pago en efectivo...');
      
      // Actualizar pedido a estado PAGADO (2) y generar venta
      await actualizarPedidoAPagado(pedidoCreado.idPedido);
      
      console.log('✅ Pedido marcado como pagado y venta generada');
      
      // Limpiar carrito
      localStorage.removeItem('carrito');
      window.dispatchEvent(new Event('storage'));

      alert(`¡Pedido confirmado!\n\nNúmero de pedido: ${pedidoCreado.idPedido}\nTotal: $${calcularTotal().toLocaleString('es-CL')}\n\nPagarás en efectivo al recibir tu pedido.\nTe enviaremos un email de confirmación.`);

      navigate('/inicio');
    } catch (error) {
      console.error(' Error al procesar pago en efectivo:', error);
      alert('Hubo un error al confirmar el pedido. Por favor, intenta nuevamente.');
    }
  };

  // Manejar pago con Mercado Pago
  const procesarPagoMercadoPago = async (pedidoCreado) => {
    try {
      console.log('💳 Procesando pago con Mercado Pago...');
      
      // Crear preferencia de pago
      const datosPreferencia = {
        idPedido: pedidoCreado.idPedido,
        montoPago: calcularTotal(),
        descripcion: `Pedido #${pedidoCreado.idPedido} - ${carrito.length} producto(s)`,
        emailPagador: formData.email,
        nombrePagador: formData.nombre
      };

      const preferenciaResponse = await crearPreferenciaPago(datosPreferencia);
      
      console.log('✅ Preferencia de pago creada:', preferenciaResponse);

      // Guardar el ID del pedido en localStorage para verificar después del pago
      localStorage.setItem('pedidoPendientePago', JSON.stringify({
        idPedido: pedidoCreado.idPedido,
        idPago: preferenciaResponse.idPago,
        timestamp: new Date().toISOString()
      }));

      // Redirigir a Mercado Pago
      if (preferenciaResponse.urlPago) {
        window.location.href = preferenciaResponse.urlPago;
      } else {
        throw new Error('No se recibió la URL de pago de Mercado Pago');
      }

    } catch (error) {
      console.error('❌ Error al crear preferencia de Mercado Pago:', error);
      alert('Hubo un error al procesar el pago. Por favor, intenta nuevamente.');
    }
  };

  // Manejar confirmación del pedido
  const handleConfirmarPedido = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setProcesandoPago(true);

    try {
      // 1. Crear el pedido en el backend
      console.log('📦 Creando pedido en backend...');
      const objetoPedido = crearObjetoPedido();
      const pedidoCreado = await crearPedido(objetoPedido);
      console.log('✅ Pedido creado:', pedidoCreado);

      // 2. Procesar según el método de pago
      if (metodoPago === 'efectivo') {
        await procesarPagoEfectivo(pedidoCreado);
      } else if (metodoPago === 'mercadopago') {
        await procesarPagoMercadoPago(pedidoCreado);
      }

    } catch (error) {
      console.error(' Error al confirmar pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setProcesandoPago(false);
    }
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="pagina-completa">
        <HeaderComp />
        <main className="contenido-principal">
          <div className="container py-5 text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-3">Cargando información...</p>
          </div>
        </main>
        <FooterComp />
      </div>
    );
  }

  // Estructura del componente JSX
  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <div className="container py-5">
          <h1 className="checkout-titulo">Finalizar Compra</h1>

          <div className="checkout-grid">
            <div className="checkout-form-section">
              <form onSubmit={handleConfirmarPedido}>
                
                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Tipo de Pedido</h3>
                  <div className="tipo-pedido-opciones">
                    <label className={`tipo-pedido-opcion ${tipoPedido === 'delivery' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="tipoPedido"
                        value="delivery"
                        checked={tipoPedido === 'delivery'}
                        onChange={(e) => setTipoPedido(e.target.value)}
                      />
                      <div className="opcion-contenido">
                        <span className="opcion-titulo">Delivery</span>
                        <span className="opcion-precio">+$2.500</span>
                      </div>
                    </label>

                    <label className={`tipo-pedido-opcion ${tipoPedido === 'retiro' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="tipoPedido"
                        value="retiro"
                        checked={tipoPedido === 'retiro'}
                        onChange={(e) => setTipoPedido(e.target.value)}
                      />
                      <div className="opcion-contenido">
                        <span className="opcion-titulo">Retiro en tienda</span>
                        <span className="opcion-precio">Gratis</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Información Personal</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="9 dígitos"
                        maxLength="9"
                      />
                    </div>

                  </div>

                  {/* Información del email */}
                  <Alert variant="info" className="mt-3 mb-0">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-envelope-fill me-2"></i>
                      <div>
                        <strong>Tu pedido se enviará al correo:</strong>{' '}
                        <span style={{ fontWeight: 'normal' }}>{formData.email}</span>
                      </div>
                    </div>
                  </Alert>
                </div>

                {tipoPedido === 'delivery' && (
                  <div className="form-seccion">
                    <h3 className="form-seccion-titulo">Información de Entrega</h3>

                    {direcciones.length > 0 ? (
                      <>
                        <div className="form-group">
                          <label>Selecciona tu dirección de entrega *</label>
                          <select
                            className="form-control"
                            value={direccionSeleccionada?.idDireccion || ''}
                            onChange={(e) => {
                              const direccion = direcciones.find(
                                d => d.idDireccion === parseInt(e.target.value)
                              );
                              setDireccionSeleccionada(direccion);
                            }}
                            required
                          >
                            <option value="">Selecciona una dirección</option>
                            {direcciones.map((dir) => (
                              <option key={dir.idDireccion} value={dir.idDireccion}>
                                {dir.alias ? `${dir.alias} - ` : ''}
                                {dir.direccion}, {dir.ciudad?.nombreCiudad || dir.nombreCiudad}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-primary mt-2"
                          onClick={handleAbrirModalDireccion}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Agregar nueva dirección
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted mb-3">No tienes direcciones guardadas</p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAbrirModalDireccion}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Agregar dirección de entrega
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Método de Pago</h3>
                  
                  <div className="metodos-pago">
                    <label className={`metodo-pago ${metodoPago === 'efectivo' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="efectivo"
                        checked={metodoPago === 'efectivo'}
                        onChange={(e) => setMetodoPago(e.target.value)} 
                      />
                      <div className="metodo-info">
                        <i className="bi bi-cash"></i>
                        <span>Efectivo</span>
                        <small>Paga en la Entrega</small>
                      </div>
                    </label>

                    <label className={`metodo-pago ${metodoPago === 'mercadopago' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="mercadopago"
                        checked={metodoPago === 'mercadopago'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <i className="bi bi-wallet2"></i>
                        <span>Mercado Pago</span>
                        <small>Pago seguro en línea</small>
                      </div>
                    </label>
                  </div>

                  {metodoPago === 'mercadopago' && (
                    <Alert variant="info" className="mt-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Serás redirigido a Mercado Pago para completar el pago de forma segura
                    </Alert>
                  )}
                </div>

                <div className="form-seccion">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                    />
                    <span>Acepto los <a href="#" className="link-terminos">términos y condiciones</a></span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn-confirmar-pedido"
                  disabled={procesandoPago}
                >
                  {procesandoPago ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Procesando...
                    </>
                  ) : (
                    metodoPago === 'mercadopago' ? 'Ir a Pagar' : 'Confirmar Pedido'
                  )}
                </button>
              </form>
            </div>

            <div className="checkout-resumen">
              <div className="resumen-card">
                <h2 className="resumen-titulo">Resumen del Pedido</h2>

                <div className="resumen-linea">
                  <span>Subtotal:</span>
                  <span>${calcularSubtotal().toLocaleString('es-CL')}</span>
                </div>

                <div className="resumen-linea">
                  <span>Delivery:</span>
                  <span className={calcularDelivery() === 0 ? 'text-success' : ''}>
                    {calcularDelivery() === 0 ? 'Gratis' : `$${calcularDelivery().toLocaleString('es-CL')}`}
                  </span>
                </div>

                <hr className="resumen-separador" />

                <div className="resumen-total">
                  <span>Total:</span>
                  <span className="total-valor">${calcularTotal().toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterComp />

      {/* Modal para agregar nueva dirección */}
      <Modal show={showModalDireccion} onHide={handleCerrarModalDireccion} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Dirección</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGuardarDireccion}>
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
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección *</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                placeholder="Ej: Av. Siempre Viva 742"
                value={formDireccion.direccion}
                onChange={handleChangeDireccion}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alias (opcional)</Form.Label>
              <Form.Control
                type="text"
                name="alias"
                placeholder="Ej: Casa, Trabajo, etc."
                value={formDireccion.alias}
                onChange={handleChangeDireccion}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={handleCerrarModalDireccion}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={guardando}>
                {guardando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CheckoutPag;