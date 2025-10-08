'use strict';
// Funcionalidad para la página de inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Función para alternar la visibilidad de la contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Cambiar el icono del ojo
        const imgSrc = type === 'password' ? 'assets/img/eyes-off.png' : 'assets/img/eyes-on.png';
        this.querySelector('img').setAttribute('src', imgSrc);
    });


    // Envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
       window.location.href = 'index.html';
    })
});

const emailInput = document.getElementById("email")
const errorMessage = document.getElementById("error-message")
const successMessage = document.getElementById("success-message")

emailInput.addEventListener("input", function () {
  const email = this.value.trim()  //elimina los espacios en blanco
  if (email === "" && !validatePassword(password)) {
    this.classList.remove("error", "success")
    errorMessage.classList.remove("show")//elimina show osea lo hace invisible
    successMessage.classList.remove("show")
    return
  }
  if (validateEmail(email)) {
    this.classList.remove("error")
    // elimina la clase error
    this.classList.add("success")
    //agrega la clase success
    errorMessage.classList.remove("show")
    //elimina msj de error
    successMessage.classList.add("show")
    // agrega msj de exito
  } else {
    // Email inválido - borde rojo
    this.classList.remove("success")
    this.classList.add("error")
    successMessage.classList.remove("show")
    errorMessage.classList.add("show")
  }
})

function validateEmail(email) {
  // Verifica que contenga @ y .com
  return email.includes("@") && email.includes(".com")
}

const passwordInput = document.getElementById("password")
const passwordErrorMessage = document.getElementById("password-error-message")
const passwordSuccessMessage = document.getElementById("password-success-message")
passwordInput.addEventListener("input", function () {
  const password = this.value.trim()
  // Si el campo está vacío, resetear estilos
  if (password === "" && !validatePassword(password)) {
    this.classList.remove("error", "success")
    passwordErrorMessage.classList.remove("show")
    passwordSuccessMessage.classList.remove("show")
    return
  }
  // Validar contraseña
  if (validatePassword(password)) {
    // Contraseña válida - borde verde
    this.classList.remove("error")
    this.classList.add("success")
    passwordErrorMessage.classList.remove("show")
    passwordSuccessMessage.classList.add("show")
  } else {
    // Contraseña inválida - borde rojo
    this.classList.remove("success")
    this.classList.add("error")
    passwordSuccessMessage.classList.remove("show")
    passwordErrorMessage.classList.add("show")
  }
})
function validatePassword(password) {
  // Verifica que tenga al menos 8 caracteres
  return password.length >= 8
}
