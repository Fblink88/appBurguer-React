import React, { useState } from 'react';

// --- COMPONENTES ---
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';

// 1. Importa Row y Col de React-Bootstrap para el grid
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
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
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = (event) => {
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
          {/* 2. Usamos <Row> para crear la fila de dos columnas */}
          {/* 'g-4' añade un espacio entre las columnas */}
          <Row className="g-4">

            {/* --- COLUMNA IZQUIERDA (Información de Contacto) --- */}
            {/* md={5} significa que en pantallas medianas o más grandes, ocupará 5 de 12 columnas */}
            <Col md={5}>
              <Card bg="dark" text="light" className="h-100 shadow-lg p-4" style={{ backgroundColor: '#3a4343' }}>
                {/* CAMBIO: Añadimos 'text-center' para centrar todo el contenido del cuerpo de la tarjeta */}
                <Card.Body className="text-center d-flex flex-column justify-content-center">
                  <h2 className="text-center mb-4" style={{ color: '#ffc107' }}>Información de Contacto</h2>
                  <ul className="list-unstyled">
                  
                    {/* CAMBIO: Se modifica cada <li> para apilar y centrar el ícono y el texto */}
                    <li className="mb-4 d-flex flex-column align-items-center">
                      {/* Ícono más grande (fs-2) y con margen inferior (mb-2) */}
                      <i className="bi bi-geo-alt-fill mb-2 fs-2"></i>
                      {/* Texto más grande (fs-5) */}
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
                      {/* Íconos sociales más grandes (fs-3) */}
                      <a href="https://www.instagram.com/goldenburger.cl?igsh=MWt4bjUxbTY4N3lp" className="fs-3 text-light" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="https://www.facebook.com/?locale=es_LA" className="fs-3 text-light" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i>
                      </a>
                    </li>

                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* --- COLUMNA DERECHA (Formulario) --- */}
            {/* md={7} significa que ocupará las 7 columnas restantes */}
            <Col md={7}>
              <Card bg="dark" text="light" className="shadow-lg p-4" style={{ backgroundColor: '#3a3c43' }}>
                <Card.Body>
                  <h2 className="text-center mb-4" style={{ color: '#ffc107' }}>Formulario de Contacto</h2>
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* El contenido del formulario se queda exactamente igual */}
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
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </div>
      </main>

      <FooterComp />
    </div>
  );
}

export default ContactoPag;
