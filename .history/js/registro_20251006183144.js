// Funcionalidad para la página de registro
const regexLetters = /^[a-zA-Z\s]*$/
const regexNumLet = /^[a-zA-Z0-9\s]*$/
const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Formato a@a.c


const validations = {
  validName: false,
  validSurname: false,
  validEmail: false,
  validUsername: true, // Opcional, por defecto válido
  validAge: false,
  validPass: false,
  validConfirmPass: false,
  validTerminos: false,
  validCaptcha: false,
}

let passRepit = "" // Para comparar contraseñas

const registroForm = document.querySelector("#registro-form")
const inputName = document.querySelector("#nombre")/*me traigo el input*/
const messageName = document.querySelector("#nombre-error")/*me traigo el mensaje de error*/
const inputSurname = document.querySelector("#apellido")
const messageSurname = document.querySelector("#apellido-error")
const inputEmail = document.querySelector("#email")
const messageEmail = document.querySelector("#email-error")
const inputUsername = document.querySelector("#username")
const inputAge = document.querySelector("#edad")
const messageAge = document.querySelector("#edad-error")
const inputPass = document.querySelector("#password")
const messagePass = document.querySelector("#password-error")
const inputConfirmPass = document.querySelector("#confirm-password")
const messageConfirmPass = document.querySelector("#confirm-password-error")
const inputTerminos = document.querySelector("#terminos")
const inputCaptcha = document.querySelector("#captchaCheckbox")

inputName.addEventListener("input", () => {/*input cuando el usuario cambia info del campo*/
  validations.validName = validateInfo(inputName, messageName, regexLetters, "Ingrese solo letras")
})
inputName.addEventListener("blur", () => {/*cuando el usuario no hace foco del campo*/
  if (!validations.validName) addError(inputName)
})

inputSurname.addEventListener("input", () => {
  validations.validSurname = validateInfo(inputSurname, messageSurname, regexLetters, "Ingrese solo letras")
})
inputSurname.addEventListener("blur", () => {
  if (!validations.validSurname) addError(inputSurname)
})

inputEmail.addEventListener("input", () => {
  validations.validEmail = validateEmail(inputEmail, messageEmail, regexMail)
})
inputEmail.addEventListener("blur", () => {
  if (!validations.validEmail) addError(inputEmail)
})

inputUsername.addEventListener("input", () => {
  validations.validUsername = validateInfo(inputUsername, null, regexNumLet, "")
})

inputAge.addEventListener("input", () => {
  validations.validAge = validateAge(inputAge, messageAge)
})
inputAge.addEventListener("blur", () => {
  if (!validations.validAge) addError(inputAge)
})

inputPass.addEventListener("input", () => {
  validations.validPass = validatePass(inputPass, messagePass)
})
inputPass.addEventListener("blur", () => {
  if (!validations.validPass) addError(inputPass)
})
inputConfirmPass.addEventListener("input", () => {
  validations.validConfirmPass = validateConfirmPass(inputConfirmPass, messageConfirmPass)
})
inputConfirmPass.addEventListener("blur", () => {
  if (!validations.validConfirmPass) addError(inputConfirmPass)
})
inputTerminos.addEventListener("change", () => {
  validations.validTerminos = inputTerminos.checked
  
})
inputCaptcha.addEventListener("change", () => {
  validations.validCaptcha = inputCaptcha.checked
  
})
    

//valido info de los inputs
function validateInfo(input, message, regex, errorText) {
  const value = input.value
  if (!regex.test(value) || value === "") {//si no cumple con la regex o esta vacio
    if (message) {
      showErrorMessage(message, errorText)
    }
    addError(input)//aplico estilos de error al input
    return false
  } else {
    if (message) {
      hideErrorMessage(message)//oculto mensaje de error
    }
    removeError(input)
    return true
  }
}
function addError(input) {
  input.classList.remove("success")
  input.classList.add("error")
}
function showErrorMessage(messageElement, text) {
  if (messageElement) {
    messageElement.textContent = text//agrego el mensaje de error al span
    messageElement.classList.add("show")//le agrego la clase show para que se vea el mensaje con su estilo
  }
}
function hideErrorMessage(messageElement) {
  if (messageElement) {
    messageElement.textContent = ""
    messageElement.classList.remove("show")
  }
}
function removeError(input) {
  input.classList.remove("error")
  input.classList.add("success")
}
function validateEmail(input, message, regex) {
  const value = input.value

  if (!regex.test(value) || value === "") {
    showErrorMessage(message, "Por favor ingresa un email válido (debe contener @ y .com)")
    addError(input)
    return false
  } else {
    hideErrorMessage(message)
    removeError(input)
    return true
  }
}
function validateAge(input, message) {
  const age = Number.parseInt(input.value)

  if (isNaN(age) || age < 1 || age > 95 || input.value === "") {
    showErrorMessage(message, "Ingrese una edad válida entre 1 y 95 años")
    addError(input)
    return false
  } else {
    hideErrorMessage(message)
    removeError(input)
    return true
  }
}
function validatePass(input, message) {
  const value = input.value
  const errors = []

  if (value.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres")
  }
  if (!/[a-z]/.test(value)) {
    errors.push("Debe contener al menos una letra minúscula")
  }
  if (!/[A-Z]/.test(value)) {
    errors.push("Debe contener al menos una letra mayúscula")
  }
  if (errors.length > 0) {
    showErrorMessage(message, errors.join(". ") + ".")/*toma el array y lo convierte en string
    separando cada error con un punto*/
    addError(input)
    return false
  } else {
    hideErrorMessage(message)
    removeError(input)
    passRepit = value//guardo la contraseña para comparar despues
    return true
  }
}
function validateConfirmPass(input, message) {
  if (passRepit === input.value && input.value !== "") {
    hideErrorMessage(message)
    removeError(input)
    return true
  } else {
    showErrorMessage(message, "Las contraseñas no coinciden")
    addError(input)
    return false
  }
}

