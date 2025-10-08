// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    const btnRegistro = document.querySelector('.btn-registro');
    const campos = {
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        email: document.getElementById('email'),
        edad: document.getElementById('edad'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirm-password'),
        terminos: document.getElementById('terminos'),
        captcha: document.getElementById('captchaCheckbox')
    };

    // Estado de validaciones
    const validaciones = {
        nombre: false,
        apellido: false,
        email: false,
        edad: false,
        password: false,
        confirmPassword: false,
        terminos: false,
        captcha: false
    };

    // Deshabilitar botón inicialmente
    btnRegistro.disabled = true;
    btnRegistro.classList.add('disabled');

    // Validar nombre
    function validarNombre() {
        const valor = campos.nombre.value.trim();
        const errorElement = document.getElementById('nombre-error');
        
        if (valor.length < 2) {
            errorElement.textContent = 'El nombre debe tener al menos 2 caracteres';
            errorElement.classList.add('show');
            campos.nombre.classList.add('error');
            validaciones.nombre = false;
        } else {
            errorElement.classList.remove('show');
            campos.nombre.classList.remove('error');
            campos.nombre.classList.add('success');
            validaciones.nombre = true;
        }
        verificarFormulario();
    }

    // Validar apellido
    function validarApellido() {
        const valor = campos.apellido.value.trim();
        const errorElement = document.getElementById('apellido-error');
        
        if (valor.length < 2) {
            errorElement.textContent = 'El apellido debe tener al menos 2 caracteres';
            errorElement.classList.add('show');
            campos.apellido.classList.add('error');
            validaciones.apellido = false;
        } else {
            errorElement.classList.remove('show');
            campos.apellido.classList.remove('error');
            campos.apellido.classList.add('success');
            validaciones.apellido = true;
        }
        verificarFormulario();
    }

    // Validar email
    function validarEmail() {
        const valor = campos.email.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(valor)) {
            errorElement.textContent = 'Ingresa un email válido';
            errorElement.classList.add('show');
            campos.email.classList.add('error');
            validaciones.email = false;
        } else {
            errorElement.classList.remove('show');
            campos.email.classList.remove('error');
            campos.email.classList.add('success');
            validaciones.email = true;
        }
        verificarFormulario();
    }

    // Validar edad
    function validarEdad() {
        const valor = parseInt(campos.edad.value);
        const errorElement = document.getElementById('edad-error');
        
        if (isNaN(valor) || valor < 13 || valor > 95) {
            errorElement.textContent = 'Debes tener entre 13 y 95 años';
            errorElement.classList.add('show');
            campos.edad.classList.add('error');
            validaciones.edad = false;
        } else {
            errorElement.classList.remove('show');
            campos.edad.classList.remove('error');
            campos.edad.classList.add('success');
            validaciones.edad = true;
        }
        verificarFormulario();
    }

    // Validar contraseña
    function validarPassword() {
        const valor = campos.password.value;
        const errorElement = document.getElementById('password-error');
        
        if (valor.length < 6) {
            errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorElement.classList.add('show');
            campos.password.classList.add('error');
            validaciones.password = false;
        } else {
            errorElement.classList.remove('show');
            campos.password.classList.remove('error');
            campos.password.classList.add('success');
            validaciones.password = true;
        }
        
        // Revalidar confirmación si ya se ingresó
        if (campos.confirmPassword.value) {
            validarConfirmPassword();
        }
        verificarFormulario();
    }

    // Validar confirmación de contraseña
    function validarConfirmPassword() {
        const valor = campos.confirmPassword.value;
        const passwordValor = campos.password.value;
        const errorElement = document.getElementById('confirm-password-error');
        
        if (valor !== passwordValor || valor === '') {
            errorElement.textContent = 'Las contraseñas no coinciden';
            errorElement.classList.add('show');
            campos.confirmPassword.classList.add('error');
            validaciones.confirmPassword = false;
        } else {
            errorElement.classList.remove('show');
            campos.confirmPassword.classList.remove('error');
            campos.confirmPassword.classList.add('success');
            validaciones.confirmPassword = true;
        }
        verificarFormulario();
    }

    // Validar términos y condiciones
    function validarTerminos() {
        validaciones.terminos = campos.terminos.checked;
        verificarFormulario();
    }

    // Validar captcha
    function validarCaptcha() {
        validaciones.captcha = campos.captcha.checked;
        verificarFormulario();
    }

    // Verificar si todo el formulario es válido
    function verificarFormulario() {
        const todasLasValidaciones = Object.values(validaciones).every(v => v === true);
        
        if (todasLasValidaciones) {
            btnRegistro.disabled = false;
            btnRegistro.classList.remove('disabled');
            btnRegistro.classList.add('enabled');
        } else {
            btnRegistro.disabled = true;
            btnRegistro.classList.add('disabled');
            btnRegistro.classList.remove('enabled');
        }
    }

    // Función para mostrar campos faltantes
    function mostrarCamposFaltantes() {
        const camposFaltantes = [];
        
        if (!validaciones.nombre) camposFaltantes.push('Nombre');
        if (!validaciones.apellido) camposFaltantes.push('Apellido');
        if (!validaciones.email) camposFaltantes.push('Email');
        if (!validaciones.edad) camposFaltantes.push('Edad');
        if (!validaciones.password) camposFaltantes.push('Contraseña');
        if (!validaciones.confirmPassword) camposFaltantes.push('Confirmación de contraseña');
        if (!validaciones.terminos) camposFaltantes.push('Términos y condiciones');
        if (!validaciones.captcha) camposFaltantes.push('Verificación CAPTCHA');
        
        const mensaje = camposFaltantes.length > 0 
            ? `Por favor completa los siguientes campos:\n• ${camposFaltantes.join('\n• ')}`
            : 'Por favor completa todos los campos requeridos';
            
        mostrarAlertaPersonalizada(mensaje);
    }

    // Función para mostrar alerta personalizada
    function mostrarAlertaPersonalizada(mensaje) {
        // Crear overlay de alerta
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';
        overlay.innerHTML = `
            <div class="alert-modal">
                <div class="alert-icon">
                    <div class="warning-icon">⚠️</div>
                </div>
                <h3>Campos Incompletos</h3>
                <p>${mensaje.replace(/\n/g, '<br>')}</p>
                <button class="btn-entendido" onclick="this.closest('.alert-overlay').remove()">Entendido</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animar aparición
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        
        // Auto cerrar después de 5 segundos
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 5000);
    }

    // Event listener mejorado para el botón
    btnRegistro.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (btnRegistro.disabled || btnRegistro.classList.contains('disabled')) {
            mostrarCamposFaltantes();
        } else {
            mostrarAnimacionExito();
        }
    });

    // Event listeners para validaciones
    campos.nombre.addEventListener('input', validarNombre);
    campos.apellido.addEventListener('input', validarApellido);
    campos.email.addEventListener('input', validarEmail);
    campos.edad.addEventListener('input', validarEdad);
    campos.password.addEventListener('input', validarPassword);
    campos.confirmPassword.addEventListener('input', validarConfirmPassword);
    campos.terminos.addEventListener('change', validarTerminos);
    campos.captcha.addEventListener('change', validarCaptcha);

    // Manejar el envío del formulario
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!btnRegistro.disabled) {
            mostrarAnimacionExito();
        }
    });

    // Función para mostrar animación de registro exitoso
    function mostrarAnimacionExito() {
        // Crear overlay de éxito
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <div class="checkmark">
                        <div class="checkmark_stem"></div>
                        <div class="checkmark_kick"></div>
                    </div>
                </div>
                <h2>¡Registro Exitoso!</h2>
                <p>Tu cuenta ha sido creada correctamente</p>
                <button class="btn-continuar" onclick="window.location.href='login.html'">Continuar</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animar aparición
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }
});