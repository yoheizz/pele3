const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

let isGameOver = false;
let startTime = null;

const player = {
  x: canvas.width / 2,
  y: 20,
  width: 40,
  height: 40,
  vx: 0,
  vy: 0,
  vg: 0.5,
  jumpStrength: -15,
  isJumping: false,
  speed: 8,
};

const boxes = [];

function createBox() {
  const box = {
    width: Math.random() * canvas.width / 4.2,
    height: Math.random() * 50 + 20,
    x: canvas.width,
    y: canvas.height - 100 - Math.random() * 100,
    speed:Math.random() * 10,
    boxflag: false,
  };
  boxes.push(box);
}




function loop(timestamp) {
  if (!startTime) {
    startTime = timestamp;
  }

  const Time = (timestamp - startTime) / 1000;

  if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.vy += player.vg;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y + player.height > canvas.height) {
      isGameOver = true; 
    }

    for (const box of boxes) {
      ctx.fillStyle = 'brown';
      ctx.fillRect(box.x, box.y, box.width, box.height);

      if (
        player.x + player.width > box.x &&
        player.x < box.x + box.width &&
        player.y + player.height > box.y &&
        player.y < box.y + box.height &&
        player.vy >= 0
      ) {
        player.y = box.y - player.height;
        player.vy = 0;
        player.isJumping = false;
      }

      box.x -= box.speed;

      if (Math.random() < 0.1) {
        box.y += Math.sin(box.speed)*25;
      }
     

      if (box.x + box.width < 0||box.y + box.height < 0) {
        const index = boxes.indexOf(box);
        boxes.splice(index, 1);
      }
    }

    if (Math.random() < 0.07) {
      createBox();
    }

    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'red';
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(player.x + 10, player.y + 5, player.width / 5, player.height / 5);
    ctx.fillRect(player.x + player.width - 15, player.y + 5, player.width / 5, player.height / 5);
    ctx.fillRect(player.x + 10, player.y + player.height - 15, player.width - 20, player.height / 5);

    if (isGameOver) {
      ctx.fillStyle = 'black';
      ctx.font = '48px Arial';
      ctx.fillText(`頑張った時間: ${Time.toFixed(2)} 秒`, 180 , canvas.height / 2);
      ctx.fillStyle = 'green';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = 'pink';
      ctx.fillRect(player.x + 10, player.y + 5, player.width / 5, player.height / 5);
      ctx.fillRect(player.x + player.width - 15, player.y + 5, player.width / 5, player.height / 5);
      ctx.fillRect(player.x + 10, player.y + player.height - 15, player.width - 20, player.height / 5);
       }
  }

  requestAnimationFrame(loop);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    player.vx = -player.speed;
  } else if (event.key === 'ArrowRight') {
    player.vx = player.speed;
  } else if (event.key === 'ArrowUp' && !player.isJumping) {
    player.vy = player.jumpStrength;
    player.isJumping = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    player.vx = 0;
  }
});

loop();
