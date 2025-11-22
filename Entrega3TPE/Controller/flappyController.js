"use strict"

document.addEventListener("DOMContentLoaded", () => {
    let gameScreen = document.querySelector(".grid-contenedor");
    gameScreen.tabIndex = 0;
    gameScreen.focus();
    
    gameScreen.addEventListener("keydown", readKey);
});


function readKey(e) {
    let key = e.code;
    switch (key){
        case "Space":
        e.preventDefault(); // evita scroll de la página
        jump();
    }
}

function jump(){
    const astronauta = document.getElementById("astronauta");

    // añadir la clase y quitarla cuando termine la animación para poder re-dispararla
    astronauta.classList.add("astronauta-on-shift");
    astronauta.addEventListener("animationend", function handler() {
        astronauta.classList.remove("astronauta-on-shift");
        astronauta.removeEventListener("animationend", handler);
    });
}