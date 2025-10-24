class Controls {
    constructor(player) {
        this.player = player;
        this.keys = {};
        this.init();
    }

    init() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }

    handleInput() {
        if (this.keys['KeyW']) {
            this.player.move(0, -1); // Move up
        }
        if (this.keys['KeyS']) {
            this.player.move(0, 1); // Move down
        }
        if (this.keys['KeyA']) {
            this.player.move(-1, 0); // Move left
        }
        if (this.keys['KeyD']) {
            this.player.move(1, 0); // Move right
        }
        if (this.keys['Space']) {
            this.player.jump(); // Jump
        }
    }

    updateControls() {
        this.handleInput();
    }
}

export default Controls;