import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/gestionProd.css";
import * as productosService from "../../services/productosService";

function GestionProductos() {
  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };

  // Estado para productos (UI)
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    idCategoria: "",
    precio: "",
    descripcion: "",
    imagen: "",
    disponible: true, // true = Disponible, false = No disponible
  });

  // Estado para la imagen
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Estado para edición
  const [productoEditando, setProductoEditando] = useState(null);

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productosService.obtenerTodosProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejo de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let productoResultado = null;
    let imagenSubidaExitosamente = false;

    try {
      setLoading(true);

      // PASO 1: Preparar datos del producto
      const productoData = {
        nombre: formData.nombre,
        idCategoria: parseInt(formData.idCategoria),
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        disponible: formData.disponible === true || formData.disponible === 'true',
      };

      // PASO 2: Crear o Actualizar producto
      if (productoEditando) {
        // MODO EDICIÓN: Actualizar producto existente
        const idProducto = productoEditando.idProducto || productoEditando.id;

        // Si no hay nueva imagen, mantener la anterior
        if (!imagenFile) {
          productoData.imagen = formData.imagen;
        }

        productoResultado = await productosService.actualizarProducto(idProducto, productoData);
        console.log("✅ Producto actualizado:", productoResultado);
      } else {
        // MODO CREACIÓN: Crear nuevo producto
        productoData.imagen = ""; // Se subirá después
        productoResultado = await productosService.crearProducto(productoData);
        console.log("✅ Producto creado:", productoResultado);
      }

      // PASO 3: Si hay una imagen nueva, intentar subirla a Firebase
      const idProducto = productoResultado.idProducto || productoResultado.id;
      if (imagenFile && idProducto) {
        try {
          console.log("📤 Subiendo imagen a Firebase...");
          const resultado = await productosService.subirImagenProducto(idProducto, imagenFile);
          console.log("✅ Imagen subida:", resultado.imageUrl);
          imagenSubidaExitosamente = true;
        } catch (imagenError) {
          console.error("⚠️ Error al subir imagen:", imagenError);
          alert(`Producto guardado exitosamente, pero hubo un error al subir la imagen.\nPuedes editarlo después para agregar la imagen.\n\nError: ${imagenError.response?.data?.message || imagenError.message}`);
        }
      }

      // PASO 4: Recargar la lista de productos
      await cargarProductos();

      // PASO 5: Limpiar formulario y estado de edición
      handleCancelarEdicion();

      // Resetear el input de archivo
      e.target.reset();

      // Mensaje de éxito
      const accion = productoEditando ? "actualizado" : "agregado";
      if (imagenSubidaExitosamente || !imagenFile) {
        alert(`Producto ${accion} exitosamente`);
      }
    } catch (error) {
      const accion = productoEditando ? "actualizar" : "agregar";
      console.error(`❌ Error al ${accion} producto:`, error);
      alert(`Error al ${accion} producto: ` + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        setLoading(true);
        console.log('🗑️ Eliminando producto ID:', id);
        await productosService.eliminarProducto(id);
        // Filtrar por idProducto o id (para compatibilidad)
        setProductos(prev => prev.filter(p => (p.idProducto || p.id) !== id));
        alert("Producto eliminado exitosamente");
      } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        alert("Error al eliminar producto: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para editar producto (cargar datos en el formulario)
  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombreProducto || producto.nombre || "",
      idCategoria: producto.idCategoria?.toString() || "",
      precio: (producto.precioBase || producto.precio)?.toString() || "",
      descripcion: producto.descripcion || "",
      imagen: producto.imagen || "",
      disponible: producto.disponible ?? true,
    });
    setImagenPreview(producto.imagen || null);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para cancelar edición
  const handleCancelarEdicion = () => {
    setProductoEditando(null);
    setFormData({
      nombre: "",
      idCategoria: "",
      precio: "",
      descripcion: "",
      imagen: "",
      disponible: true,
    });
    setImagenFile(null);
    setImagenPreview(null);
  };


  return (
    <>

      <section className="gestion-admin-layout">
        <Sidebar onLogoutAdmin={handleAdminLogout} />


        <main className="prod-admin-content">



          {/* Formulario */}
          <div className="form-container-producto">{/* Contenedor Principal */}

            <form className="form-producto" onSubmit={handleSubmit}>
              <h1 className="titulo-gp">
                {productoEditando ? 'Editar Producto' : 'Gestión de Productos'}
              </h1>
              {productoEditando && (
                <p style={{ color: '#ffc107', marginBottom: '15px' }}>
                  <strong>Editando:</strong> {productoEditando.nombreProducto || productoEditando.nombre}
                </p>
              )}

              <label htmlFor="nombre">Nombre del Producto</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <label htmlFor="idCategoria">Categoría</label>
              <select
                id="idCategoria"
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="1">Hamburguesas</option>
                <option value="2">Bebidas</option>
                <option value="3">Acompañamientos</option>
                <option value="4">Postres</option>
                <option value="5">Combos</option>
              </select>

              <label htmlFor="precio">Precio</label>
              <input
                id="precio"
                type="text"
                name="precio"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />

              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción del producto"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                required
              />

              <label htmlFor="imagenFile">Imagen del Producto</label>
              <input
                id="imagenFile"
                type="file"
                name="imagenFile"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagenPreview && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      border: '2px solid #ffcc00'
                    }}
                  />
                </div>
              )}

              <label htmlFor="disponible">Disponibilidad</label>
              <select
                id="disponible"
                name="disponible"
                value={formData.disponible}
                onChange={handleChange}
                required
              >
                <option value={true}>Disponible</option>
                <option value={false}>No disponible</option>
              </select>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  className="btn-agregar"
                  type="submit"
                  value={loading ? "Guardando..." : (productoEditando ? "Actualizar Producto" : "Agregar Producto")}
                  disabled={loading}
                  style={{ flex: productoEditando ? '1' : 'auto' }}
                />
                {productoEditando && (
                  <button
                    type="button"
                    className="btn-eliminar"
                    onClick={handleCancelarEdicion}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
          {/* Tabla de productos */}
          <table className="tabla-producto">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Imagen</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>Cargando productos...</td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No hay productos registrados</td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.idProducto || prod.id}>
                    <td data-label="ID">{prod.idProducto || prod.id}</td>
                    <td data-label="Nombre">{prod.nombreProducto || prod.nombre}</td>
                    <td data-label="Categoría">
                      {prod.idCategoria === 1 ? 'Hamburguesas' :
                        prod.idCategoria === 2 ? 'Bebidas' :
                          prod.idCategoria === 3 ? 'Acompañamientos' :
                            prod.idCategoria === 4 ? 'Postres' :
                              prod.idCategoria === 5 ? 'Combos' :
                                prod.categoria || `Categoría ${prod.idCategoria}`}
                    </td>
                    <td data-label="Precio">${prod.precioBase || prod.precio}</td>
                    <td data-label="Descripción">{prod.descripcion}</td>

                    <td data-label="Imagen">
                      {prod.imagen ? (
                        <img src={prod.imagen} alt={prod.nombreProducto || prod.nombre} width="50" />
                      ) : (
                        <span>Sin imagen</span>
                      )}
                    </td>
                    <td data-label="Disponible">
                      <span style={{
                        color: prod.disponible ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}>
                        {prod.disponible ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                          className="btn-agregar"
                          onClick={() => handleEditar(prod)}
                          disabled={loading}
                          style={{ fontSize: '0.85em', padding: '6px 12px', minWidth: '70px' }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleEliminar(prod.idProducto || prod.id)}
                          disabled={loading}
                          style={{ fontSize: '0.85em', padding: '6px 12px', minWidth: '70px' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </section>
    </>
  );
}

export default GestionProductos;
