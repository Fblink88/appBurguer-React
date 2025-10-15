import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/Login.css'

function Login() {
  







  return (
    <>
    <body className='body-login'>
    
      <div className="form-container register-container">
        <form id="registerForm">
          <h1>Regístrate aquí</h1>
          <input type="text" placeholder="Nombre" id="register-nombre" required />
          <input type="email" placeholder="Email" id="register-email" required />
          <input type="password" placeholder="Contraseña" id="register-password" minLength="4" maxLength="10" required />

          <button type="submit" className="btn-register">Regístrate</button>
          <span>o usa tu cuenta</span>
          <div className="social-container">
            <a href="#" className="social"><i className="bi bi-google"></i></a>
            <a href="#" className="social"><i className="bi bi-facebook"></i></a>
            <a href="#" className="social"><i className="bi bi-instagram"></i></a>
          </div>

        </form>
      </div>
      <div className="form-container login-container">
        <form id="loginForm" >
          <h1>Iniciar Sesión</h1>
          <input type="email" placeholder="Email" id="email" required />
          <input type="password" placeholder="Contraseña" id="password" required />
          <div className="content">
            <div className="checkbox">
              <input type="checkbox" name="checkbox" id="checkbox" />
              <label>Recordar</label>
            </div>
            <div className="pass-link">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
          <button type="submit" className="btn-register">Iniciar Sesión</button>
          <span>o usa tu cuenta</span>
          <div className="social-container">
            <a href="#" className="social"><i className="bi bi-google"></i></a>
            <a href="#" className="social"><i className="bi bi-facebook"></i></a>
            <a href="#" className="social"><i className="bi bi-instagram"></i></a>
          </div>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="title">Bienvenido a <br /> Golden Burger</h1>
            <p>Las mejores hamburguesas de la quinta región.</p>
            <button className="ghost" id="login">
              Iniciar Sesión
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="title">Comienza <br /> Registrándote</h1>
            <p>Obtén un 10% de descuento en tu primera compra al registrarte.</p>
            <button className="ghost" id="register" >
              Registro
            </button>
          </div>
        </div>
      </div>


    </body>
    </>
  )
}

export default Login