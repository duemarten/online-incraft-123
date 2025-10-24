class Input {
    constructor() {
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };

        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        window.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        });
    }

    getKeyPress(key) {
        return this.keys[key] || false;
    }

    getMousePosition() {
        return this.mousePosition;
    }
}

export default Input;