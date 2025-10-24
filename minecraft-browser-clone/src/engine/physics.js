class Physics {
    constructor() {
        this.gravity = 9.81; // Gravity constant
        this.objects = []; // Array to hold objects for collision detection
    }

    updatePhysics(deltaTime) {
        // Update the position of each object based on velocity and gravity
        this.objects.forEach(object => {
            object.velocity.y -= this.gravity * deltaTime; // Apply gravity
            object.position.x += object.velocity.x * deltaTime;
            object.position.y += object.velocity.y * deltaTime;
        });
    }

    checkCollisions() {
        // Simple AABB collision detection
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const objA = this.objects[i];
                const objB = this.objects[j];

                if (this.isColliding(objA, objB)) {
                    this.resolveCollision(objA, objB);
                }
            }
        }
    }

    isColliding(objA, objB) {
        return (objA.position.x < objB.position.x + objB.width &&
                objA.position.x + objA.width > objB.position.x &&
                objA.position.y < objB.position.y + objB.height &&
                objA.position.y + objA.height > objB.position.y);
    }

    resolveCollision(objA, objB) {
        // Simple collision resolution
        const overlapX = (objA.position.x + objA.width / 2) - (objB.position.x + objB.width / 2);
        const overlapY = (objA.position.y + objA.height / 2) - (objB.position.y + objB.height / 2);

        if (Math.abs(overlapX) < Math.abs(overlapY)) {
            if (overlapX > 0) {
                objA.position.x += overlapX; // Move objA out of objB
            } else {
                objB.position.x -= overlapX; // Move objB out of objA
            }
        } else {
            if (overlapY > 0) {
                objA.position.y += overlapY; // Move objA out of objB
            } else {
                objB.position.y -= overlapY; // Move objB out of objA
            }
        }
    }

    addObject(object) {
        this.objects.push(object);
    }
}

export default Physics;