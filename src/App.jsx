import { Route, Routes } from 'react-router-dom'
import InicioPag from './pages/client/InicioPag';
import CatalogoPag from './pages/client/CatalogoPag';
import NosotrosPag from './pages/client/NosotrosPag';
import ContactoPag from './pages/client/ContactoPag';


//import viteLogo from '/vite.svg'
//import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  
  return (
    
    
    <div className="App">
      
      <Routes>
        <Route path="/" element={<InicioPag />} />  
        <Route path="/inicio" element={<InicioPag />} />
        <Route path="/catalogo" element={<CatalogoPag />} />
        <Route path="/nosotros" element={<NosotrosPag />} />
        <Route path="/contacto" element={<ContactoPag />} />
        
        
      </Routes>
    </div>

  );
}

export default App
