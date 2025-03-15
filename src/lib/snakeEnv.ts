export class SnakeEnv {
    private gridSize = 10;
    private snake: number[][] = [[5, 5]];
    private food: number[] = [2, 2];
    private done = false;

    constructor(gridSize: number = 10) {
        this.gridSize = gridSize;
        this.reset();
    }

    reset() {
        this.snake = [[Math.floor(this.gridSize / 2), Math.floor(this.gridSize / 2)]];
        this.food = this._generateFood();
        this.done = false;
        return this.getState();
    }

    step(action: number) {
        if (this.done) return this.getState(), -10, true;
    
        // ✅ Distance avant déplacement
        const oldDistance = Math.abs(this.food[0] - this.snake[0][0]) + Math.abs(this.food[1] - this.snake[0][1]);
    
        let newHead = [...this.snake[0]];
        if (action === 0) newHead[1] -= 1; // Up
        if (action === 1) newHead[1] += 1; // Down
        if (action === 2) newHead[0] -= 1; // Left
        if (action === 3) newHead[0] += 1; // Right
    
        // ✅ Collision avec le mur
        if (
            newHead[0] < 0 || newHead[1] < 0 ||
            newHead[0] >= this.gridSize || newHead[1] >= this.gridSize ||
            this.snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
        ) {
            this.done = true;
            return this.getState(), -10, true; // Pénalité forte si collision
        }
    
        // ✅ Mise à jour de la position du serpent
        this.snake.unshift(newHead);
    
        // ✅ Si le serpent mange la nourriture
        let reward = -0.01;
        if (newHead[0] === this.food[0] && newHead[1] === this.food[1]) {
            reward = 20; // Grosse récompense si nourriture mangée
            this.food = this._generateFood();
        } else {
            this.snake.pop(); // Supprimer la queue si rien n'a été mangé
        }
    
        // ✅ Distance après déplacement
        const newDistance = Math.abs(this.food[0] - newHead[0]) + Math.abs(this.food[1] - newHead[1]);
    
        // ✅ Récompense/pénalité basée sur la distance
        if (newDistance < oldDistance) {
            reward += 5; // ✅ Bonus si le serpent se rapproche
        } else if (newDistance > oldDistance) {
            reward -= 5; // ✅ Pénalité si le serpent s'éloigne
        }
    
        return this.getState(), reward, this.done;
    }
    

    getState() {
        return [...this.snake.flat(), ...this.food];
    }
    

    isDone() {
        return this.done;
    }

    private _generateFood() {
        let newFood: number[];
        do {
            newFood = [
                Math.floor(Math.random() * this.gridSize),
                Math.floor(Math.random() * this.gridSize)
            ];
        } while (this.snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
        return newFood;
    }
}
