// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');

    // Manejar el envío del formulario
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');
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
