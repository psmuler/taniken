const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const retryButton = document.getElementById('retryButton');
const obstacles = [];

let highScore = localStorage.getItem('highScore') || 0;
let score = 0;

let gameSpeed = 1;

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

function showStartScreen() {
    startScreen.style.display = 'flex';
}

function hideStartScreen() {
    startScreen.style.display = 'none';
}
startButton.addEventListener('click', () => {
    hideStartScreen();
    update();
});


// 画像の読み込み
const playerFrames = [
    'src/player_frame1.png',
    'src/player_frame2.png'
];

const playerImages = playerFrames.map((frame) => {
    const image = new Image();
    image.src = frame;
    return image;
});

let playerAnimationFrame = 0;

const obstacleImg = new Image();
obstacleImg.src = 'src/obstacle.png'; // 障害物の画像ファイルへのパス

const initialPlayerSpeed = 5;
const initialObstacleSpeed = 5;

function initializeSpeeds() {
    player.speed = initialPlayerSpeed;
    // obstacle.speed = initialObstacleSpeed;
}

function updateSpeeds() {
    gameSpeed = 1 + Math.floor(score / 300) * 0.2;
    player.speed = initialPlayerSpeed * gameSpeed;
    // obstacle.speed = initialObstacleSpeed * gameSpeed;
}

const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 60,
    speed: 5,
    jumping: false,
};
const obstacle = {
    x: canvas.width,
    y: 320,
    width: 30,
    height: 40,
    speed: 5,
};

function drawPlayer() {
    ctx.drawImage(playerImages[playerAnimationFrame], player.x, player.y, player.width, player.height);
}
function drawObstacle(obstacle) {
    ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}


canvas.addEventListener('click', () => {
    if (!player.jumping) {
        player.jumping = true;
    }
});
function isColliding(obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            return true;
        }
    }
    return false;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: 320,
        width: 30,
        height: 40,
    };
    obstacles.push(obstacle);
}
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= initialObstacleSpeed * gameSpeed

        if (obstacles[i].x <= -obstacles[i].width) {
            obstacles.splice(i, 1);
            i--;
        } else {
            drawObstacle(obstacles[i]);
        }
    }
}
function displayScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('スコア: ' + score, 10, 30);
}
function displayHighScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('ハイスコア: ' + highScore, 10, 60);
}
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}
function displayGameOver() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('ゲームオーバー', canvas.width / 2 - 70, canvas.height / 2);
    retryButton.style.display = 'block'; // リトライボタンを表示
}
function resetGame() {
    player.x = 50;
    player.y = 300;
    player.jumping = false;
    obstacles.length = 0; // 障害物配列をリセット
    retryButton.style.display = 'none'; // リトライボタンを非表示
    updateHighScore(); // ハイスコアを更新
    initializeSpeeds();
    score = 0; // スコアをリセット
    update(); // ゲーム更新を再開
}

retryButton.addEventListener('click', resetGame);

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (player.jumping) {
        player.y -= player.speed;
        if (player.y <= 200) {
            player.jumping = false;
        }
    } else {
        if (player.y < 300) {
            player.y += player.speed;
        }
    }

    if (isColliding(obstacles)) {
        displayGameOver();
        return; // ゲームオーバー時に更新を停止
    }
    else {
        score++;
        updateSpeeds();
    }
    displayScore();
    displayHighScore();

    drawPlayer();
    updateObstacles();
    updateAnimationFrame();
    requestAnimationFrame(update);
}
function spawnObstacle() {
    createObstacle();

    // 最小間隔と最大間隔を設定 (ミリ秒単位)
    const minInterval = 1000 / gameSpeed ** 2; // 1000ms = 1秒
    const maxInterval = 3000 / gameSpeed ** 2; // 3000ms = 3秒

    // minInterval から maxInterval までのランダムな間隔を計算
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;

    // 次の障害物生成までのタイマーを設定
    setTimeout(spawnObstacle, randomInterval);
}
function updateAnimationFrame() {
    playerAnimationFrame = Math.floor(score / 20 * gameSpeed) % playerImages.length;
}

// ゲーム開始時に最初の障害物生成タイマーを設定
setTimeout(spawnObstacle, 2000); // 最初の障害物は2秒後に生成
