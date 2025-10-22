import { Route, Routes } from 'react-router-dom'
import InicioPag from './pages/client/InicioPag';
import CatalogoPag from './pages/client/CatalogoPag';
import NosotrosPag from './pages/client/NosotrosPag';
import ContactoPag from './pages/client/ContactoPag';
import Login from './pages/client/Login';

import Dashboard from './pages/admin/dashboard';
import GestionPedidos from './pages/admin/gestionPedidos';
import GestionProductos from './pages/admin/gestionProductos';
import GestionUsuarios from './pages/admin/gestionUsuarios';
import NuevoUsuario from './pages/admin/nuevoUsuario';

import CarroPag from './pages/client/CarroPag';





//import viteLogo from '/vite.svg'
//import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  
  return (
    
    
    <div className="App">
      
      <Routes>

        <Route path="/" element={<InicioPag />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<InicioPag />} />
        <Route path="/catalogo" element={<CatalogoPag />} />
        <Route path="/nosotros" element={<NosotrosPag />} />
        <Route path="/contacto" element={<ContactoPag />} />
       

         <Route path="/carrito" element={<CarroPag />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/gestion-pedidos" element={<GestionPedidos />} />
        <Route path="/admin/gestion-productos" element={<GestionProductos />} />
        <Route path="/admin/gestion-usuarios" element={<GestionUsuarios />} />  

        <Route path="/admin/usuarios/nuevo" element={<NuevoUsuario />} />


        
              
      </Routes>
    </div>

  );
}

export default App
