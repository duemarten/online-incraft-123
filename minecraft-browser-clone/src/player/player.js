class Player {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
        this.inventory = [];
        this.speed = 1;
        this.jumpHeight = 5;
        this.isJumping = false;
    }

    move(direction) {
        switch (direction) {
            case 'forward':
                this.position.z -= this.speed;
                break;
            case 'backward':
                this.position.z += this.speed;
                break;
            case 'left':
                this.position.x -= this.speed;
                break;
            case 'right':
                this.position.x += this.speed;
                break;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.position.y += this.jumpHeight;
            setTimeout(() => {
                this.isJumping = false;
                this.position.y -= this.jumpHeight; // Simulate falling back down
            }, 1000); // Jump duration
        }
    }

    addToInventory(item) {
        this.inventory.push(item);
    }

    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
    }
}

export default Player;