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
        if (this.transition_table[key]) {
            const move_counts = this.transition_table[key];
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
// --- UI/game logic ---
const bot = new RPSBot(1);
let tie = 0, playerwins = 0, botwins = 0;
let playerHistory = [];
let botHistory = [];
function play(playerchoice) {
    const validMoves = ['Rock', 'Paper', 'Scissors'];
    if (!validMoves.includes(playerchoice)) {
        document.getElementById('result').textContent = 'Invalid move!';
        return;
    }
    const response = bot.respond();
    document.getElementById('botMove').textContent = `Bot plays: ${response}`;
    let resultText = '';
    if (playerchoice === response) {
        resultText = "It's a tie!";
        tie++;
    } else if (
        (playerchoice === 'Rock' && response === 'Scissors') ||
        (playerchoice === 'Paper' && response === 'Rock') ||
        (playerchoice === 'Scissors' && response === 'Paper')
    ) {
        resultText = 'You win!';
        playerwins++;
    } else {
        resultText = 'You lose!';
        botwins++;
    }
    document.getElementById('result').textContent = resultText;
    const total_games = playerwins + botwins + tie;
    document.getElementById('score').textContent = `Score - You: ${playerwins}, Bot: ${botwins}, Ties: ${tie}`;
    document.getElementById('winrates').textContent = `Total games played: ${total_games}\nWin rates - You: ${total_games ? (playerwins/total_games*100).toFixed(1) : 0}%, Bot: ${total_games ? (botwins/total_games*100).toFixed(1) : 0}%, Ties: ${total_games ? (tie/total_games*100).toFixed(1) : 0}%`;
    bot.update(playerchoice);
    playerHistory.push(playerchoice);
    botHistory.push(response);
    let historyHtml = '<b>History:</b><br>';
    for (let i = 0; i < playerHistory.length; i++) {
        historyHtml += `Round ${i+1}: You - ${playerHistory[i]}, Bot - ${botHistory[i]}<br>`;
    }
    document.getElementById('history').innerHTML = historyHtml;
}