type QTable = Record<string, number[]>;

export class QLearningAgent {
    private QTable: QTable = {};
    private alpha = 0.1;
    private gamma = 0.99;
    private epsilon = 0.1;
    private epsilonDecay = 0.995;
    private epsilonMin = 0.01;

    constructor(private numActions: number) {}

    getAction(state: string): number {
        if (Math.random() < this.epsilon) {
            // Exploration → Mouvement aléatoire
            return Math.floor(Math.random() * this.numActions);
        } else {
            if (!this.QTable[state]) {
                // ✅ Initialise la table avec de petites valeurs aléatoires (biais)
                this.QTable[state] = Array.from({ length: this.numActions }, () => Math.random() * 0.01);
                return Math.floor(Math.random() * this.numActions);
            }
    
            // ✅ Vérification si toutes les valeurs sont identiques → Action aléatoire
            const isUniform = this.QTable[state].every(v => v === this.QTable[state][0]);
            if (isUniform) {
                return Math.floor(Math.random() * this.numActions);
            }
    
            // ✅ Exploitation → Prendre la meilleure action
            return this.QTable[state].indexOf(Math.max(...this.QTable[state]));
        }
    }
        
    

    update(state: string, action: number, reward: number, nextState: string) {
        if (!this.QTable[state]) {
            this.QTable[state] = new Array(this.numActions).fill(0);
        }
    
        if (!this.QTable[nextState]) {
            this.QTable[nextState] = new Array(this.numActions).fill(0);
        }
    
        const target = reward + this.gamma * Math.max(...this.QTable[nextState]);
        this.QTable[state][action] += this.alpha * (target - this.QTable[state][action]);
    
        // ✅ Ajout de bruit → Encourage l'exploration
        this.QTable[state][action] += (Math.random() - 0.5) * 0.01;
    }
    

    getQTable() {
        return this.QTable;
    }

    loadQTable(data: QTable) {
        this.QTable = data;
    }
}
