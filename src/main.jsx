// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
=======
import 'bootstrap-icons/font/bootstrap-icons.css';  // Importar iconos CSS de Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css'; 
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
import './index.css'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);