// Funcionalidad para la página de login
document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    setupEventListeners();
});

// Configurar el formulario de login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
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
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearErrorState);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
        passwordInput.addEventListener('input', clearErrorState);
    }

    // Recordar usuario
    loadRememberedUser();
}

// Manejar el envío del formulario de login
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember') === 'on';
    
    // Validar campos
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Simular proceso de login
    showLoading(true);
    
    // Simular llamada a API (reemplazar con llamada real)
    setTimeout(() => {
        // Simular login exitoso
        if (simulateLogin(email, password)) {
            // Guardar sesión
            saveUserSession(email, remember);
            
            // Mostrar mensaje de éxito
            showMessage('Inicio de sesión exitoso', 'success');
            
            // Redirigir al inicio
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage('Email o contraseña incorrectos', 'error');
        }
        
        showLoading(false);
    }, 2000);
}

// Validar formulario completo
function validateLoginForm(email, password) {
    let isValid = true;
    
    // Validar email
    if (!validateEmailFormat(email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    // Validar contraseña
    if (!password || password.length < 6) {
        showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

// Validar formato de email
function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    
    if (email && !validateEmailFormat(email)) {
        showFieldError('email', 'Formato de email inválido');
        return false;
    }
    
    clearFieldError('email');
    return true;
}

// Validar contraseña
function validatePassword() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    
    if (password && password.length < 6) {
        showFieldError('password', 'Mínimo 6 caracteres');
        return false;
    }
    
    clearFieldError('password');
    return true;
}

// Validar formato de email
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar error en campo
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Añadir clase de error
    field.classList.add('error');
    
    // Buscar o crear mensaje de error
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
    
    field.classList.remove('error');
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Limpiar estado de error al escribir
function clearErrorState(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Simular login (reemplazar con lógica real)
function simulateLogin(email, password) {
    // Simular algunos usuarios válidos
    const validUsers = [
        { email: 'admin@gamezone.com', password: '123456' },
        { email: 'user@test.com', password: 'password' },
        { email: 'demo@demo.com', password: 'demo123' }
    ];
    
    return validUsers.some(user => user.email === email && user.password === password);
}

// Guardar sesión de usuario
function saveUserSession(email, remember) {
    const userData = {
        email: email,
        loginTime: new Date().toISOString()
    };
    
    if (remember) {
        localStorage.setItem('rememberedUser', email);
        localStorage.setItem('userSession', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('userSession', JSON.stringify(userData));
    }
}

// Cargar usuario recordado
function loadRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        
        if (emailInput) emailInput.value = rememberedUser;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
}

// Mostrar estado de carga
function showLoading(isLoading) {
    const loginButton = document.querySelector('.login-button');
    
    if (isLoading) {
        loginButton.textContent = 'Iniciando sesión...';
        loginButton.disabled = true;
    } else {
        loginButton.textContent = 'Iniciar Sesión';
        loginButton.disabled = false;
    }
}

// Mostrar mensaje
function showMessage(message, type) {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Estilos del mensaje
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
    
    // Animar entrada
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}