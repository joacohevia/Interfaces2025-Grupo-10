// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    const togglePassword = document.getElementById('togglePassword');
    const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');
    const passwordInput = document.getElementById('password');
    const passwordInputConfirm = document.getElementById('confirm-password');
    const emailInput = document.getElementById('email');
    
    // Validación del email en tiempo real
    emailInput.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById('email-error');
        
        if (this.value.trim() === '') {
            errorElement.textContent = 'El email es requerido';
            this.classList.add('invalid');
        } else if (!emailRegex.test(this.value)) {
            errorElement.textContent = 'Ingresa un email válido';
            this.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            this.classList.remove('invalid');
        }
    });

    // Función para alternar la visibilidad de la contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Cambiar el icono del ojo
        const imgSrc = type === 'text' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
        this.querySelector('img').setAttribute('src', imgSrc);
    });
    
    // Validación de la contraseña en tiempo real
    passwordInput.addEventListener('input', validatePassword);
    
    function validatePassword() {
        const password = passwordInput.value;
        const reqLength = document.getElementById('req-length');
        const reqUppercase = document.getElementById('req-uppercase');
        const reqNumber = document.getElementById('req-number');
        const errorElement = document.getElementById('password-error');
        
        // Validar longitud mínima
        if (password.length >= 8) {
            reqLength.classList.add('valid');
        } else {
            reqLength.classList.remove('valid');
        }
        
        // Validar mayúscula
        if (/[A-Z]/.test(password)) {
            reqUppercase.classList.add('valid');
        } else {
            reqUppercase.classList.remove('valid');
        }
        
        // Validar número
        if (/\d/.test(password)) {
            reqNumber.classList.add('valid');
        } else {
            reqNumber.classList.remove('valid');
        }
        
        // Validación general
        if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
            errorElement.textContent = '';
            passwordInput.classList.remove('invalid');
            return true;
        } else {
            errorElement.textContent = 'La contraseña debe tener 8 caracteres, una mayúscula y un número';
            passwordInput.classList.add('invalid');
            return false;
        }
    }

    // Función para alternar la visibilidad de la confirmación de contraseña
    togglePasswordConfirm.addEventListener('click', function() {
        const type = passwordInputConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInputConfirm.setAttribute('type', type);

        // Cambiar el icono del ojo
        const imgSrc = type === 'text' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
        this.querySelector('img').setAttribute('src', imgSrc);
    });
    
    // Validación de confirmación de contraseña
    passwordInputConfirm.addEventListener('input', function() {
        const errorElement = document.getElementById('confirm-password-error');
        if (this.value !== passwordInput.value) {
            errorElement.textContent = 'Las contraseñas no coinciden';
            this.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            this.classList.remove('invalid');
        }
    });

    // Validación del formulario
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener todos los valores del formulario
        const password = passwordInput.value;
        const confirmPassword = passwordInputConfirm.value;
        const email = document.getElementById('email').value;
        const nombre = document.getElementById('nombre').value;
        const terminos = document.getElementById('terminos').checked;
        
        // Validar todos los campos
        let isValid = true;
        
        // Validar email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Ingresa un email válido';
            isValid = false;
        }
        
        // Validar contraseña
        if (!validatePassword()) {
            isValid = false;
        }
        
        // Validar confirmación de contraseña
        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Las contraseñas no coinciden';
            isValid = false;
        }
        
        // Validar nombre
        if (!nombre.trim()) {
            document.getElementById('nombre-error').textContent = 'El nombre es requerido';
            isValid = false;
        }

        // Verificar el reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert('Por favor, completa el reCAPTCHA antes de continuar');
            return;
        }

        // Aquí puedes agregar validaciones adicionales
        if (!terminos) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Si todo está validado, permite enviar el formulario
        console.log('Formulario válido, reCAPTCHA completado');
        // registroForm.submit(); // Descomenta esta línea cuando quieras enviar el formulario
    });
});
