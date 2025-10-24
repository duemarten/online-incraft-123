export function generateWorld() {
    const world = [];
    const chunkSize = 16; // Size of each chunk
    const numChunks = 10; // Number of chunks to generate

    for (let x = 0; x < numChunks; x++) {
        const chunk = [];
        for (let z = 0; z < numChunks; z++) {
            const blocks = generateBlocks(chunkSize);
            chunk.push(blocks);
        }
        world.push(chunk);
    }

    return world;
}

function generateBlocks(size) {
    const blocks = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                const blockType = Math.random() < 0.5 ? 'grass' : 'dirt'; // Simple block generation logic
                blocks.push({ type: blockType, position: { x, y, z } });
            }
        }
    }
    return blocks;
}