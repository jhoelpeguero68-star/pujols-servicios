// PUJOLS Servicios - Módulo de Autenticación y Pantalla de Login Demostrativa
// Diseñada exactamente según la pantalla "Pantalla de inicio / Login" del mockup

const AuthModule = {
  isLoggedIn() {
    return localStorage.getItem('pujols_logged_in') === 'true';
  },

  renderLoginScreen(container) {
    container.innerHTML = `
      <div class="login-wrapper">
        <div class="login-card">
          <!-- Logo Oficial PUJOLS Servicios -->
          <div class="login-logo-container">
            <img src="assets/logo.jpg" alt="PUJOLS Servicios" class="login-logo-img">
          </div>

          <div class="login-slogan">
            Servicio confiable, equipos en buenas manos.
          </div>

          <!-- Formulario de Acceso -->
          <form id="loginForm" onsubmit="AuthModule.handleLogin(event)" style="width: 100%;">
            <div class="login-input-group">
              <span class="login-input-icon icon">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </span>
              <input
                type="text"
                id="loginUser"
                class="login-input"
                placeholder="Correo electrónico o usuario"
                value=""
                required
              >
            </div>

            <div class="login-input-group">
              <span class="login-input-icon icon">
                <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </span>
              <input
                type="password"
                id="loginPass"
                class="login-input"
                placeholder="Contraseña"
                value=""
                required
              >
            </div>

            <button type="submit" class="login-btn-submit">
              Iniciar sesión
            </button>
          </form>

          <a href="#" class="login-forgot-link" onclick="alert('Contacte al soporte técnico para restablecer su clave.'); return false;">
            ¿Olvidaste tu contraseña?
          </a>

          <div class="login-register-text">
            ¿No tienes cuenta? <a href="#" onclick="alert('Solicitud enviada al Administrador de PUJOLS Servicios.'); return false;">Solicitar acceso</a>
          </div>

          <div style="margin-top: 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 14px; width: 100%;">
            <button class="btn btn-sm btn-outline" style="color: #FFFFFF; border-color: rgba(255,255,255,0.4); font-size: 11px;" onclick="AuthModule.loginDirecto()">
              ⚡ Entrar al Sistema
            </button>
          </div>
        </div>
      </div>
    `;
  },

  handleLogin(e) {
    if (e) e.preventDefault();
    localStorage.setItem('pujols_logged_in', 'true');
    const loginOverlay = document.getElementById('loginOverlay');
    if (loginOverlay) {
      loginOverlay.style.display = 'none';
    }
  },

  loginDirecto() {
    this.handleLogin(null);
  },

  logout() {
    localStorage.removeItem('pujols_logged_in');
    const loginOverlay = document.getElementById('loginOverlay');
    if (loginOverlay) {
      this.renderLoginScreen(loginOverlay);
      loginOverlay.style.display = 'flex';
    }
  }
};

window.AuthModule = AuthModule;
