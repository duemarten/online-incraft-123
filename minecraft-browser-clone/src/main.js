// Entry point of the Minecraft-like browser game
import { Renderer } from './engine/renderer.js';
import { Physics } from './engine/physics.js';
import { Input } from './engine/input.js';
import { generateWorld } from './world/worldGen.js';
import { Player } from './player/player.js';
import { Controls } from './player/controls.js';

// Initialize game variables
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const renderer = new Renderer(context);
const physics = new Physics();
const input = new Input();
const player = new Player();
const controls = new Controls(player);

// Generate the initial game world
const world = generateWorld();

// Game loop
function gameLoop() {
    // Update game state
    physics.updatePhysics(player, world);
    controls.handleInput();
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render the game world and player
    renderer.renderWorld(world);
    renderer.renderPlayer(player);
    
    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();