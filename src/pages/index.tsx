import { useState } from 'react';
import { QLearningAgent } from '@/lib/qLearning';
import { SnakeEnv } from '@/lib/snakeEnv';
import GameBoard from '@/components/GameBoard';
import Controls from '@/components/Controls';
import TrainingPanel from '@/components/TrainingPanel';

const env = new SnakeEnv(10);
const agent = new QLearningAgent(4);

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);
    const [isTraining, setIsTraining] = useState(false);

    const startGame = () => {
        console.log('Start button clicked');
        setIsRunning(true);
    
        const tick = () => {
            const state = env.getState().toString();
            const action = agent.getAction(state);
            const nextState = env.step(action).toString();
            const reward = env.isDone() ? -10 : 1;
            agent.update(state, action, reward, nextState);
    
            if (env.isDone()) {
                console.log('Game Over');
                env.reset(); // ✅ Réinitialisation de l'environnement
                setTimeout(tick, 200); // ✅ On redémarre immédiatement le jeu
            } else {
                setTimeout(tick, 200);
            }
        };
    
        tick(); // Lance la boucle d'inférence
    };
    
    

    const pauseGame = () => {
        setIsRunning(false);
    };

    const stopGame = () => {
        setIsRunning(false);
        env.reset();
    };

    const startTraining = () => {
        setIsTraining(true);
    
        const train = () => {
            if (!isTraining) return;
    
            const state = env.getState().toString();
            console.log(`Training state: ${state}`); // ✅ Vérifie l'état d'entraînement
    
            const action = agent.getAction(state);
            console.log(`Training action: ${action}`); // ✅ Vérifie si une action est prise
    
            const nextState = env.step(action).toString();
            console.log(`Training next state: ${nextState}`); // ✅ Vérifie si le jeu progresse
    
            const reward = env.isDone() ? -10 : 1;
            agent.update(state, action, reward, nextState);
    
            if (!env.isDone()) {
                setTimeout(train, 50);
            } else {
                console.log('Training ended');
                setIsTraining(false);
            }
        };
    
        train();
    };
    

    const stopTraining = () => {
        setIsTraining(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Snake AI Platform</h1>
            <GameBoard env={env} isRunning={isRunning} />
            <Controls onStart={startGame} onPause={pauseGame} onStop={stopGame} isRunning={isRunning} />
            <TrainingPanel onStartTraining={startTraining} onStopTraining={stopTraining} isTraining={isTraining} />
        </div>
    );
}
