// Funcionalidad básica para la página del juego
document.addEventListener('DOMContentLoaded', () => {
    // Manejadores para la interacción con las previsualizaciones
    setupPreviewInteractions();
    
    // Manejadores para el formulario de comentarios
    setupCommentForm();
});

function setupPreviewInteractions() {
    const previews = document.querySelectorAll('.preview-item');
    
    previews.forEach(preview => {
        preview.addEventListener('mouseenter', () => {
            preview.style.transform = 'scale(1.05)';
            preview.style.transition = 'transform 0.3s ease';
        });
        
        preview.addEventListener('mouseleave', () => {
            preview.style.transform = 'scale(1)';
        });
    });
}

function setupCommentForm() {
    const form = document.querySelector('.comment-form');
    const textarea = form.querySelector('textarea');
    const cancelBtn = form.querySelector('.cancel-btn');
    const publishBtn = form.querySelector('.publish-btn');

    cancelBtn.addEventListener('click', () => {
        textarea.value = '';
    });

    publishBtn.addEventListener('click', () => {
        const comment = textarea.value.trim();
        if (comment) {
            addNewComment(comment);
            textarea.value = '';
        }
    });
}

function addNewComment(text) {
    const commentsList = document.querySelector('.comments-list');
    const date = new Date().toLocaleDateString();
    
    const commentHTML = `
        <div class="comment">
            <div class="comment-avatar"></div>
            <div class="comment-content">
                <p>${text}</p>
                <span class="comment-time">${date}</span>
            </div>
        </div>
    `;
    
    commentsList.insertAdjacentHTML('afterbegin', commentHTML);
}

let board = [];
let selectedCell = null;
let validMoves = [];
let movimientos = 0;
let tiempo = 0;
let puntuacion = 0;
let timerInterval;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupStartScreen();
    setupEventListeners();
});

function setupStartScreen() {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const gameContent = document.getElementById('gameContent');

    startButton.addEventListener('click', () => {
        startScreen.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            startScreen.style.display = 'none';
            gameContent.style.display = 'block';
            gameContent.style.animation = 'fadeIn 1s forwards';
            initializeGame();
        }, 900);
    });
}

function initializeGame() {
    board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    createBoard();
    resetStats();
    startTimer();
}

function createBoard() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = getCellClass(row, col);
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (board[row][col] !== 2) {
                cell.addEventListener('click', () => handleCellClick(row, col));
            }
            
            tablero.appendChild(cell);
        }
    }
}

function getCellClass(row, col) {
    const value = board[row][col];
    let className = 'cell';
    
    if (value === 2) className += ' disabled';
    else if (value === 1) className += ' peg';
    else className += ' empty';
    
    return className;
}

function setupEventListeners() {
    document.getElementById('reiniciar').addEventListener('click', resetGame);
    document.getElementById('reglas').addEventListener('click', showRules);
    document.querySelector('.btn-cerrar')?.addEventListener('click', hideRules);
}

function handleCellClick(row, col) {
    if (selectedCell === null) {
        if (board[row][col] === 1) {
            selectCell(row, col);
        }
    } else {
        if (isValidMove(selectedCell.row, selectedCell.col, row, col)) {
            makeMove(selectedCell.row, selectedCell.col, row, col);
        }
        clearSelection();
    }
}

function selectCell(row, col) {
    selectedCell = { row, col };
    validMoves = getValidMoves(row, col);
    
    // Actualizar visualización
    document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
        .classList.add('selected');
    
    validMoves.forEach(move => {
        document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`)
            .classList.add('valid-move');
    });
}

function clearSelection() {
    if (selectedCell) {
        document.querySelector(`[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"]`)
            .classList.remove('selected');
        
        validMoves.forEach(move => {
            document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`)
                .classList.remove('valid-move');
        });
    }
    selectedCell = null;
    validMoves = [];
}

function getValidMoves(row, col) {
    const moves = [];
    
    // Verificar movimientos horizontales y verticales
    [[-2, 0], [2, 0], [0, -2], [0, 2]].forEach(([deltaRow, deltaCol]) => {
        const newRow = row + deltaRow;
        const newCol = col + deltaCol;
        
        if (isValidPosition(newRow, newCol) && board[newRow][newCol] === 0) {
            const middleRow = row + deltaRow/2;
            const middleCol = col + deltaCol/2;
            
            if (board[middleRow][middleCol] === 1) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
    
    return moves;
}

function isValidPosition(row, col) {
    return row >= 0 && row < BOARD_SIZE && 
           col >= 0 && col < BOARD_SIZE && 
           board[row][col] !== 2;
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    return validMoves.some(move => move.row === toRow && move.col === toCol);
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    
    board[fromRow][fromCol] = 0;
    board[middleRow][middleCol] = 0;
    board[toRow][toCol] = 1;
    
    updateBoard();
    updateStats();
    checkGameEnd();
}

function updateBoard() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.className = getCellClass(row, col);
        }
    }
}

function updateStats() {
    movimientos++;
    puntuacion = calcularPuntuacion();
    document.getElementById('movimientos').textContent = movimientos;
    document.getElementById('puntuacion').textContent = puntuacion;
}

function calcularPuntuacion() {
    const fichasRestantes = contarFichas();
    const tiempoBonus = Math.max(0, 300 - tiempo);
    return (32 - fichasRestantes) * 100 + tiempoBonus;
}

function contarFichas() {
    return board.flat().filter(cell => cell === 1).length;
}

function checkGameEnd() {
    const hasPossibleMoves = board.some((row, rowIndex) => 
        row.some((cell, colIndex) => 
            cell === 1 && getValidMoves(rowIndex, colIndex).length > 0
        )
    );

    if (!hasPossibleMoves) {
        const fichasRestantes = contarFichas();
        if (fichasRestantes === 1) {
            setTimeout(() => alert('¡Felicitaciones! Has ganado el juego.'), 100);
        } else {
            setTimeout(() => alert('Juego terminado. No hay más movimientos posibles.'), 100);
        }
        clearInterval(timerInterval);
    }
}

function resetGame() {
    clearInterval(timerInterval);
    initializeGame();
}

function resetStats() {
    movimientos = 0;
    tiempo = 0;
    puntuacion = 0;
    document.getElementById('movimientos').textContent = movimientos;
    document.getElementById('tiempo').textContent = '00:00';
    document.getElementById('puntuacion').textContent = puntuacion;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        tiempo++;
        const minutos = Math.floor(tiempo / 60);
        const segundos = tiempo % 60;
        document.getElementById('tiempo').textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }, 1000);
}

function showRules() {
    document.getElementById('modal-reglas').style.display = 'block';
}

function hideRules() {
    document.getElementById('modal-reglas').style.display = 'none';
}
