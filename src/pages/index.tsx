import { useState } from 'react';
import { QLearningAgent } from '@/lib/qLearning';
import { SnakeEnv } from '@/lib/snakeEnv';
import GameBoard from '@/components/GameBoard';
import Controls from '@/components/Controls';
import TrainingPanel from '@/components/TrainingPanel';
import useWebSocket from '@/hooks/useWebSocket';

const env = new SnakeEnv(10);
const agent = new QLearningAgent(4);
const socketUrl = 'ws://localhost:3001';

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);
    const [isTraining, setIsTraining] = useState(false);

    const { state, isConnected, sendMessage } = useWebSocket(socketUrl);

    if (isConnected && state.length > 0) {
        env.reset();
        env.step(state[0]);
    }

    const startGame = () => {
        setIsRunning(true);

        const tick = () => {
            if (!isRunning) return;

            const state = env.getState().toString();
            const action = agent.getAction(state);
            sendMessage({ action });

            const nextState = env.step(action).toString();
            const reward = env.isDone() ? -10 : 1;
            agent.update(state, action, reward, nextState);

            if (env.isDone()) {
                env.reset();
                setTimeout(tick, 200);
            } else {
                setTimeout(tick, 200);
            }
        };

        tick();
    };

    const pauseGame = () => setIsRunning(false);
    const stopGame = () => {
        setIsRunning(false);
        env.reset();
    };

    const startTraining = () => {
        setIsTraining(true);

        const train = () => {
            if (!isTraining) return;

            const state = env.getState().toString();
            const action = agent.getAction(state);
            sendMessage({ action });

            const nextState = env.step(action).toString();
            const reward = env.isDone() ? -10 : 1;
            agent.update(state, action, reward, nextState);

            if (!env.isDone()) {
                setTimeout(train, 50);
            } else {
                setIsTraining(false);
            }
        };

        train();
    };

    const stopTraining = () => setIsTraining(false);

    return (
        <div className="container">
            <h1>Snake AI Platform</h1>

            <div className="game-wrapper">
                <div className="game-area">
                    <GameBoard env={env} isRunning={isRunning} />
                    <Controls
                        onStart={startGame}
                        onPause={pauseGame}
                        onStop={stopGame}
                        isRunning={isRunning}
                    />
                </div>
                <TrainingPanel
                    onStartTraining={startTraining}
                    onStopTraining={stopTraining}
                    isTraining={isTraining}
                />
            </div>

            <p className="status">
                Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </p>
        </div>
    );
}
