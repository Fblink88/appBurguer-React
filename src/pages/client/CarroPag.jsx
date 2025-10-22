// src/pages/client/CarroPag.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import '../../styles/carrito.css';

function CarroPag() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
      window.dispatchEvent(new Event('storage'));
    }
  }, [carrito]);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal();
  };

  const aumentarCantidad = (itemId) => {
    setCarrito(carrito.map(item =>
      item.id === itemId
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ));
  };

  const disminuirCantidad = (itemId) => {
    setCarrito(carrito.map(item =>
      item.id === itemId && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ));
  };

  const eliminarProducto = (itemId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setCarrito(carrito.filter(item => item.id !== itemId));
    }
  };

  const vaciarCarrito = () => {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      setCarrito([]);
      localStorage.removeItem('carrito');
    }
  };

  const procederAlPago = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <div className="container py-5">
          <h1 className="titulo-carrito">Mi Carrito de Compras</h1>

          {carrito.length === 0 ? (
            // CARRITO VACÍO
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
            // CARRITO CON PRODUCTOS
            <div className="carrito-contenido">
              
              {/* LISTA DE PRODUCTOS */}
              <div className="carrito-productos">
                <div className="carrito-header">
                  <h2>Productos ({carrito.length})</h2>
                  <button 
                    className="btn-vaciar-carrito"
                    onClick={vaciarCarrito}
                  >
                    <i className="bi bi-trash"></i> Vaciar carrito
                  </button>
                </div>

                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item">
                    
                    <div 
                      className="carrito-item-imagen"
                      style={{ backgroundImage: `url(${item.imagen})` }}
                    />

                    <div className="carrito-item-info">
                      <h3 className="carrito-item-nombre">{item.nombre}</h3>
                      <p className="carrito-item-descripcion">{item.descripcion}</p>
                      {item.size && (
                        <span className="carrito-item-size">Tamaño: {item.size}</span>
                      )}
                    </div>

                    <div className="carrito-item-precio">
                      <span className="precio-label">Precio</span>
                      <span className="precio-valor">
                        ${item.precio.toLocaleString('es-CL')}
                      </span>
                    </div>

                    <div className="carrito-item-cantidad">
                      <span className="cantidad-label">Cantidad</span>
                      <div className="cantidad-controles">
                        <button 
                          className="btn-cantidad"
                          onClick={() => disminuirCantidad(item.id)}
                          disabled={item.cantidad <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="cantidad-numero">{item.cantidad}</span>
                        <button 
                          className="btn-cantidad"
                          onClick={() => aumentarCantidad(item.id)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="carrito-item-subtotal">
                      <span className="subtotal-label">Subtotal</span>
                      <span className="subtotal-valor">
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </span>
                    </div>

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
                    <span className="text-success">Gratis</span>
                  </div>

                  <hr className="resumen-separador" />

                  <div className="resumen-total">
                    <span>Total:</span>
                    <span className="total-valor">
                      ${calcularTotal().toLocaleString('es-CL')}
                    </span>
                  </div>

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
                    <i className="bi bi-arrow-left"></i> Seguir Comprando
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
