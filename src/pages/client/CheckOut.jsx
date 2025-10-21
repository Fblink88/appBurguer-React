// src/pages/client/CheckoutPag.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import '../../styles/checkout.css';

function CheckoutPag() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [tipoPedido, setTipoPedido] = useState('delivery');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  });

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const carritoParseado = JSON.parse(carritoGuardado);
      if (carritoParseado.length === 0) {
        navigate('/catalogo');
      }
      setCarrito(carritoParseado);
    } else {
      navigate('/catalogo');
    }
  }, [navigate]);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calcularDelivery = () => {
    return tipoPedido === 'delivery' ? 2990 : 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularDelivery();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa tu nombre');
      return false;
    }
    if (!formData.apellido.trim()) {
      alert('Por favor ingresa tu apellido');
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
      if (!formData.direccion.trim()) {
        alert('Por favor ingresa tu dirección de entrega');
        return false;
      }
      if (!formData.ciudad.trim()) {
        alert('Por favor ingresa tu ciudad');
        return false;
      }
    }

    if (!aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleConfirmarPedido = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const pedido = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      cliente: formData,
      productos: carrito,
      tipoPedido: tipoPedido,
      metodoPago: metodoPago,
      subtotal: calcularSubtotal(),
      delivery: calcularDelivery(),
      total: calcularTotal()
    };

    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
    pedidosGuardados.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));

    localStorage.removeItem('carrito');
    window.dispatchEvent(new Event('storage'));

    alert(`¡Pedido confirmado!\n\nNúmero de pedido: ${pedido.id}\nTotal: $${pedido.total.toLocaleString('es-CL')}\n\nTe enviaremos un email de confirmación.`);

    navigate('/inicio');
  };

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
                        <span className="opcion-titulo">Delivery a domicilio</span>
                        <span className="opcion-precio">+$2.990</span>
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
                        <span className="opcion-precio">Gratuito</span>
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
                      <label>Apellido *</label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Teléfono *</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {tipoPedido === 'delivery' && (
                  <div className="form-seccion">
                    <h3 className="form-seccion-titulo">Información de Entrega</h3>
                    <div className="form-group">
                      <label>Dirección de Entrega *</label>
                      <input
                        type="text"
                        name="direccion"
                        placeholder="Calle, número, comuna"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Ciudad *</label>
                        <input
                          type="text"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Código Postal</label>
                        <input
                          type="text"
                          name="codigoPostal"
                          value={formData.codigoPostal}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-seccion">
                  <h3 className="form-seccion-titulo">Método de Pago</h3>
                  <p className="form-seccion-subtitulo">Pago Rápido</p>

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
                        <span>Efectivo (pago contra entrega)</span>
                      </div>
                    </label>

                    <label className={`metodo-pago ${metodoPago === 'webpay' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="webpay"
                        checked={metodoPago === 'webpay'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <i className="bi bi-credit-card"></i>
                        <span>Transbank Webpay</span>
                        <small>Pago seguro con iFrame Integrado - PCI DSS Compliant</small>
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
                        <small>Múltiples opciones: tarjetas, efectivo, transferencias</small>
                      </div>
                    </label>

                    <label className={`metodo-pago ${metodoPago === 'stripe' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="metodoPago"
                        value="stripe"
                        checked={metodoPago === 'stripe'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="metodo-info">
                        <i className="bi bi-stripe"></i>
                        <span>Stripe Elements</span>
                        <small>Pago internacional con tokenización automática</small>
                      </div>
                    </label>
                  </div>
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

                <button type="submit" className="btn-confirmar-pedido">
                  Confirmar Pedido
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
    </div>
  );
}

export default CheckoutPag;