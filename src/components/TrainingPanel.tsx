import React, { useState } from 'react';

interface Props {
    onStartTraining: () => void;
    onStopTraining: () => void;
    isTraining: boolean;
}

const TrainingPanel: React.FC<Props> = ({ onStartTraining, onStopTraining, isTraining }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Training Status: {isTraining ? 'Training...' : 'Idle'}</h3>
            <button onClick={onStartTraining} disabled={isTraining}>Start Training</button>
            <button onClick={onStopTraining} disabled={!isTraining}>Stop Training</button>
        </div>
    );
};

export default TrainingPanel;
