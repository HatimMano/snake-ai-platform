// Define the type for the Q-Table: a record of state-action values
type QTable = Record<string, number[]>;

export class QLearningAgent {
    // Q-Table to store the state-action values
    private QTable: QTable = {};

    // Learning rate (controls how much new information overrides old information)
    private alpha = 0.1;

    // Discount factor (controls the importance of future rewards)
    private gamma = 0.99;

    // Exploration rate (probability of taking a random action)
    private epsilon = 0.1;

    // Decay rate for epsilon (reduces exploration over time)
    private epsilonDecay = 0.995;

    // Minimum value for epsilon to prevent total exploitation
    private epsilonMin = 0.01;

    constructor(private numActions: number) {}

    /**
     * Get the action to take based on the current state.
     * Uses the epsilon-greedy strategy:
     * - Explore (random action) with probability epsilon.
     * - Exploit (best known action) with probability (1 - epsilon).
     */
    getAction(state: string): number {
        if (Math.random() < this.epsilon) {
            // ✅ Exploration → Take a random action
            return Math.floor(Math.random() * this.numActions);
        } else {
            // If the state is not in the Q-Table, initialize it with small random values
            if (!this.QTable[state]) {
                this.QTable[state] = Array.from(
                    { length: this.numActions },
                    () => Math.random() * 0.01 // ✅ Small bias to encourage exploration
                );
                return Math.floor(Math.random() * this.numActions);
            }

            // ✅ Check if all Q-values for this state are identical → Take a random action
            const isUniform = this.QTable[state].every(v => v === this.QTable[state][0]);
            if (isUniform) {
                return Math.floor(Math.random() * this.numActions);
            }

            // ✅ Exploitation → Take the action with the highest Q-value
            return this.QTable[state].indexOf(Math.max(...this.QTable[state]));
        }
    }

    /**
     * Update the Q-Table based on the agent's experience.
     * Formula:
     * Q(s, a) = Q(s, a) + α * [reward + γ * max(Q(s', a')) - Q(s, a)]
     * - α (alpha) = learning rate
     * - γ (gamma) = discount factor
     */
    update(state: string, action: number, reward: number, nextState: string) {
        // If the state or next state is not in the Q-Table, initialize them
        if (!this.QTable[state]) {
            this.QTable[state] = new Array(this.numActions).fill(0);
        }

        if (!this.QTable[nextState]) {
            this.QTable[nextState] = new Array(this.numActions).fill(0);
        }

        // Bellman equation: target = reward + γ * max(Q(s', a'))
        const target = reward + this.gamma * Math.max(...this.QTable[nextState]);

        // Update Q-value using the learning rate
        this.QTable[state][action] += this.alpha * (target - this.QTable[state][action]);

        // ✅ Add small noise to encourage exploration (prevents local optima)
        this.QTable[state][action] += (Math.random() - 0.5) * 0.01;
    }

    /**
     * Return the current Q-Table.
     * Useful for debugging or saving the model state.
     */
    getQTable() {
        return this.QTable;
    }

    /**
     * Load a Q-Table from external data.
     * Useful for resuming training or using a pre-trained model.
     */
    loadQTable(data: QTable) {
        this.QTable = data;
    }
}
