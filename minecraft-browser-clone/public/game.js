// Simple Snake game that runs directly in the browser (no build/servers required).
// Controls: Arrow keys (or WASD). Click Start to begin or restart.

(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');

    // Grid size (pixels per cell)
    const GRID = 20;

    let width, height, cols, rows;

    function resize() {
        // Fill the window while keeping whole grid cells
        width = window.innerWidth;
        height = window.innerHeight;
        cols = Math.floor(width / GRID);
        rows = Math.floor(height / GRID);
        canvas.width = cols * GRID;
        canvas.height = rows * GRID;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    }

    window.addEventListener('resize', resize);
    resize();

    // Game state
    let snake, apple, tickInterval, running, score;

    function reset() {
        // Start in the middle
        snake = {
            x: Math.floor(cols / 2),
            y: Math.floor(rows / 2),
            dx: 1,
            dy: 0,
            cells: [],
            maxCells: 4,
        };
        placeApple();
        score = 0;
        scoreEl.textContent = 'Score: ' + score;
        running = false;
        tickInterval = 8; // lower = faster
    }

    function placeApple() {
        apple = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
        // Avoid placing apple on the snake
        if (snake) {
            for (const c of snake.cells) {
                if (c.x === apple.x && c.y === apple.y) return placeApple();
            }
        }
    }

    function start() {
        reset();
        running = true;
    }

    function gameOver() {
        running = false;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over — Score: ' + score, canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '18px Arial';
        ctx.fillText('Press Start or Arrow Key to restart', canvas.width / 2, canvas.height / 2 + 20);
    }

    // Input
    const keys = {};
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        keys[key] = true;
        // If game not running, start on arrow/WASD
        if (!running && (key.startsWith('Arrow') || ['w','a','s','d','W','A','S','D'].includes(key))) {
            start();
        }
    });
    window.addEventListener('keyup', (e) => { delete keys[e.key]; });

    function handleInput() {
        // Map keys to direction; prevent immediate reverse
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            if (snake.dx !== 1) { snake.dx = -1; snake.dy = 0; }
        } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            if (snake.dx !== -1) { snake.dx = 1; snake.dy = 0; }
        } else if (keys['ArrowUp'] || keys['w'] || keys['W']) {
            if (snake.dy !== 1) { snake.dx = 0; snake.dy = -1; }
        } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            if (snake.dy !== -1) { snake.dx = 0; snake.dy = 1; }
        }
    }

    // Main loop
    let frame = 0;
    function loop() {
        requestAnimationFrame(loop);
        if (!running) return; // nothing to update when paused/not started

        frame++;
        if (frame % tickInterval !== 0) return; // control speed

        handleInput();

        // Move snake head
        snake.x += snake.dx;
        snake.y += snake.dy;

        // Wrap around edges
        if (snake.x < 0) snake.x = cols - 1;
        if (snake.x >= cols) snake.x = 0;
        if (snake.y < 0) snake.y = rows - 1;
        if (snake.y >= rows) snake.y = 0;

        // Add head position to front of cells
        snake.cells.unshift({ x: snake.x, y: snake.y });

        // Trim cells to max length
        while (snake.cells.length > snake.maxCells) snake.cells.pop();

        // Check apple collision
        if (snake.x === apple.x && snake.y === apple.y) {
            snake.maxCells++;
            score += 1;
            scoreEl.textContent = 'Score: ' + score;
            placeApple();
            // Speed up slightly every few points
            if (score % 5 === 0 && tickInterval > 3) tickInterval--;
        }

        // Check collision with self
        for (let i = 1; i < snake.cells.length; i++) {
            if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
                gameOver();
                return;
            }
        }

        // Draw
        ctx.fillStyle = '#0b7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw apple
        ctx.fillStyle = '#d22';
        ctx.fillRect(apple.x * GRID, apple.y * GRID, GRID, GRID);

        // Draw snake
        ctx.fillStyle = '#063';
        for (const c of snake.cells) {
            ctx.fillRect(c.x * GRID + 1, c.y * GRID + 1, GRID - 2, GRID - 2);
        }
    }

    // Start button
    startBtn.addEventListener('click', () => {
        start();
    });

    // Start loop (but game waits until Start clicked or arrow pressed)
    reset();
    requestAnimationFrame(loop);

    // Allow starting with a first key press
    window.addEventListener('keydown', (e) => {
        if (!running && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','W','A','S','D'].includes(e.key)) {
            start();
        }
    });
})();
