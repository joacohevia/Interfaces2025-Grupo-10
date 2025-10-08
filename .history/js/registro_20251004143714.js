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
        // Animar el botón primero
        btnRegistro.style.transform = 'scale(0.95)';
        btnRegistro.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            btnRegistro.style.transform = 'scale(1.05)';
        }, 100);
        
        setTimeout(() => {
            btnRegistro.style.transform = 'scale(1)';
            
            // Crear overlay de éxito
            const overlay = document.createElement('div');
            overlay.className = 'success-overlay';
            overlay.innerHTML = `
                <div class="success-modal">
                    <div class="success-content">
                        <div class="celebration-particles"></div>
                        <h2>¡Registro Exitoso!</h2>
                        <p>Tu cuenta ha sido creada correctamente</p>
                        <button class="btn-continuar" onclick="window.location.href='login.html'">Continuar</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Crear partículas de celebración
            setTimeout(() => {
                crearParticulas(overlay.querySelector('.celebration-particles'));
            }, 200);
            
            // Animar aparición con efecto más dinámico
            setTimeout(() => {
                overlay.classList.add('show');
            }, 250);
        }, 200);
    }

    // Función para crear partículas de celebración
    function crearParticulas(container) {
        const colores = ['#FFA552', '#FF8A33', '#FFD700', '#FF6B6B', '#4ECDC4'];
        
        for (let i = 0; i < 20; i++) {
            const particula = document.createElement('div');
            particula.className = 'particula';
            particula.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
            particula.style.left = Math.random() * 100 + '%';
            particula.style.animationDelay = Math.random() * 2 + 's';
            particula.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(particula);
        }
    }
});