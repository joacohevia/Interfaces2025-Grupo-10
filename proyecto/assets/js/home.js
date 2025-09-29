"use strict"

let gamesCont = document.querySelector(".game-list"); //el contenedor html donde van los juegos




fetch('https://vj.interfaces.jima.com.ar/api/v2')
  .then(response => response.json())
  .then(games => {
    let htmlContent = "";
    
    games.forEach(game => {
        htmlContent += `
            <article class="card">
                <img src="${game.background_image_low_res}">
                <p class='game-title'>${game.name}</p>
            </article>
        `;
    });
    
    gamesCont.innerHTML = htmlContent;
    
  })
  .catch(error => {
    console.error('Error al obtener los juegos:', error);
  });

 