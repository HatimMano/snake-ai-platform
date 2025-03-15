export class SnakeEnv {
    // Grid size for the game board
    private gridSize = 10;

    // Snake body represented as an array of coordinates [x, y]
    private snake: number[][] = [[5, 5]];

    // Food position represented as [x, y]
    private food: number[] = [2, 2];

    // Game status flag
    private done = false;

    constructor(gridSize: number = 10) {
        this.gridSize = gridSize;
        this.reset();
    }

    /**
     * Reset the game state:
     * - Reset snake position.
     * - Generate new food.
     * - Reset game status.
     */
    reset() {
        this.snake = [[Math.floor(this.gridSize / 2), Math.floor(this.gridSize / 2)]];
        this.food = this._generateFood();
        this.done = false;

        return this.getState();
    }

    /**
     * Execute a step in the game based on the action taken:
     * - Action 0 → Up
     * - Action 1 → Down
     * - Action 2 → Left
     * - Action 3 → Right
     * 
     * @param action - Action to perform (0–3)
     * @returns [newState, reward, done]
     */
    step(action: number): [number[], number, boolean] {
        if (this.done) return [this.getState(), -10, true];

        // ✅ Distance before moving (Manhattan distance)
        const oldDistance = Math.abs(this.food[0] - this.snake[0][0]) +
                            Math.abs(this.food[1] - this.snake[0][1]);

        // ===== Calculate new head position based on action =====
        let newHead = [...this.snake[0]];

        if (action === 0) newHead[1] -= 1; // Up
        if (action === 1) newHead[1] += 1; // Down
        if (action === 2) newHead[0] -= 1; // Left
        if (action === 3) newHead[0] += 1; // Right

        // ===== Collision handling =====
        if (
            newHead[0] < 0 || newHead[1] < 0 || 
            newHead[0] >= this.gridSize || newHead[1] >= this.gridSize || 
            this.snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
        ) {
            this.done = true;
            return [this.getState(), -10, true]; // ✅ High penalty for collision
        }

        // ✅ Update snake position
        this.snake.unshift(newHead);

        // ===== Check if food is eaten =====
        let reward = -0.01; // Small penalty to encourage faster play

        if (newHead[0] === this.food[0] && newHead[1] === this.food[1]) {
            reward = 20; // ✅ High reward for eating food
            this.food = this._generateFood(); // ✅ Generate new food
        } else {
            this.snake.pop(); // ✅ Remove tail if no food is eaten
        }

        // ✅ Distance after moving
        const newDistance = Math.abs(this.food[0] - newHead[0]) +
                            Math.abs(this.food[1] - newHead[1]);

        // ===== Reward based on distance change =====
        if (newDistance < oldDistance) {
            reward += 5; // ✅ Bonus for getting closer to food
        } else if (newDistance > oldDistance) {
            reward -= 5; // ✅ Penalty for moving away from food
        }

        return [this.getState(), reward, this.done];
    }

    /**
     * Get the current game state:
     * - Snake's body coordinates flattened.
     * - Food coordinates.
     */
    getState(): number[] {
        return [...this.snake.flat(), ...this.food];
    }

    /**
     * Check if the game is over.
     * @returns true if game over, false otherwise
     */
    isDone(): boolean {
        return this.done;
    }

    /**
     * Generate a new food position on the grid.
     * Ensures that the food does not appear on the snake's body.
     */
    private _generateFood(): number[] {
        let newFood: number[];

        do {
            newFood = [
                Math.floor(Math.random() * this.gridSize),
                Math.floor(Math.random() * this.gridSize)
            ];
        } while (
            this.snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])
        );

        return newFood;
    }
}
