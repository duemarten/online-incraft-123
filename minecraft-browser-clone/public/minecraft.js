/*
  Minecraft-lite (2D) — single-file game script.
  - Canvas-based tile world (grid)
  - Simple terrain generation
  - Player with left/right movement, jump, gravity
  - Place/break blocks with mouse (left=place, right=break)
  - Number keys pick block type; R resets world
  - No build step — open public/minecraft.html in Chrome
*/

(function () {
    const canvas = document.getElementById('mcCanvas');
    const ctx = canvas.getContext('2d');
    const modeEl = document.getElementById('mode');
    const selectedEl = document.getElementById('selected');

    // Tile config
    const TILE = 24; // pixels
    let cols = 40, rows = 25;

    function resize() {
        cols = Math.floor(window.innerWidth / TILE) || 20;
        rows = Math.floor(window.innerHeight / TILE) || 15;
        canvas.width = cols * TILE;
        canvas.height = rows * TILE;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    }
    window.addEventListener('resize', resize);
    resize();

    // Block types
    const BLOCKS = [
        { id: 0, name: 'Air', color: null, solid: false },
        { id: 1, name: 'Grass', color: '#3CAF2B', solid: true },
        { id: 2, name: 'Dirt', color: '#8B5A2B', solid: true },
        { id: 3, name: 'Stone', color: '#7f8c8d', solid: true },
        { id: 4, name: 'Water', color: '#2E86C1', solid: false, liquid: true }
    ];

    let world = null;
    function createWorld() {
        world = new Array(cols);
        for (let x = 0; x < cols; x++) {
            world[x] = new Array(rows).fill(0);
        }

        // Simple terrain: height via smoothed random
        const height = new Array(cols);
        let h = Math.floor(rows * 0.5);
        for (let x = 0; x < cols; x++) {
            h += Math.floor((Math.random() - 0.5) * 2);
            h = Math.max(Math.floor(rows * 0.25), Math.min(Math.floor(rows * 0.8), h));
            height[x] = h;
        }
        // Fill blocks
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (y > height[x]) world[x][y] = 0; // air above
                else if (y === height[x]) world[x][y] = 1; // grass
                else if (y > height[x] - 3) world[x][y] = 2; // dirt
                else world[x][y] = 3; // stone
            }
        }

        // Add small lakes (water) occasionally
        for (let i = 0; i < Math.floor(cols / 8); i++) {
            const cx = Math.floor(Math.random() * cols);
            for (let w = -2; w <= 2; w++) {
                const x = cx + w;
                if (x < 0 || x >= cols) continue;
                // find ground
                for (let y = 0; y < rows; y++) {
                    if (world[x][y] === 1) {
                        // make a small pit
                        for (let yy = y + 1; yy <= Math.min(rows - 1, y + 3); yy++) world[x][yy] = 4;
                        break;
                    }
                }
            }
        }
    }

    createWorld();

    // Player
    const player = {
        x: Math.floor(cols / 2) + 0.5, // in tile coords (float)
        y: 0,
        vx: 0,
        vy: 0,
        w: 0.8, // in tiles
        h: 1.6,
        onGround: false
    };

    // Put player above ground
    function placePlayer() {
        const px = Math.floor(player.x);
        for (let y = 0; y < rows; y++) {
            if (world[px] && world[px][y] && world[px][y] !== 0) {
                player.y = y - player.h - 0.01;
                break;
            }
        }
    }
    placePlayer();

    // Input
    const keys = {};
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        // number keys select block
        if (e.key >= '1' && e.key <= '4') {
            selectedBlock = parseInt(e.key, 10);
            updateUI();
        }
        if (e.key === 'r' || e.key === 'R') { createWorld(); placePlayer(); }
        // prevent arrow keys scrolling
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    // Mouse for place/break
    let mouse = { x: 0, y: 0 };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        mouse.x = Math.floor(cx / TILE);
        mouse.y = Math.floor(cy / TILE);
    });
    canvas.addEventListener('mousedown', (e) => {
        // left = place, right = break
        if (e.button === 0) placeBlock(mouse.x, mouse.y);
        if (e.button === 2) breakBlock(mouse.x, mouse.y);
    });
    // Disable context menu to allow right-click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    function placeBlock(x, y) {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return;
        // can't place inside player
        if (isRectOverlap(player.x, player.y, player.w, player.h, x, y, 1, 1)) return;
        world[x][y] = selectedBlock;
    }
    function breakBlock(x, y) {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return;
        world[x][y] = 0;
    }

    function isSolidAtTile(x, y) {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
        const id = world[x][y];
        return BLOCKS[id] && BLOCKS[id].solid;
    }

    function isRectOverlap(rx, ry, rw, rh, bx, by, bw, bh) {
        return !(rx + rw <= bx || rx >= bx + bw || ry + rh <= by || ry >= by + bh);
    }

    let selectedBlock = 1; // default grass
    function updateUI() {
        modeEl.textContent = 'Mode: Place';
        const b = BLOCKS[selectedBlock];
        selectedEl.textContent = `Block: ${b.name} (${selectedBlock})`;
    }
    updateUI();

    // Physics params
    const GRAV = 0.45; // tiles per frame^2
    const FRICTION = 0.85;
    const MAX_VX = 0.2;
    const JUMP_V = -8.5; // pixels per frame; we'll convert

    function step() {
        // Controls
        let ax = 0;
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) ax = -0.12;
        if (keys['d'] || keys['D'] || keys['ArrowRight']) ax = 0.12;
        if ((keys[' '] || keys['w'] || keys['W'] || keys['ArrowUp']) && player.onGround) {
            player.vy = -9.2; // jump impulse
            player.onGround = false;
        }

        // Apply horizontal
        player.vx += ax;
        player.vx *= 0.9; // damping
        player.vx = Math.max(-0.45, Math.min(0.45, player.vx));

        // Gravity
        player.vy += GRAV;
        player.vy = Math.max(-12, Math.min(12, player.vy));

        // Attempt to move and resolve collisions
        movePlayer(player.vx, player.vy);
    }

    function movePlayer(dx, dy) {
        // Move X separately
        let newX = player.x + dx;
        if (!collidesAt(newX, player.y, player.w, player.h)) {
            player.x = newX;
        } else {
            // slide to nearest non-colliding position
            const sign = dx > 0 ? 1 : -1;
            let step = 0.02 * sign;
            let pos = player.x;
            while (Math.abs(pos - player.x) < Math.abs(dx)) {
                pos += step;
                if (collidesAt(pos, player.y, player.w, player.h)) {
                    pos -= step;
                    break;
                }
            }
            player.x = pos;
            player.vx = 0;
        }

        // Move Y
        let newY = player.y + dy / TILE; // convert pixels-like vy? our vy measured in pixels-ish; but world in tiles
        // Our vy is in pixels; convert tile movement
        // We'll treat player.vy as pixels per frame and convert: dyTiles = vy / TILE
        const dyTiles = player.vy / TILE;
        newY = player.y + dyTiles;
        if (!collidesAt(player.x, newY, player.w, player.h)) {
            player.y = newY;
            player.onGround = false;
        } else {
            // collided: if moving down, place on top
            if (player.vy > 0) {
                // snap to integer tile
                const foot = Math.floor(player.y + player.h);
                player.y = foot - player.h;
                player.onGround = true;
            } else if (player.vy < 0) {
                // hit ceiling
                player.y = Math.ceil(player.y) ;
            }
            player.vy = 0;
        }
    }

    function collidesAt(px, py, pw, ph) {
        const left = Math.floor(px);
        const right = Math.floor(px + pw - 1e-6);
        const top = Math.floor(py);
        const bottom = Math.floor(py + ph - 1e-6);
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (isSolidAtTile(x, y)) return true;
            }
        }
        return false;
    }

    // Draw loop
    function draw() {
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Blocks
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const id = world[x][y];
                if (id === 0) continue;
                const b = BLOCKS[id];
                ctx.fillStyle = b.color || '#000';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                // simple border
                ctx.strokeStyle = 'rgba(0,0,0,0.08)';
                ctx.strokeRect(x * TILE + 0.5, y * TILE + 0.5, TILE - 1, TILE - 1);
            }
        }

        // Draw player (rectangle)
        const px = player.x * TILE;
        const py = player.y * TILE;
        ctx.fillStyle = '#FFD966';
        ctx.fillRect(px, py, player.w * TILE, player.h * TILE);
        ctx.strokeStyle = '#00000050';
        ctx.strokeRect(px + 0.5, py + 0.5, player.w * TILE - 1, player.h * TILE - 1);

        // Draw hovered tile
        if (mouse.x >= 0 && mouse.x < cols && mouse.y >= 0 && mouse.y < rows) {
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(mouse.x * TILE, mouse.y * TILE, TILE, TILE);
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.strokeRect(mouse.x * TILE + 0.5, mouse.y * TILE + 0.5, TILE - 1, TILE - 1);
        }
    }

    function loop() {
        step();
        draw();
        requestAnimationFrame(loop);
    }

    // Basic camera: center on player by translating canvas
    // Instead of transforming canvas we will keep simple: entire world visible since canvas sized to fit.

    // Public helpers in file to adjust selected block via keyboard
    window.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '4') { selectedBlock = parseInt(e.key, 10); updateUI(); }
    });

    // Start
    requestAnimationFrame(loop);
})();
