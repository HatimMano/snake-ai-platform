import React, { useEffect, useRef } from 'react';
import { SnakeEnv } from '@/lib/snakeEnv';

// Define component props
interface Props {
    env: SnakeEnv; // Snake environment instance
    isRunning: boolean; // State to track if the game is running
}

// Define grid size and cell size constants
const cellSize = 40;
const gridSize = 10;

const GameBoard: React.FC<Props> = ({ env, isRunning }) => {
    // Reference to the canvas element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    /**
     * Draws the game state onto the canvas.
     * - Clears the canvas.
     * - Draws the snake and the food on the grid.
     */
    const drawCanvas = () => {
        console.log('Drawing canvas...'); // ✅ Debugging output to confirm function is called

        // Get the canvas element
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get the canvas context (for 2D drawing)
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ===== Draw the Snake =====
        ctx.fillStyle = 'green';

        // Get the current state of the game
        const state = env.getState();

        // Draw the snake's body
        state.slice(0, -2).forEach((_, index, arr) => {
            const x = arr[index * 2] * cellSize;
            const y = arr[index * 2 + 1] * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
        });

        // ===== Draw the Food =====
        ctx.fillStyle = 'red';

        // Get the food position (last two elements in state array)
        const foodX = state[state.length - 2] * cellSize;
        const foodY = state[state.length - 1] * cellSize;
        ctx.fillRect(foodX, foodY, cellSize, cellSize);
    };

    /**
     * useEffect Hook:
     * - Runs the game loop at regular intervals when the game is running.
     * - Stops the loop when the game ends.
     */
    useEffect(() => {
        if (isRunning) {
            console.log('Game is running...'); // ✅ Confirm that the game loop starts

            // Run the game loop at 100ms intervals
            const interval = setInterval(() => {
                drawCanvas(); // Render the game state
            }, 100);

            // Clean up interval when component unmounts or state changes
            return () => clearInterval(interval);
        }
    }, [isRunning, env]); // ✅ Dependencies: re-run the effect when `isRunning` or `env` changes

    /**
     * Render a canvas element to display the game.
     */
    return (
        <canvas
            ref={canvasRef}
            width={gridSize * cellSize}
            height={gridSize * cellSize}
            style={{
                border: '2px solid #444',
                backgroundColor: '#1e1e1e',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                borderRadius: '8px',
            }}
        />

    );
};

export default GameBoard;
