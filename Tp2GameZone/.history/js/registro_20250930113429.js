// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    setupRegisterForm();
    setupEventListeners();
});

// Configurar el formulario de registro
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Menú hamburguesa
    const burgerMenu = document.getElementById('burgerMenu');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            console.log('Menú hamburguesa clickeado');
        });
    }

    // Validación en tiempo real
    const inputs = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        username: document.getElementById('username'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        birthDate: document.getElementById('birthDate')
    };
    
    // Añadir listeners a cada campo
    Object.keys(inputs).forEach(inputName => {
        const input = inputs[inputName];
        if (input) {
            input.addEventListener('blur', () => validateField(inputName, input.value));
            input.addEventListener('input', () => clearFieldError(inputName));
        }
    });
    
    // Validación especial para confirmación de contraseña
    if (inputs.confirmPassword) {
        inputs.confirmPassword.addEventListener('input', validatePasswordMatch);
    }
    
    // Checkbox de términos
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', updateSubmitButton);
    }
}

// Manejar el envío del formulario de registro
function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        birthDate: formData.get('birthDate'),
        terms: formData.get('terms') === 'on',
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Validar formulario completo
    if (!validateRegisterForm(userData)) {
        return;
    }
    
    // Simular proceso de registro
    showLoading(true);
    
    // Simular llamada a API (reemplazar con llamada real)
    setTimeout(() => {
        if (simulateRegister(userData)) {
            showMessage('Cuenta creada exitosamente', 'success');
            
            // Redirigir al login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage('Error al crear la cuenta. Inténtalo nuevamente.', 'error');
        }
        
        showLoading(false);
    }, 2500);
}

// Validar formulario completo
function validateRegisterForm(userData) {
    let isValid = true;
    
    // Validar cada campo
    const validations = {
        firstName: () => validateName(userData.firstName, 'firstName'),
        lastName: () => validateName(userData.lastName, 'lastName'),
        email: () => validateEmail(userData.email),
        username: () => validateUsername(userData.username),
        password: () => validatePassword(userData.password),
        confirmPassword: () => validatePasswordConfirmation(userData.password, userData.confirmPassword),
        birthDate: () => validateBirthDate(userData.birthDate),
        terms: () => validateTerms(userData.terms)
    };
    
    Object.keys(validations).forEach(field => {
        if (!validations[field]()) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(fieldName, value) {
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            return validateName(value, fieldName);
        case 'email':
            return validateEmail(value);
        case 'username':
            return validateUsername(value);
        case 'password':
            return validatePassword(value);
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            return validatePasswordConfirmation(password, value);
        case 'birthDate':
            return validateBirthDate(value);
        default:
            return true;
    }
}

// Validar nombre
function validateName(name, fieldId) {
    if (!name || name.trim().length < 2) {
        showFieldError(fieldId, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }
    
    if (!/^[a-zA-ZÀ-ſ\s]+$/.test(name)) {
        showFieldError(fieldId, 'El nombre solo debe contener letras');
        return false;
    }
    
    clearFieldError(fieldId);
    return true;
}

// Validar email
function validateEmail(email) {
    if (!email) {
        showFieldError('email', 'El email es requerido');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Formato de email inválido');
        return false;
    }
    
    clearFieldError('email');
    return true;
}

// Validar nombre de usuario
function validateUsername(username) {
    if (!username || username.length < 3) {
        showFieldError('username', 'El nombre de usuario debe tener al menos 3 caracteres');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError('username', 'Solo letras, números y guiones bajos permitidos');
        return false;
    }
    
    clearFieldError('username');
    return true;
}

// Validar contraseña
function validatePassword(password) {
    if (!password || password.length < 8) {
        showFieldError('password', 'La contraseña debe tener al menos 8 caracteres');
        return false;
    }
    
    // Verificar que contenga al menos una mayúscula, una minúscula y un número
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        showFieldError('password', 'Debe contener mayúsculas, minúsculas y números');
        return false;
    }
    
    clearFieldError('password');
    return true;
}

// Validar confirmación de contraseña
function validatePasswordConfirmation(password, confirmPassword) {
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Las contraseñas no coinciden');
        return false;
    }
    
    clearFieldError('confirmPassword');
    return true;
}

// Validar coincidencia de contraseñas en tiempo real
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError('confirmPassword', 'Las contraseñas no coinciden');
    } else if (confirmPassword) {
        clearFieldError('confirmPassword');
    }
}

// Validar fecha de nacimiento
function validateBirthDate(birthDate) {
    if (!birthDate) {
        showFieldError('birthDate', 'La fecha de nacimiento es requerida');
        return false;
    }
    
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    
    if (age < 13) {
        showFieldError('birthDate', 'Debes tener al menos 13 años para registrarte');
        return false;
    }
    
    if (age > 120) {
        showFieldError('birthDate', 'Por favor ingresa una fecha válida');
        return false;
    }
    
    clearFieldError('birthDate');
    return true;
}

// Validar términos y condiciones
function validateTerms(accepted) {
    if (!accepted) {
        showMessage('Debes aceptar los términos y condiciones', 'error');
        return false;
    }
    
    return true;
}

// Mostrar error en campo
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '#ff4757';
    
    let errorMsg = field.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        field.parentNode.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
}

// Limpiar error de campo
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '';
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Actualizar estado del botón de envío
function updateSubmitButton() {
    const termsCheckbox = document.getElementById('terms');
    const submitButton = document.querySelector('.register-button');
    
    if (submitButton) {
        submitButton.disabled = !termsCheckbox.checked;
    }
}

// Simular registro (reemplazar con lógica real)
function simulateRegister(userData) {
    // Simular éxito en el 90% de los casos
    return Math.random() > 0.1;
}

// Mostrar estado de carga
function showLoading(isLoading) {
    const registerButton = document.querySelector('.register-button');
    
    if (isLoading) {
        registerButton.textContent = 'Creando cuenta...';
        registerButton.disabled = true;
    } else {
        registerButton.textContent = 'Crear Cuenta';
        registerButton.disabled = !document.getElementById('terms').checked;
    }
}

// Mostrar mensaje
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#2ed573' : '#ff4757'
    });
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}