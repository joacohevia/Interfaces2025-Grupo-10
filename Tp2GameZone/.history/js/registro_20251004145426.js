// Funcionalidad para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    const btnRegistro = document.querySelector('.btn-registro');

    // Event listener simple para el botón
    btnRegistro.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarAnimacionExito();
    });

    // Función para mostrar animación de registro exitoso
    function mostrarAnimacionExito() {
        // Animación de éxito en el botón
        btnRegistro.innerHTML = 'Registrando...';
        btnRegistro.style.setProperty('background', 'linear-gradient(135deg, #FFA552 0%, #FF8A33 100%)', 'important');
        btnRegistro.style.transform = 'scale(0.95)';
        btnRegistro.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            btnRegistro.innerHTML = '✓ ¡Registro Exitoso!';
            btnRegistro.style.transform = 'scale(1.1)';
            btnRegistro.classList.add('success');
        }, 800);
        
        setTimeout(() => {
            btnRegistro.style.transform = 'scale(1)';
        }, 1200);
        
        setTimeout(() => {
            // Crear overlay de éxito simple
            const overlay = document.createElement('div');
            overlay.className = 'success-overlay';
            overlay.innerHTML = `
                <div class="success-modal">
                    <h2>¡Registro Exitoso!</h2>
                    <p>Tu cuenta ha sido creada correctamente</p>
                    <button class="btn-continuar" onclick="window.location.href='login.html'">Continuar</button>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Animar aparición
            setTimeout(() => {
                overlay.classList.add('show');
            }, 100);
        }, 2000);
    }
});