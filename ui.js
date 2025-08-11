import { RPSBot } from './game.js';

const bot = new RPSBot(1);
let tie = 0, playerwins = 0, botwins = 0;
let playerHistory = [], botHistory = [];

function play(playerchoice) {
    const validMoves = ['Rock', 'Paper', 'Scissors'];
    if (!validMoves.includes(playerchoice)) {
        updateText('result', 'Invalid move!');
        return;
    }

    const response = bot.respond();
    updateText('botMove', `Bot plays: ${response}`);

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

    updateText('result', resultText);

    const total_games = playerwins + botwins + tie;
    updateText('score', `Score - You: ${playerwins}, Bot: ${botwins}, Ties: ${tie}`);
    updateText('winrates', `Total games played: ${total_games}
Win rates - You: ${total_games ? (playerwins/total_games*100).toFixed(1) : 0}%, Bot: ${total_games ? (botwins/total_games*100).toFixed(1) : 0}%, Ties: ${total_games ? (tie/total_games*100).toFixed(1) : 0}%`);

    bot.update(playerchoice);
    playerHistory.push(playerchoice);
    botHistory.push(response);

    let historyHtml = '<b>History:</b><br>';
    for (let i = 0; i < playerHistory.length; i++) {
        historyHtml += `Round ${i+1}: You - ${playerHistory[i]}, Bot - ${botHistory[i]}<br>`;
    }
    updateHTML('history', historyHtml);
}

function updateText(id, text) {
    document.getElementById(id).textContent = text;
}

function updateHTML(id, html) {
    document.getElementById(id).innerHTML = html;
}

window.play = play; // Expose to HTML