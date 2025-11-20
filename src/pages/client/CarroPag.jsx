// src/pages/client/CarroPag.jsx
// Página del carrito de compras
// Aquí el usuario ve los productos que agregó y puede proceder al pago

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import { crearPedido } from '../../services/pedidosService'; // Servicio para crear pedidos en la BD
import { obtenerClientePorUid } from '../../services/usuariosService'; // Servicio para obtener datos del cliente
import '../../styles/carrito.css';

function CarroPag() {
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const [carrito, setCarrito] = useState([]); // Estado que guarda los productos del carrito

  // useEffect se ejecuta cuando se carga la página
  // Carga el carrito desde localStorage (memoria del navegador)
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado)); // Convertir de texto a objeto JavaScript
    }
  }, []);

  // Cada vez que el carrito cambia, lo guardamos en localStorage
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito)); // Convertir objeto a texto para guardar
    } else {
      localStorage.removeItem('carrito'); // Si está vacío, lo borramos
    }
    // Avisar a otros componentes que el carrito cambió (para actualizar el contador en el header)
    window.dispatchEvent(new Event('storage'));
  }, [carrito]);

  // Función que calcula el subtotal (suma de precio x cantidad de cada producto)
  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Función que calcula el total (por ahora es igual al subtotal)
  const calcularTotal = () => {
    return calcularSubtotal();
  };

  // Función que calcula cuántos productos hay en total
  const calcularTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  // Función para aumentar la cantidad de un producto
  const aumentarCantidad = (itemId) => {
    setCarrito(carrito.map(item =>
      item.id === itemId 
        ? { ...item, cantidad: item.cantidad + 1 } // Si es el producto que queremos, le sumamos 1
        : item // Si no, lo dejamos igual
    ));
  };

  // Función para disminuir la cantidad de un producto
  const disminuirCantidad = (itemId) => {
    const item = carrito.find(i => i.id === itemId); // Buscar el producto
  
    if (item.cantidad === 1) {
      // Si solo hay 1, eliminamos el producto completo
      eliminarProducto(itemId);
    } else {
      // Si hay más de 1, solo restamos 1
      setCarrito(carrito.map(i =>
        i.id === itemId
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      ));
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (itemId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setCarrito(carrito.filter(item => item.id !== itemId)); // Quitar el producto del array
    }
  };

  // Función para vaciar todo el carrito
  const vaciarCarrito = () => {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      setCarrito([]); // Vaciar el array
      localStorage.removeItem('carrito'); // Borrar del localStorage
    }
  };

  // ⭐ FUNCIÓN PRINCIPAL: Proceder al pago
  // Esta función crea el pedido en la base de datos ANTES de ir al checkout
  const procederAlPago = async () => {
    // 1. Verificar que el carrito no esté vacío
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      // 2. Mostrar mensaje de carga en el botón
      const btnProceder = document.querySelector('.btn-proceder-pago');
      btnProceder.disabled = true; // Desactivar el botón para evitar doble clic
      btnProceder.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creando pedido...';

      // 3. Obtener el ID del usuario desde localStorage
      const firebaseUid = localStorage.getItem('userId');
      if (!firebaseUid) {
        alert('Debes iniciar sesión para continuar');
        navigate('/login');
        return;
      }

      // 4. Obtener los datos completos del cliente desde el backend
      console.log('🔍 Buscando datos del cliente...');
      const cliente = await obtenerClientePorUid(firebaseUid);
      console.log('✅ Cliente encontrado:', cliente);

      // 5. Crear el objeto del pedido para enviar al backend
      // Nota: Algunos datos son temporales y se actualizarán en el checkout
      const pedidoInicial = {
        idCliente: parseInt(cliente.idCliente), // ID del cliente (convertido a número)
        idEstadoPedido: 1, // Estado 1 = Pendiente
        idMetodoPago: 1, // Temporal (1=Efectivo), se actualiza en checkout
        idTipoEntrega: 1, // Temporal (1=Delivery), se actualiza en checkout
        montoSubtotal: parseFloat(calcularSubtotal()), // Subtotal convertido a número decimal
        montoEnvio: 0, // Por ahora 0, se calcula en checkout
        montoTotal: parseFloat(calcularTotal()), // Total convertido a número decimal
        fechaHoraPedido: new Date().toISOString(), // Fecha actual en formato ISO
        notasCliente: null, // Sin notas por ahora
        // Mapear cada producto del carrito a un detalle de pedido
        detalles: carrito.map(item => ({
          idProducto: parseInt(item.id), // ID del producto
          cantidad: parseInt(item.cantidad), // Cantidad
          precioUnitario: parseFloat(item.precio), // Precio por unidad
          subtotalLinea: parseFloat(item.precio * item.cantidad) // Subtotal de esta línea
        }))
      };

      console.log('📦 Pedido a crear:', pedidoInicial);

      // 6. Enviar el pedido al backend para guardarlo en Oracle
      const pedidoCreado = await crearPedido(pedidoInicial);
      
      console.log('✅ Pedido guardado en la base de datos con ID:', pedidoCreado.idPedido);

      // 7. Guardar el ID del pedido en localStorage para usarlo en el checkout
      localStorage.setItem('pedidoEnProceso', JSON.stringify({
        idPedido: pedidoCreado.idPedido,
        timestamp: new Date().toISOString()
      }));

      // 8. Redirigir al usuario a la página de checkout
      navigate('/checkout');

    } catch (error) {
      // Si algo sale mal, mostrar el error
      console.error('❌ Error al crear pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
      
      // Restaurar el botón a su estado original
      const btnProceder = document.querySelector('.btn-proceder-pago');
      if (btnProceder) {
        btnProceder.disabled = false;
        btnProceder.innerHTML = 'Proceder al Pago';
      }
    }
  };

  // ========================================
  // RENDERIZADO DE LA INTERFAZ
  // ========================================
  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <div className="container py-5">
          <h1 className="titulo-carrito">Mi Carrito de Compras</h1>

          {carrito.length === 0 ? (
            // ===== MOSTRAR CUANDO EL CARRITO ESTÁ VACÍO =====
            <div className="carrito-vacio">
              <div className="carrito-vacio-icono">
                <i className="bi bi-cart-x"></i>
              </div>
              <h3>Tu carrito está vacío</h3>
              <p>Añade algunos productos deliciosos desde nuestro catálogo.</p>
              <button 
                className="btn-ver-catalogo"
                onClick={() => navigate('/catalogo')}
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            // ===== MOSTRAR CUANDO HAY PRODUCTOS EN EL CARRITO =====
            <div className="carrito-contenido">
              
              {/* LISTA DE PRODUCTOS */}
              <div className="carrito-productos">
                <div className="carrito-header">
                  <h2>Productos ({calcularTotalItems()})</h2>
                  <button 
                    className="btn-vaciar-carrito"
                    onClick={vaciarCarrito}
                  >
                    <i className="bi bi-trash"></i> Vaciar carrito
                  </button>
                </div>

                {/* Recorrer cada producto del carrito y mostrarlo */}
                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item"> 
                    
                    {/* Imagen del producto */}
                    <div 
                      className="carrito-item-imagen"
                      style={{ backgroundImage: `url(${item.imagen})` }}
                    />

                    {/* Información del producto */}
                    <div className="carrito-item-info">
                      <h3 className="carrito-item-nombre">{item.nombre}</h3>
                      <p className="carrito-item-descripcion">{item.descripcion}</p>
                      {item.size && (
                        <span className="carrito-item-size">Tamaño: {item.size}</span>
                      )}
                    </div>

                    {/* Precio unitario */}
                    <div className="carrito-item-precio">
                      <span className="precio-label">Precio</span> 
                      <span className="precio-valor">
                        ${item.precio.toLocaleString('es-CL')}
                      </span>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="carrito-item-cantidad">
                      <span className="cantidad-label">Cantidad</span>
                      <div className="cantidad-controles">
                        <button 
                          className="btn-cantidad"
                          onClick={() => disminuirCantidad(item.id)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="cantidad-numero">{item.cantidad}</span>
                        <button 
                          className="btn-cantidad"
                          onClick={() => aumentarCantidad(item.id)}
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal de esta línea */}
                    <div className="carrito-item-subtotal">
                      <span className="subtotal-label">Subtotal</span>
                      <span className="subtotal-valor">
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </span>
                    </div>

                    {/* Botón para eliminar el producto */}
                    <button 
                      className="btn-eliminar-item"
                      onClick={() => eliminarProducto(item.id)}
                      title="Eliminar producto"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* RESUMEN DEL PEDIDO */}
              <div className="carrito-resumen">
                <div className="resumen-card">
                  <h2 className="resumen-titulo">Resumen del Pedido</h2>
                  
                  <div className="resumen-linea">
                    <span>Subtotal:</span>
                    <span>${calcularSubtotal().toLocaleString('es-CL')}</span>
                  </div>

                  <div className="resumen-linea">
                    <span>Envío:</span>
                    <span className="text-success">Se calcula en checkout</span>
                  </div>

                  <hr className="resumen-separador" />

                  <div className="resumen-total">
                    <span>Total:</span>
                    <span className="total-valor">
                      ${calcularTotal().toLocaleString('es-CL')}
                    </span>
                  </div>

                  {/* BOTÓN PRINCIPAL: Proceder al Pago */}
                  {/* Al hacer clic, se crea el pedido en la BD y se va al checkout */}
                  <button 
                    className="btn-proceder-pago"
                    onClick={procederAlPago}
                  >
                    Proceder al Pago
                  </button>

                  <button 
                    className="btn-seguir-comprando" 
                    onClick={() => navigate('/catalogo')}
                  >
                    <i className="bi bi-arrow-left"></i> 
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterComp />
    </div>
  );
}

export default CarroPag;