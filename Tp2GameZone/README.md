# Interfaces de Usuario e Interacción - TUDAI (2025)
# Segunda entrega

## Grupo número 10

## Integrantes
- Joaquín Hevia  
- María Emilia Tunesi  
- Lautaro Acosta

## Configuración de pantalla recomendada
- 16:9 (1366x768)


## Implementación realizada

### Redirecciones y estructura de navegación:
  - Desde Home → Cerrar sesión → Login.  
  - Desde Login → Crear cuenta → Registro.  
  - Desde Registro → Registro exitoso → Redirección al Login.  
  - Desde Home → Card Peg Solitaire → Juego
  - Desde Juego → Breadcrumbs - inicio → Home

### Login y Registro
- Validaciones de formulario.  
- Animación visual que indica registro exitoso.  
- Botón con animación Hover: iniciar sesión. 

### Home
- Diseño responsive (Mobile First).  
- Loading animado de 5 segundos al cargar, con barra de progreso y spinner.  
- Carrusel animado en el Hero.  
- El Hero simula publicidades pagas de juegos (monetización), por esto se titula trending    games.  
- Juegos destacados con distintos largos de título y colores de imágenes para probar adaptabilidad.  
- Juegos “premium”:  
  - Al hacer clic en un juego premium, aparece un pop-up invitando al usuario a hacerse Premium.  
  - El mismo pop-up aparece al tocar la corona en el header.  

### Juego: Peg Solitaire
- Carrusel de imágenes en sección Screenshots con transiciones animadas.  
- Botones con animaciones hover:  
  - Compartir  
  - Publicar en el foro   

### Otras animaciones
- Menú hamburguesa.  
- Menú de usuario desplegable.  
- Hover en cards de Home.  


## Datos y API
- Se consumió la API de la cátedra.  
- En su lugar, se generó un archivo local `api.json` con los datos extraídos de la API, para simular la respuesta.  


## Tecnologías utilizadas
- HTML5 (estructura y maquetación).  
- CSS3 (diseño, responsive, animaciones con @keyframes).  
- JavaScript (ES6) (validaciones, redirecciones, carrusel, loading).  


## Anotaciones:
- Se aplicaron todas las correcciones del TPE #1.  

