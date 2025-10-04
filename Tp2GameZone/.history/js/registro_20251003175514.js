// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');

    // Manejar el envío del formulario
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');
    });
        
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
            document.getElementById('nombre-error').textContent = 'Necesitamos tu nombre para continuar';
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
            alert('Por favor, necesitamos que aceptes los términos y condiciones');
            return;
        }

        if (password !== confirmPassword) {
            alert('Por favor, asegúrate de que las contraseñas coincidan');
            return;
        }

        // Si todo está validado, permite enviar el formulario
        console.log('Formulario válido, reCAPTCHA completado');
        // registroForm.submit(); // Descomenta esta línea cuando quieras enviar el formulario
    });