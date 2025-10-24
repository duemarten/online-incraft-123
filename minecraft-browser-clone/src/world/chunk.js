class Chunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.blocks = [];
        this.generateBlocks();
    }

    generateBlocks() {
        // Logic to generate blocks in the chunk
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                this.blocks.push(new Block(i, j, this.getRandomBlockType()));
            }
        }
    }

    getRandomBlockType() {
        const blockTypes = ['grass', 'dirt', 'stone', 'sand'];
        return blockTypes[Math.floor(Math.random() * blockTypes.length)];
    }

    renderChunk(renderer) {
        this.blocks.forEach(block => {
            block.render(renderer);
        });
    }
}

export default Chunk;