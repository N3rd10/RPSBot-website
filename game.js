// --- Bot logic ---
class RPSBot {
    constructor(move_memory) {
        this.move_memory = move_memory;
        this.transition_table = {};
        this.player_history = [];
    }

    update(player_move) {
        this.player_history.push(player_move);
        if (this.player_history.length > this.move_memory + 1) {
            this.player_history.shift();
        }

        if (this.player_history.length > this.move_memory) {
            const key = this.player_history.slice(0, -1).join(',');
            const next_move = this.player_history[this.player_history.length - 1];
            if (!this.transition_table[key]) {
                this.transition_table[key] = { Rock: 0, Paper: 0, Scissors: 0 };
            }
            this.transition_table[key][next_move] += 1;
        }
    }

    predict() {
        if (this.player_history.length < this.move_memory) {
            return this.randomMove();
        }

        const key = this.player_history.slice(-this.move_memory).join(',');
        const move_counts = this.transition_table[key];

        if (move_counts) {
            let predicted = 'Rock';
            let maxCount = move_counts['Rock'];
            for (const move of ['Paper', 'Scissors']) {
                if (move_counts[move] > maxCount) {
                    predicted = move;
                    maxCount = move_counts[move];
                }
            }
            return predicted;
        } else {
            return this.randomMove();
        }
    }

    respond() {
        const predicted = this.predict();
        return { Rock: 'Paper', Paper: 'Scissors', Scissors: 'Rock' }[predicted];
    }

    randomMove() {
        const moves = ['Rock', 'Paper', 'Scissors'];
        return moves[Math.floor(Math.random() * moves.length)];
    }
}

export { RPSBot };
