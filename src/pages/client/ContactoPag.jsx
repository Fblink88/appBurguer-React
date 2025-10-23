// --- COMPONENTES ---
import React, { useState } from 'react';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';

// 1. Importa Row y Col (¡Ya no necesitamos importar Card!)
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ContactoPag() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const handleChange = (event) => {
    // ... (tu función handleChange se queda igual)
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = (event) => {
    // ... (tu función handleSubmit se queda igual)
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      console.log("Formulario enviado:", formData);
      alert("¡Gracias por tu mensaje!");
    }
    setValidated(true);
  };

  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main>
        <div className="container my-5 py-5">
          <Row className="g-4">

            {/* --- COLUMNA IZQUIERDA (Información de Contacto) --- */}
            <Col md={5}>

              <div 
                className="h-100 shadow-lg p-4 text-light rounded" 
                style={{ backgroundColor: '#3a3c43' }}
              >
                {/* CAMBIO: Reemplazamos <Card.Body> por <div> */}
                <div className="text-center d-flex flex-column justify-content-center">
                  <h2 className="text-center mb-4" style={{ color: '#ffc107' }}>Información de Contacto</h2>
                  <ul className="list-unstyled">
                    <li className="mb-4 d-flex flex-column align-items-center">
                      <i className="bi bi-geo-alt-fill mb-2 fs-2"></i>
                      <span className="fs-5">Etchevers 210, Viña del Mar</span>
                    </li>
                    <li className="mb-4 d-flex flex-column align-items-center">
                      <i className="bi bi-telephone-fill mb-2 fs-2"></i>
                      <span className="fs-5">+569 71334173</span>
                    </li>
                    <li className="mb-4 d-flex flex-column align-items-center">
                      <i className="bi bi-envelope-fill mb-2 fs-2"></i>
                      <span className="fs-5">Goldenpagos2@gmail.com</span>
                    </li>
                    <li className="mt-4 d-flex gap-4 justify-content-center">
                      <a href="https://www.instagram.com/goldenburger.cl?igsh=MWt4bjUxbTY4N3lp" className="fs-3 text-light" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="https://www.facebook.com/?locale=es_LA" className="fs-3 text-light" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            {/* --- COLUMNA DERECHA (Formulario) --- */}
            <Col md={7}>
              {/* CAMBIO: Reemplazamos <Card> por <div> */}
              <div 
                className="shadow-lg p-4 text-light rounded" 
                style={{ backgroundColor: '#3a3c43' }}
              >
                {/* CAMBIO: Reemplazamos <Card.Body> por <div> */}
                <div>
                  <h2 className="text-center mb-4" style={{ color: '#ffc107' }}>Formulario de Contacto</h2>
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* El formulario no cambia en absoluto */}
                    <Form.Group className="mb-3" controlId="nombre">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        maxLength="100"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                      <Form.Text className="text-muted">{formData.nombre.length} / 100 caracteres</Form.Text>
                      <Form.Control.Feedback type="invalid">Debe ingresar un nombre (máx. 100 caracteres).</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="correo">
                      <Form.Label>Correo</Form.Label>
                      <Form.Control
                        type="email"
                        required
                        value={formData.correo}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">Ingrese un correo válido.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="comentario">
                      <Form.Label>Comentario</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required
                        maxLength="500"
                        value={formData.comentario}
                        onChange={handleChange}
                      />
                      <Form.Text className="text-muted">{formData.comentario.length} / 500 caracteres</Form.Text>
                      <Form.Control.Feedback type="invalid">Debe ingresar un comentario (máx. 500 caracteres).</Form.Control.Feedback>
                    </Form.Group>

                    <div className="text-center mt-4">
                      <Button type="submit" variant="warning" className="px-5">Enviar</Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>

          </Row>
        </div>
      </main>

      <FooterComp />
    </div>
  );
}

export default ContactoPag;