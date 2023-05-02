const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

let gameState = 'start'; // 'start', 'playing', 'gameover' のいずれかの状態を持たせる

function resizeCanvas() {
    const targetWidth = Math.min(window.innerWidth, MAX_WIDTH);
    const targetHeight = Math.min(window.innerHeight, MAX_HEIGHT);
    const aspectRatio = targetWidth / targetHeight;

    // ゲームのアスペクト比を維持しながら、ウィンドウに収まるように調整
    if (window.innerWidth / window.innerHeight < aspectRatio) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth / aspectRatio;
    } else {
        canvas.width = window.innerHeight * aspectRatio;
        canvas.height = window.innerHeight;
    }
    const scaleFactor = canvas.width / MAX_WIDTH; // スケールファクターを計算
    ctx.scale(scaleFactor, scaleFactor); // 描画スケールを変更
}


window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 初期サイズ設定

const obstacles = [];

let highScore = localStorage.getItem('highScore') || 0;
let score = 0;

let gameSpeed = 1;

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const retryButton = document.getElementById('retryButton');
startButton.addEventListener('click', () => {
    hideStartScreen();
    gameState = 'playing';
    // ゲーム開始時に最初の障害物生成タイマーを設定
    setTimeout(spawnObstacle, 3000); // 最初の障害物は2秒後に生成
});
retryButton.addEventListener('click', () => {
    hideGameOverScreen();
    console.log("spawn!")
    resetGame(); // ゲーム状態をリセットする関数
});

function showGameOverScreen() {
    gameState = 'gameover';
    gameOverScreen.style.display = 'flex';
    retryButton.style.display = 'block'; // リトライボタンを表示
}
function hideGameOverScreen() {
    gameOverScreen.style.display = 'none';
}
function showStartScreen() {
    startScreen.style.display = 'flex';
}
function hideStartScreen() {
    startScreen.style.display = 'none';
}

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

const initialPlayerSpeed = 3;
const initialObstacleSpeed = 5;

function updateSpeeds() {
    gameSpeed = Math.max(1 + Math.floor((score - 300) / 300) * 0.2, 1);
}

const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 60,
    speed: 5,
    speedY: 0,
    jumping: false,
};
const obstacle = {
    width: 30,
    height: 40,
    x: canvas.width + this.width,
    y: 340,
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
        player.speedY = player.speed;
    }
});
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (!player.jumping) {
        player.jumping = true;
        player.speedY = player.speed;
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
        speed: 5
    };
    obstacles.push(obstacle);
}
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;
        console.log(obstacles[i].speed)
        console.log(obstacles[i].x, obstacles[i].y)
        console.log(player.x, player.y)
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
function resetGame() {
    player.x = 50;
    player.y = 300;
    player.jumping = false;
    obstacles.length = 0; // 障害物配列をリセット
    retryButton.style.display = 'none'; // リトライボタンを非表示
    updateHighScore(); // ハイスコアを更新
    gameSpeed = 1
    score = 0; // スコアをリセット
    gameState = 'playing';
}

function update() {
    ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);

    if (gameState === 'playing') {
        if (player.jumping) {
            player.y -= player.speedY * gameSpeed
            if (player.y <= 200) {
                player.speedY = -player.speedY
            }
            if (player.speedY < 0 && player.y > 300) {
                player.speedY = 0
                player.jumping = false
            }
        }

        if (isColliding(obstacles)) {
            gameState = 'gameover';
            showGameOverScreen();
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
    }
    requestAnimationFrame(update);
}
function spawnObstacle() {
    if (gameState == "playing") {
        createObstacle();
    }


    // 最小間隔と最大間隔を設定 (ミリ秒単位)
    const minInterval = 1000 / gameSpeed ** 1.5; // 1000ms = 1秒
    const maxInterval = 4000 / gameSpeed ** 1.5; // 3000ms = 3秒

    // minInterval から maxInterval までのランダムな間隔を計算
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;

    // 次の障害物生成までのタイマーを設定
    setTimeout(spawnObstacle, randomInterval);
}
function updateAnimationFrame() {
    playerAnimationFrame = Math.floor(score / 20 * gameSpeed) % playerImages.length;
}

update();