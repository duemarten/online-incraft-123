class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    renderWorld(world) {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render each chunk in the world
        world.chunks.forEach(chunk => {
            chunk.renderChunk(this.context);
        });
    }

    renderPlayer(player) {
        // Render the player at its current position
        this.context.fillStyle = 'blue'; // Example color for the player
        this.context.fillRect(player.position.x, player.position.y, 50, 50); // Example player size
    }
}

export default Renderer;