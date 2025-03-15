import React, { useEffect, useRef } from 'react';
import { SnakeEnv } from '@/lib/snakeEnv';

interface Props {
    env: SnakeEnv;
    isRunning: boolean;
}

const cellSize = 40;
const gridSize = 10;

const GameBoard: React.FC<Props> = ({ env, isRunning }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCanvas = () => {
        console.log('Drawing canvas...'); // ✅ Test si la fonction est appelée
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner le serpent
        ctx.fillStyle = 'green';
        env.getState().slice(0, -2).forEach((_, index, state) => {
            const x = state[index * 2] * cellSize;
            const y = state[index * 2 + 1] * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
        });

        // Dessiner la nourriture
        ctx.fillStyle = 'red';
        const state = env.getState();
        const foodX = state[state.length - 2] * cellSize;
        const foodY = state[state.length - 1] * cellSize;
        ctx.fillRect(foodX, foodY, cellSize, cellSize);
    };

    useEffect(() => {
        if (isRunning) {
            console.log('Game is running...'); // ✅ Vérification que la boucle démarre
            const interval = setInterval(() => {
                drawCanvas();
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isRunning, env]);

    // ✅ Retour explicite d'un élément JSX
    return (
        <canvas
            ref={canvasRef}
            width={gridSize * cellSize}
            height={gridSize * cellSize}
            style={{ border: '1px solid black' }}
        />
    );
};

export default GameBoard;