registroForm.addEventListener("submit", validateRegistro)

function validateRegistro(event) {
  event.preventDefault()

  // Validar todos los campos
  validations.validName = validateInfo(inputName, messageName, regexLetters, "Ingrese solo letras")
  validations.validSurname = validateInfo(inputSurname, messageSurname, regexLetters, "Ingrese solo letras")
  validations.validEmail = validateEmail(inputEmail, messageEmail, regexMail)
  validations.validAge = validateAge(inputAge, messageAge)
  validations.validPass = validatePass(inputPass, messagePass)
  validations.validConfirmPass = validateConfirmPass(inputConfirmPass, messageConfirmPass)
  validations.validTerminos = inputTerminos.checked/*/verifica si el checkbox esta tildado o no*/
  validations.validCaptcha = inputCaptcha.checked

  if (validAll()) {
    mostrarAnimacionExito()
  } else {
    mostrarModalError()
  }
}

function validAll() {
  return Object.values(validations).every((element) => element === true)
}

function mostrarAnimacionExito() {
  const btnRegistro = document.querySelector(".btn-registro")

  // Animación de éxito en el botón
  btnRegistro.innerHTML = "Registrando..."
  btnRegistro.style.setProperty("background", "linear-gradient(135deg, #FFA552 0%, #FF8A33 100%)", "important")
  btnRegistro.style.transform = "scale(0.95)"
  btnRegistro.style.transition = "all 0.3s ease"

  setTimeout(() => {
    btnRegistro.innerHTML = "✓ ¡Registro Exitoso!"
    btnRegistro.style.transform = "scale(1.1)"
    btnRegistro.classList.add("success")
  }, 800)

  setTimeout(() => {
    btnRegistro.style.transform = "scale(1)"
  }, 1200)

  setTimeout(() => {
    // Crear overlay de éxito
    const overlay = document.createElement("div")
    overlay.className = "success-overlay"
    overlay.innerHTML = `
      <div class="success-modal">
        <h2>¡Registro Exitoso!</h2>
        <p>Tu cuenta ha sido creada correctamente</p>
        <button class="btn-continuar" onclick="window.location.href='login.html'">Continuar</button>
      </div>
    `

    document.body.appendChild(overlay)

    // Animar aparición
    setTimeout(() => {
      overlay.classList.add("show")
    }, 100)
  }, 2000)
}

/* en caso de algun campo incompleto */
function mostrarModalError() {
  const overlay = document.createElement("div")
  overlay.className = "error-overlay"
  overlay.innerHTML = `
    <div class="error-modal">
      <h2>Formulario Incompleto</h2>
      <p>Por favor, completa todos los campos requeridos y acepta los términos.</p>
      <button class="btn-cerrar-error">Entendido</button>
    </div>
  `

  document.body.appendChild(overlay)

  // Animar aparición
  setTimeout(() => {
    overlay.classList.add("show")
  }, 10)

  // Cerrar modal al hacer clic en el botón
  const btnCerrar = overlay.querySelector(".btn-cerrar-error")
  btnCerrar.addEventListener("click", () => {
    overlay.classList.remove("show")
    setTimeout(() => {
      overlay.remove()
    }, 300)
  })

  // Cerrar modal al hacer clic fuera de él
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("show")
      setTimeout(() => {
        overlay.remove()
      }, 300)
    }
  })
}

// Funcionalidad para toggle de contraseñas
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Toggle para la primera contraseña
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Cambiar el icono del ojo
            const imgSrc = type === 'password' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
            this.querySelector('img').setAttribute('src', imgSrc);
        });
    }

    // Toggle para confirmar contraseña
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);

            // Cambiar el icono del ojo
            const imgSrc = type === 'password' ? '../assets/img/eyes-off.png' : '../assets/img/eyes-on.png';
            this.querySelector('img').setAttribute('src', imgSrc);
        });
    }
});
