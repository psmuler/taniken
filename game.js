const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle() {
    ctx.fillStyle = 'red';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

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

    obstacle.x -= obstacle.speed;
    if (obstacle.x <= -obstacle.width) {
        obstacle.x = canvas.width;
    }

    drawPlayer();
    drawObstacle();
    requestAnimationFrame(update);
}

canvas.addEventListener('click', () => {
    if (!player.jumping) {
        player.jumping = true;
    }
});
function isColliding() {
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        return true;
    }
    return false;
}

function displayGameOver() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('ゲームオーバー', canvas.width / 2 - 70, canvas.height / 2);
}

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

    obstacle.x -= obstacle.speed;
    if (obstacle.x <= -obstacle.width) {
        obstacle.x = canvas.width;
    }

    if (isColliding()) {
        displayGameOver();
        return; // ゲームオーバー時に更新を停止
    }

    drawPlayer();
    drawObstacle();
    requestAnimationFrame(update);
}

update();
