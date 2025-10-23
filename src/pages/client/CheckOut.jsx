// src/pages/client/CheckoutPag.jsx

import React, { useState, useEffect } from 'react'; //se usa useState para manejar el estado del formulario y useEffect para cargar el carrito desde el localStorage cuando el componente se arma
import { useNavigate } from 'react-router-dom'; //Se usa para la navegación programática entre páginas
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import '../../styles/checkout.css';


function CheckoutPag() {// Componente principal de la página de checkout
  const navigate = useNavigate(); // Hook para la navegación programática , el hook es parte de react-router-dom, permite redirigir al usuario a diferentes rutas dentro de la aplicación
  const [carrito, setCarrito] = useState([]); // si no se pone el useState el carrito sería constante y no se podría modificar
  const [tipoPedido, setTipoPedido] = useState('delivery'); // Estado para el tipo de pedido (delivery o retiro), es necesario para manejar la lógica del formulario
  const [metodoPago, setMetodoPago] = useState('efectivo'); // Estado para el método de pago (efectivo, webpay, mercadopago).
  const [aceptaTerminos, setAceptaTerminos] = useState(false); // Estado para el checkbox de aceptación de términos y condiciones.
  //en todos los estados es false al inicio porque no hay nada seleccionado y true cuando el usuario selecciona alguna opción
  
  const [formData, setFormData] = useState({ // Estado para los datos del formulario de checkout 
  // y se inicializa con campos vacíos, se usa para almacenar la información que el usuario ingresa en el formulario
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  });

  useEffect(() => { // Hook que se ejecuta cuando se carga la página o se refresca
    const carritoGuardado = localStorage.getItem('carrito');//si se ejecuta, obtiene el carrito guardado en el localStorage del navegador
    if (carritoGuardado) { //si hay un carrito guardado
      const carritoParseado = JSON.parse(carritoGuardado); // Parse convierte el string JSON en un objeto JavaScript, se guarda en la constante carritoParseado
      if (carritoParseado.length === 0) { //si el carrito está vacío
        navigate('/catalogo');// redirige al usuario a la página del catálogo
      }
      setCarrito(carritoParseado); //si el carrito no está vacío, actualiza el estado del carrito con los datos obtenidos del localStorage
    } else {
      navigate('/catalogo');// si no hay carrito guardado, redirige al usuario al catálogo
    }
  }, [navigate]); // este efecto solo se ejecuta una vez al cargar la página y no depende de ningún otro estado. el componete se carga una sola vez cuando el usuario entra a la página de checkout

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calcularDelivery = () => {
    return tipoPedido === 'delivery' ? 2990 : 0;// si el tipo de pedido es delivery, se cobra 2500, si es retiro en tienda, no se cobra nada
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularDelivery();
  };
  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e) => { // e es el evento que se genera al cambiar un campo del formulario
    const { name, value } = e.target;// obtiene el nombre y valor del campo que se está modificando.
    setFormData({// actualiza el estado del formulario con el nuevo valor
      ...formData,//Se usa para mantener los valores actuales del formulario y solo actualizar el campo que ha cambiado
      [name]: value// Se usa para actualizar dinámicamente el campo correspondiente en el estado del formulario
    });
  };

  const validarFormulario = () => { // Función para validar los campos del formulario antes de confirmar el pedido
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;// Expresión regular básica para validar el formato del email
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido');
      return false;
    }

    if (tipoPedido === 'delivery') {// Si el tipo de pedido es delivery, se validan los campos de dirección y ciudad
      if (!formData.direccion.trim()) {//trim hace que se eliminen los espacios en blanco al inicio y al final del string, por ejemplo "  hola  " se convierte en "hola"
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
//  para manejar la confirmación del pedido
  const handleConfirmarPedido = (e) => { 
    e.preventDefault(); 

    if (!validarFormulario()) {
      return;
    }

    const pedido = { // Crea un objeto con los detalles del pedido , se activa cuando el usuario confirma el pedido en el carrito y se muestra un mensaje de confirmación
      id: Date.now(), // Usa la fecha y hora actual como ID único del pedido
      fecha: new Date().toISOString(), // Fecha y hora del pedido en formato ISO que es estándar y fácil de manejar, palabra reservada de JavaScript
      cliente: formData, // Información del cliente que viene del formulario
      productos: carrito,
      tipoPedido: tipoPedido,
      metodoPago: metodoPago,
      subtotal: calcularSubtotal(), 
      delivery: calcularDelivery(),
      total: calcularTotal()
    };
    // se genera un mensaje de confirmación con los detalles del pedido
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');// Obtiene los pedidos guardados en el localStorage o un array vacío si no hay ninguno
    pedidosGuardados.push(pedido);  //push agrega el nuevo pedido al array de pedidos guardados
    localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));// Guarda el array actualizado de pedidos en el localStorage y convierte el array en un string JSON para almacenarlo correctamente

    localStorage.removeItem('carrito');// Limpia el carrito del localStorage ya que el pedido ha sido confirmado
    window.dispatchEvent(new Event('storage'));// dispatchEvent se usa para notificar a otros componentes que el carrito ha cambiado, 
    // esto es muy útil si hay otros componentes que dependen del estado del carrito,, por ejemplo el icono del carrito en el header si está vacío o no

    alert(`¡Pedido confirmado!\n\nNúmero de pedido: ${pedido.id}\nTotal: $${pedido.total.toLocaleString('es-CL')}\n\nTe enviaremos un email de confirmación.`); //Se genera el mensaje solo si se confirma el pedido

    navigate('/inicio'); // Redirige al usuario a la página de inicio después de confirmar el pedido
  };
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
                        value={formData.direccion} // valor del campo dirección, que viene del estado formData
                        onChange={handleInputChange} // si el tipo de pedido es delivery, se muestran estos campos adicionales
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Ciudad *</label>
                        <input
                          type="text"
                          name="ciudad"
                          value={formData.ciudad} // almacena el valor del campo ciudad
                          onChange={handleInputChange} // maneja los cambios en el campo ciudad
                          required // campo obligatorio
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
                        <small>Pago 100% seguro y eficaz </small>
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
                        <small>Disponible en todo Latinoamerica</small>
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