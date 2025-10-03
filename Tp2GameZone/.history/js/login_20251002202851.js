'use strict';

document.addEventListener("DOMContentLoaded", function() {
    // Esperar hasta que la página se haya cargado completamente
    let porcentaje = 0;
    const porcentajeCarga = document.getElementById('porcentaje');

    // Simular el incremento del porcentaje
    const interval = setInterval(function() {
        if (porcentaje < 100) {
            porcentaje = porcentaje + 1;
            porcentajeCarga.innerText = porcentaje;
        } else {
            clearInterval(interval);
            setTimeout(function() {
                document.body.classList.add('loaded'); // Ocultar el loader
            }, 800); // momento antes de iniciar
        }
    }, 20); //tiempo del intervalo que incrementa el loader

    createCarousel('carousel1');
    createCarousel('carousel2');
    createCarousel('carousel3');
    createCarousel('carousel4');
    createCarousel('carousel5');
    createCarousel('carousel6');
    createCarousel('carousel7');

    /*__________________FBOTON CAMBIO DE ICONO AL COMPRAR__________________*/
    let buyButtons = document.querySelectorAll('.button-with-icon');
    
    if(buyButtons){

        buyButtons.forEach(buyButton => {
            buyButton.addEventListener('click', () => {
                cambiarImagenCart(buyButton);
            });
        });
    }
});

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
        const imgSrc = type === 'password' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
        this.querySelector('img').setAttribute('src', imgSrc);
    });


    // Manejar el envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = passwordInput.value;

        try {
            // Aquí iría la lógica de autenticación
            // Por ahora, solo simularemos un inicio de sesión exitoso
            const response = await simulateLogin(email, password);

            if (response.success) {
                // Guardar el token o la información del usuario
                localStorage.setItem('userToken', response.token);

                // Redirigir al usuario a la página principal
                window.location.href = 'index.html';
            } else {
                alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            alert('Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.');
        }
    });

    // Función que simula una llamada a la API de autenticación
    async function simulateLogin(email, password) {
        // Simular un retraso de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simular una respuesta exitosa
        // En una implementación real, esto sería una llamada a tu API
        return {
            success: true,
            token: 'fake-jwt-token',
            user: {
                email: email,
                name: 'Usuario de Prueba'
            }
        };
    }

    // Manejar los botones de redes sociales
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aquí iría la lógica de autenticación con redes sociales
            alert('Función de inicio de sesión con redes sociales en desarrollo');
        });
    });
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
