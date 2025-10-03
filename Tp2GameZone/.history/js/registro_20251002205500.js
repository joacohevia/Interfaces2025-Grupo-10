// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    const togglePassword = document.getElementById('togglePassword');
    const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');
    const passwordInput = document.getElementById('password');
    const passwordInputConfirm = document.getElementById('confirm-password');

    // Función para alternar la visibilidad de la contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Cambiar el icono del ojo
        const imgSrc = type === 'password' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
        this.querySelector('img').setAttribute('src', imgSrc);
    }); 

    togglePasswordConfirm.addEventListener('click', function() {
        const type = passwordInputConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInputConfirm.setAttribute('type', type);

        // Cambiar el icono del ojo
        const imgSrc = type === 'password' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
        this.querySelector('img').setAttribute('src', imgSrc);
    }); 

    // Validación del formulario con reCAPTCHA
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener todos los valores del formulario
        const password = passwordInput.value;
        const confirmPassword = passwordInputConfirm.value;
        const email = document.getElementById('email').value;
        const nombre = document.getElementById('nombre').value;
        const terminos = document.getElementById('terminos').checked;

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

        // Si todo está validado, puedes enviar el formulario
        console.log('Formulario válido, reCAPTCHA completado');
        // registroForm.submit(); // Descomenta esta línea cuando quieras enviar el formulario
    });
});
