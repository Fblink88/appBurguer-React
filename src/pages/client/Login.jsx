import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/login2.css';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const navigate = useNavigate();


  // --- Usuarios ---
  const [usuarios, setUsuarios] = useState(() => {
    const stored = localStorage.getItem("usuarios");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // --- Login ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const usuarioValido = usuarios.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );

    if (usuarioValido) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", usuarioValido.nombre);

      if (usuarioValido.email === "admin@profesor.duocuc.cl") {
        navigate("/admin/dashboard");
      } else {
        navigate("/inicio");
      }
    } else {
      alert("Email o contraseña incorrectos");
    }
  };

  // --- Registro ---
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const emailValido =
      registerEmail.endsWith("@duocuc.cl") ||
      registerEmail.endsWith("@profesor.duocuc.cl") ||
      registerEmail.endsWith("@gmail.com");

    if (!emailValido) {
      alert("El correo debe tener un dominio válido: @duocuc.cl, @profesor.duocuc.cl o @gmail.com");
      return;
    }

    if (usuarios.some((u) => u.email === registerEmail)) {
      alert("Este email ya está registrado.");
      return;
    }

    const newUser = {
      nombre: registerName,
      email: registerEmail,
      password: registerPassword,
    };

    setUsuarios([...usuarios, newUser]);
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setIsRegisterActive(false);
  };

  return (
    <main className='login-page-container'>
      <div className="login-wrapper">
        <a
          href="#" id="close-login" className="close-button" onClick={(e) => {
            e.preventDefault(); // evita el comportamiento por defecto del href
            navigate("/");       // redirige al inicio
          }}
        >
          <i className="bi bi-x-lg"></i>
        </a>
      



        {/* 👇 Clase dinámica para el panel */}
        <div className={`container ${isRegisterActive ? 'right-panel-active' : ''}`} id="container">

          {/* FORMULARIO REGISTRO */}
          <div className="form-container register-container">
            <form onSubmit={handleRegisterSubmit}>
              <h1>Regístrate aquí</h1>
              <input type="text" placeholder="Nombre" value={registerName}
                onChange={(e) => setRegisterName(e.target.value)} required />
              <input type="email" placeholder="Email" value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)} required />
              <input type="password" placeholder="Contraseña" value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} minLength="4" maxLength="10" required />
              <button type="submit" className="btn-register">Regístrate</button>
            </form>
          </div>

          {/* FORMULARIO LOGIN */}
          <div className="form-container login-container">
            <form onSubmit={handleLoginSubmit}>
              <h1>Iniciar Sesión</h1>
              <input type="email" placeholder="Email" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)} required />
              <input type="password" placeholder="Contraseña" value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)} required />
              <button type="submit" className="btn-register">Iniciar Sesión</button>
            </form>
          </div>

          {/* PANEL ANIMADO */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="title">Bienvenido a <br /> Golden Burger</h1>
                <p>Las mejores hamburguesas de la quinta región.</p>
                <button className="ghost" onClick={() => setIsRegisterActive(false)} id="login">Iniciar Sesión</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="title">Comienza <br /> Registrándote</h1>
                <p>Obtén un 10% de descuento en tu primera compra al registrarte.</p>
                <button className="ghost" onClick={() => setIsRegisterActive(true)} id="register">Registro</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
