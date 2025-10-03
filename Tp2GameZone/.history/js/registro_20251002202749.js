// Funcionalidad para la página de inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
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

});
