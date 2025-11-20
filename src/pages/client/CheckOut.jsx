// src/pages/client/CheckoutPag.jsx
// Página de checkout donde el cliente confirma su pedido
// El pedido YA FUE CREADO en la BD, aquí solo se actualiza con los datos finales

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

  // ===== ESTADOS DEL COMPONENTE =====
  // Los estados son variables que React controla y cuando cambian, actualiza la interfaz

  // Estados del carrito y pedido
  const [carrito, setCarrito] = useState([]); // Productos del carrito
  const [tipoPedido, setTipoPedido] = useState('delivery'); // 'delivery' o 'retiro'
  const [metodoPago, setMetodoPago] = useState('efectivo'); // 'efectivo' o 'mercadopago'
  const [aceptaTerminos, setAceptaTerminos] = useState(false); // Si aceptó los términos

  // Estados del cliente y direcciones
  const [cliente, setCliente] = useState(null); // Datos del cliente
  const [direcciones, setDirecciones] = useState([]); // Lista de direcciones del cliente
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null); // Dirección elegida
  const [ciudades, setCiudades] = useState([]); // Lista de ciudades disponibles
  const [loading, setLoading] = useState(true); // Si está cargando datos
  const [guardando, setGuardando] = useState(false); // Si está guardando una dirección
  const [procesandoPago, setProcesandoPago] = useState(false); // Si está procesando el pago

  // Estados del formulario de datos personales
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  // Estados del modal para agregar dirección
  const [showModalDireccion, setShowModalDireccion] = useState(false);
  const [formDireccion, setFormDireccion] = useState({
    idCiudad: '',
    direccion: '',
    alias: ''
  });

  // ===== useEffect: SE EJECUTA CUANDO SE CARGA LA PÁGINA =====
  useEffect(() => {
    const cargarDatos = async () => {
      // 1. Verificar que haya un pedido en proceso
      const pedidoEnProceso = localStorage.getItem('pedidoEnProceso');
      if (!pedidoEnProceso) {
        alert('No hay un pedido en proceso. Por favor, vuelve al carrito.');
        navigate('/carrito');
        return;
      }

      const { idPedido } = JSON.parse(pedidoEnProceso);
      console.log('📦 Pedido en proceso ID:', idPedido);

      // 2. Cargar el carrito desde localStorage para mostrar el resumen
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

      // 3. Cargar datos del cliente
      try {
        const firebaseUid = localStorage.getItem('userId');
        if (!firebaseUid) {
          navigate('/login');
          return;
        }

        // Cargar cliente y ciudades al mismo tiempo (en paralelo)
        const [clienteData, ciudadesData] = await Promise.all([
          obtenerClientePorUid(firebaseUid),
          obtenerTodasCiudades()
        ]);

        setCliente(clienteData);
        setCiudades(ciudadesData);

        // Llenar el formulario con los datos del cliente
        setFormData({
          nombre: clienteData.nombreCliente || '',
          telefono: clienteData.telefonoCliente || '',
          email: clienteData.usuario?.email || clienteData.email || ''
        });

        // 4. Cargar las direcciones del cliente
        if (clienteData.idCliente) {
          const direccionesData = await obtenerDireccionesPorCliente(clienteData.idCliente);
          setDirecciones(direccionesData);

          // Seleccionar la primera dirección automáticamente si existe
          if (direccionesData.length > 0) {
            setDireccionSeleccionada(direccionesData[0]);
          }
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false); // Terminar la carga
      }
    };

    cargarDatos();
  }, [navigate]);

  // ===== FUNCIONES DE CÁLCULO =====
  
  // Calcular el subtotal (suma de todos los productos)
  function calcularSubtotal() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  // Calcular el costo de delivery
  function calcularDelivery() {
    return tipoPedido === 'delivery' ? 2500 : 0; // $2500 si es delivery, $0 si es retiro
  }

  // Calcular el total final
  function calcularTotal() {
    return calcularSubtotal() + calcularDelivery();
  }

  // ===== FUNCIONES PARA MANEJAR CAMBIOS EN FORMULARIOS =====

  // Cuando el usuario escribe en los campos de nombre, teléfono, etc.
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Cuando el usuario escribe en el formulario de nueva dirección
  function handleChangeDireccion(e) {
    const { name, value } = e.target;
    setFormDireccion(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // ===== FUNCIONES PARA EL MODAL DE DIRECCIONES =====

  // Abrir el modal para agregar una nueva dirección
  function handleAbrirModalDireccion() {
    setFormDireccion({
      idCiudad: '',
      direccion: '',
      alias: ''
    });
    setShowModalDireccion(true);
  }

  // Cerrar el modal
  function handleCerrarModalDireccion() {
    setShowModalDireccion(false);
    setFormDireccion({
      idCiudad: '',
      direccion: '',
      alias: ''
    });
  }

  // Recargar la lista de direcciones después de agregar una nueva
  async function recargarDirecciones() {
    try {
      if (cliente?.idCliente) {
        const direccionesData = await obtenerDireccionesPorCliente(cliente.idCliente);
        setDirecciones(direccionesData);

        // Si no hay dirección seleccionada, seleccionar la primera
        if (!direccionSeleccionada && direccionesData.length > 0) {
          setDireccionSeleccionada(direccionesData[0]);
        }
      }
    } catch (error) {
      console.error('Error recargando direcciones:', error);
    }
  }

  // Guardar una nueva dirección en la base de datos
  async function handleGuardarDireccion(e) {
    e.preventDefault();

    // Validar que los campos estén llenos
    if (!formDireccion.direccion.trim() || !formDireccion.idCiudad) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      setGuardando(true);

      // Crear la dirección en el backend
      await crearDireccion({
        idCliente: cliente.idCliente,
        idCiudad: parseInt(formDireccion.idCiudad),
        direccion: formDireccion.direccion,
        alias: formDireccion.alias
      });

      // Recargar las direcciones para que aparezca la nueva
      await recargarDirecciones();
      handleCerrarModalDireccion();
      alert('Dirección agregada exitosamente');

    } catch (error) {
      console.error('Error guardando dirección:', error);
      alert('Error al guardar la dirección');
    } finally {
      setGuardando(false);
    }
  }

  // ===== VALIDACIÓN DEL FORMULARIO =====
  
  function validarFormulario() {
    // Validar nombre
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa tu nombre');
      return false;
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      alert('Por favor ingresa tu teléfono');
      return false;
    }

    // Validar email
    if (!formData.email.trim()) {
      alert('Por favor ingresa tu email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido');
      return false;
    }

    // Si es delivery, validar que haya una dirección seleccionada
    if (tipoPedido === 'delivery') {
      if (!direccionSeleccionada) {
        alert('Por favor selecciona o agrega una dirección de entrega');
        return false;
      }
    }

    // Validar que aceptó los términos
    if (!aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    return true; // Todo está OK
  }

  // ===== CREAR OBJETO DEL PEDIDO ACTUALIZADO =====
  
  function crearObjetoPedidoActualizado() {
    // Convertir el tipo de entrega y método de pago a IDs numéricos
    const tipoEntregaId = tipoPedido === 'delivery' ? 1 : 2; // 1=Delivery, 2=Retiro
    const metodoPagoId = metodoPago === 'efectivo' ? 1 : 2; // 1=Efectivo, 2=MercadoPago

    // Crear el objeto base del pedido
    const pedido = {
      idCliente: parseInt(cliente.idCliente), // Convertir a número
      idEstadoPedido: 1, // 1 = Pendiente
      idMetodoPago: metodoPagoId,
      idTipoEntrega: tipoEntregaId,
      montoSubtotal: parseFloat(calcularSubtotal()), // Convertir a decimal
      montoEnvio: parseFloat(calcularDelivery()),
      montoTotal: parseFloat(calcularTotal()),
      fechaHoraPedido: new Date().toISOString(), // Fecha actual
      notasCliente: null,
      // Mapear los productos del carrito a detalles del pedido
      detalles: carrito.map(item => ({
        idProducto: parseInt(item.id), // IMPORTANTE: usar item.id (no idProducto)
        cantidad: parseInt(item.cantidad),
        precioUnitario: parseFloat(item.precio),
        subtotalLinea: parseFloat(item.precio * item.cantidad)
      }))
    };

    // Solo agregar la dirección si es delivery y hay una seleccionada
    if (tipoPedido === 'delivery' && direccionSeleccionada?.idDireccion) {
      pedido.idDireccionEntrega = parseInt(direccionSeleccionada.idDireccion);
    }

    console.log('📋 Pedido actualizado a enviar:', pedido);
    
    return pedido;
  }

  // ===== PROCESAR PAGO EN EFECTIVO =====
  
  async function procesarPagoEfectivo(pedido) {
    try {
      console.log('💵 Procesando pago en efectivo...');
      
      // Marcar el pedido como pagado en el backend
      await actualizarPedidoAPagado(pedido.idPedido);
      
      console.log('✅ Pedido confirmado');
      
      // Limpiar el carrito y el pedido en proceso
      localStorage.removeItem('carrito');
      localStorage.removeItem('pedidoEnProceso');
      window.dispatchEvent(new Event('storage')); // Actualizar contador del carrito

      // Mostrar mensaje de éxito
      alert(`¡Pedido confirmado!\n\nNúmero de pedido: ${pedido.idPedido}\nTotal: $${calcularTotal().toLocaleString('es-CL')}\n\nPagarás en efectivo al recibir tu pedido.`);

      // Ir a la página de inicio
      navigate('/inicio');
    } catch (error) {
      console.error('Error al procesar pago en efectivo:', error);
      alert('Hubo un error al confirmar el pedido.');
    }
  }

  // ===== PROCESAR PAGO CON MERCADO PAGO =====
  
  async function procesarPagoMercadoPago(pedido) {
    try {
      console.log('💳 Procesando pago con Mercado Pago...');
      
      // Crear la preferencia de pago en Mercado Pago
      const datosPreferencia = {
        idPedido: pedido.idPedido,
        montoPago: calcularTotal(),
        descripcion: `Pedido #${pedido.idPedido} - ${carrito.length} producto(s)`,
        emailPagador: formData.email,
        nombrePagador: formData.nombre
      };

      const preferenciaResponse = await crearPreferenciaPago(datosPreferencia);

      // Guardar info del pago pendiente
      localStorage.setItem('pedidoPendientePago', JSON.stringify({
        idPedido: pedido.idPedido,
        idPago: preferenciaResponse.idPago,
        timestamp: new Date().toISOString()
      }));

      // Redirigir al usuario a Mercado Pago para que pague
      if (preferenciaResponse.urlPago) {
        window.location.href = preferenciaResponse.urlPago;
      } else {
        throw new Error('No se recibió la URL de pago');
      }

    } catch (error) {
      console.error('Error al crear preferencia de Mercado Pago:', error);
      alert('Hubo un error al procesar el pago.');
    }
  }

  // ===== FUNCIÓN PRINCIPAL: CONFIRMAR PEDIDO =====
  // Esta función actualiza el pedido con los datos finales y procesa el pago
  
  async function handleConfirmarPedido(e) {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // 1. Validar que todos los campos estén correctos
    if (!validarFormulario()) {
      return;
    }

    setProcesandoPago(true); // Mostrar que está procesando

    try {
      // 2. Obtener el ID del pedido que ya se creó en el carrito
      const pedidoEnProceso = localStorage.getItem('pedidoEnProceso');
      if (!pedidoEnProceso) {
        throw new Error('No se encontró el pedido en proceso');
      }

      const { idPedido } = JSON.parse(pedidoEnProceso);
      console.log('📦 Actualizando pedido ID:', idPedido);

      // 3. Crear el objeto con los datos actualizados del pedido
      const pedidoActualizado = crearObjetoPedidoActualizado();

      console.log('📤 Enviando actualización al backend...');
      
      // 4. Enviar la actualización al backend
      // Nota: El backend debe manejar la actualización del pedido existente
      await crearPedido(pedidoActualizado);

      console.log('✅ Pedido actualizado en la BD');

      // 5. Procesar el pago según el método elegido
      if (metodoPago === 'efectivo') {
        // Si es efectivo, marcar como pagado y terminar
        await procesarPagoEfectivo({ idPedido });
      } else if (metodoPago === 'mercadopago') {
        // Si es Mercado Pago, redirigir a la plataforma de pago
        await procesarPagoMercadoPago({ idPedido });
      }

      // 6. Limpiar el pedido en proceso
      localStorage.removeItem('pedidoEnProceso');

    } catch (error) {
      console.error('Error al confirmar pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setProcesandoPago(false); // Ocultar el indicador de carga
    }
  }

  // ===== MOSTRAR PANTALLA DE CARGA =====
  
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

  // ===== RENDERIZADO DE LA INTERFAZ PRINCIPAL =====
  
  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <div className="container py-5">
          <h1 className="checkout-titulo">Finalizar Compra</h1>

          <div className="checkout-grid">
            {/* COLUMNA IZQUIERDA: FORMULARIO */}
            <div className="checkout-form-section">
              <form onSubmit={handleConfirmarPedido}>
                
                {/* SECCIÓN 1: TIPO DE PEDIDO */}
                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Tipo de Pedido</h3>
                  <div className="tipo-pedido-opciones">
                    {/* Opción Delivery */}
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

                    {/* Opción Retiro en tienda */}
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

                {/* SECCIÓN 2: INFORMACIÓN PERSONAL */}
                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Información Personal</h3>
                  <div className="form-grid">
                    {/* Campo Nombre */}
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

                    {/* Campo Teléfono */}
                    <div className="form-group">
                      <label>Teléfono *</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="9 dígitos"
                        maxLength="9"
                        required
                      />
                    </div>
                  </div>

                  {/* Mostrar el email (no editable) */}
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

                {/* SECCIÓN 3: DIRECCIÓN DE ENTREGA (solo si es delivery) */}
                {tipoPedido === 'delivery' && (
                  <div className="form-seccion">
                    <h3 className="form-seccion-titulo">Información de Entrega</h3>

                    {direcciones.length > 0 ? (
                      <>
                        {/* Selector de dirección */}
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
                        {/* Botón para agregar nueva dirección */}
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
                      /* Si no tiene direcciones guardadas */
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

                {/* SECCIÓN 4: MÉTODO DE PAGO */}
                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Método de Pago</h3>
                  
                  <div className="metodos-pago">
                    {/* Opción Efectivo */}
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

                    {/* Opción Mercado Pago */}
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

                  {/* Mostrar aviso si eligió Mercado Pago */}
                  {metodoPago === 'mercadopago' && (
                    <Alert variant="info" className="mt-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Serás redirigido a Mercado Pago para completar el pago de forma segura
                    </Alert>
                  )}
                </div>

                {/* SECCIÓN 5: TÉRMINOS Y CONDICIONES */}
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

                {/* BOTÓN FINAL: CONFIRMAR PEDIDO */}
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

            {/* COLUMNA DERECHA: RESUMEN DEL PEDIDO */}
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

      {/* MODAL PARA AGREGAR NUEVA DIRECCIÓN */}
      <Modal show={showModalDireccion} onHide={handleCerrarModalDireccion} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Dirección</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGuardarDireccion}>
            {/* Campo Ciudad */}
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

            {/* Campo Dirección */}
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

            {/* Campo Alias (opcional) */}
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

            {/* Botones del modal */}
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