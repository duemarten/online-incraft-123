class Block {
    constructor(type, position) {
        this.type = type; // Type of the block (e.g., dirt, stone, grass)
        this.position = position; // Position of the block in the world
    }

    render(context) {
        // Render the block on the canvas
        context.fillStyle = this.getColor();
        context.fillRect(this.position.x, this.position.y, 1, 1); // Assuming each block is 1x1 unit
    }

    getColor() {
        // Return color based on block type
        switch (this.type) {
            case 'dirt':
                return '#8B4513'; // Brown color for dirt
            case 'stone':
                return '#A9A9A9'; // Gray color for stone
            case 'grass':
                return '#7CFC00'; // Green color for grass
            default:
                return '#FFFFFF'; // Default to white for unknown types
        }
    }
}

export default Block;