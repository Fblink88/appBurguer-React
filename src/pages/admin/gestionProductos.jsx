import React, { useState,useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/gestionProd.css";
import { agregarProducto, eliminarProducto, listarProductos } from "../../data/metodosProducto";


function GestionProductos() {
  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };
 // Estado para productos (UI)
  const [productos, setProductos] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_producto: "",
    categoria_producto: "",
    precio_producto: "",
    descripcion_producto: "",
    stock_producto: "",
    imagen_producto: null,
  });

  // Cargar productos al iniciar
  useEffect(() => {
    setProductos(listarProductos());
  }, []);
// Manejo de formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

 const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Manejar la imagen (crear una URL temporal)
    let imageUrl = "/img/default.png"; // Imagen por defecto
    if (formData.imagen_producto) {
      imageUrl = URL.createObjectURL(formData.imagen_producto);
    }

    // 2. Preparar datos para agregar
    const dataParaAgregar = {
      nombre_producto: formData.nombre_producto,
      categoria_producto: formData.categoria_producto,
      precio_producto: formData.precio_producto,
      descripcion_producto: formData.descripcion_producto,
      stock_producto: formData.stock_producto,
      imagenSrc: imageUrl, // Aquí mapeamos la URL de la imagen
    };

    // 3. Agregar el producto a la DB , llamando al método
    agregarProducto(dataParaAgregar);

    // 4. ACTUALIZAR LA UI: Volver a listar todo
    
    setProductos(listarProductos());

    // 5. Limpiar formulario
    setFormData({
      nombre_producto: "",
      categoria_producto: "",
      precio_producto: "",
      descripcion_producto: "",
      stock_producto: "",
      imagen_producto: null,
    });
    
    // 6. Resetear el input de archivo en el DOM
    e.target.reset();
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      eliminarProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    }
  };


  return (
    <>  
    
    <section className="gestion-admin-layout">
      <Sidebar onLogoutAdmin={handleAdminLogout} />
      

      <main className="prod-admin-content">
        
          

          {/* Formulario */}
          <div className="form-container-producto">{/* Contenedor Principal */}

            <form className="form-producto" onSubmit={handleSubmit}>
              <h1 className="titulo-gp" >Gestión de Productos</h1>
              <label htmlFor="nombre_producto">Nombre</label>
              <input
                type="text"
                name="nombre_producto"
                placeholder="Nombre"
                value={formData.nombre_producto}
                onChange={handleChange}
                required
              />

              <label htmlFor="categoria_producto">Categoria</label>
              <input
                type="text"
                name="categoria_producto"
                placeholder="Categoria"
                value={formData.categoria_producto}
                onChange={handleChange}
                required
              />

              <label htmlFor="precio_producto">Precio</label>
              <input
                type="number"
                name="precio_producto"
                placeholder="Precio"
                value={formData.precio_producto}
                onChange={handleChange}
                required
              />

              <label htmlFor="descripcion_producto">Descripcion</label>
              <input
                type="text"
                name="descripcion_producto"
                placeholder="Descripcion"
                value={formData.descripcion_producto}
                onChange={handleChange}
                required
              />

              <label htmlFor="stock_producto">Stock</label>
              <input
                type="number"
                name="stock_producto"
                placeholder="Stock"
                value={formData.stock_producto}
                onChange={handleChange}
                required
              />

              <label htmlFor="imagen_producto">Imagen</label>
              <input
                type="file"
                name="imagen_producto"
                onChange={handleChange}
                required
              />

              <input
                className="btn-agregar"
                type="submit"
                value="Agregar Producto"
              />
            </form>
          </div>

          {/* Tabla de productos */}
          <table className="tabla-producto">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Descripcion</th>
                <th>Stock</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id}>
                  
                  <td data-label="Nombre">{prod.nombre_producto}</td>
                  <td data-label="Categoría">{prod.categoria_producto}</td>
                  <td data-label="Precio">${prod.precio_producto}</td>
                  <td data-label="Descripción">{prod.descripcion_producto}</td>
                  <td data-label="Stock">{prod.stock_producto}</td>
                  <td data-label="Imagen">
                    <img src={prod.imagenSrc} alt={prod.nombre_producto} width="50" />
                  </td>
                  <td data-label="Acciones">
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(prod.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </main>
    </section>
    </>
  );
}

export default GestionProductos;
