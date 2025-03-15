import React from 'react';

interface Props {
    onStart: () => void;
    onPause: () => void;
    onStop: () => void;
    isRunning: boolean;
}

const Controls: React.FC<Props> = ({ onStart, onPause, onStop, isRunning }) => {
    return (
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={onStart} disabled={isRunning}>Start</button>
            <button onClick={onPause} disabled={!isRunning}>Pause</button>
            <button onClick={onStop} disabled={!isRunning}>Stop</button>
        </div>
    );
};

export default Controls;
