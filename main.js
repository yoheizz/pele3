// キャンバス関係
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_W = 800;
const CANVAS_H = 800;
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

// 定数変数関係
let isGameOver = false;
let startTime = null;
let currentTime = null;

// 関数関係
const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// 当たり判定
const checkCollision = (A, B) => {
  if (
    A.x + A.width > B.x &&
    A.x < B.x + B.width &&
    A.y + A.height > B.y &&
    A.y < B.y + B.height &&
    A.vy >= 0
  ) {
    A.y = B.y - A.height;
    A.vy = 0;
    A.isJumping = false;

    // ボックスに応じて能力変更
    if (B.ability >= 1 && B.ability < 2) {
      // 黒
      A.jumpStrength = -5;
      A.height = 20;
      A.width = 100;
      B.up = -10;
      B.speed = 1;
      A.vg = 0.5;
    } else if (B.ability >= 2 && B.ability < 3) {
      // 金
      A.jumpStrength = -35;
      A.height = 200;
      A.width = 200;
      A.vg = 1;
    } else if (B.ability >= 3 && B.ability < 4) {
      // 緑
      A.jumpStrength = -10;
      A.height = 20;
      A.width = 20;
      A.vg = 0.2;
    } else {
      A.jumpStrength = -20;
      A.height = 40;
      A.width = 40;
      A.vg = 0.5;
    }
  }
};

const checkGameover = (e) => {
  if (e.y >= CANVAS_H) {
    isGameOver = true;
  }
};

const gameover = () => {
  ctx.fillStyle = 'tomato';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = 'black';
  ctx.font = '48px Arial';

  currentTime = performance.now();
  const elapsedTimeInSeconds = ((currentTime - startTime) / 1000).toFixed(2);
  const seconds = (elapsedTimeInSeconds % 60).toFixed(2)-1;

  ctx.fillText(`頑張った時間: ${seconds}秒`, CANVAS_W / 5, CANVAS_H - 100);
  
  document.getElementById("restart").style.display = "initial";

  // ローカルストレージ
  const getHighScores = () => {
    const scoresJSON = localStorage.getItem("highScores");
    return scoresJSON ? JSON.parse(scoresJSON) : [];
  };

  const addScore = (score) => {
    const highScores = getHighScores();
    highScores.push(score);

    highScores.sort((a, b) => b - a);

    const top5Scores = highScores.slice(0, 5);

    localStorage.setItem("highScores", JSON.stringify(top5Scores));
  };

  addScore(elapsedTimeInSeconds);

  const top5Scores = getHighScores();
  top5Scores.forEach((score, index) => {
    ctx.fillText(`ランク${index + 1}: スコア ${score}秒`, CANVAS_W / 5, 100 * (index + 1));
  });
};

// 画面の向きチェック
const checkDisplay = () => {
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isLandscape) {
    document.getElementById('adjust').style.display = 'none';
    document.getElementById('warning').style.display = 'block';
  } else {
    document.getElementById('adjust').style.display = 'initial';
    document.getElementById('warning').style.display = 'none';
  }
};

// 画面ロック時の処理
const checkLock = () => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      startTime = performance.now();
    } else if (document.visibilityState === 'visible') {
      startTime = performance.now();
      isGameOver = true;
      gameover();
    }
  });
};

// 各クラス
class Player {
  constructor() {
    this.x = CANVAS_W / 2;
    this.y = 0;
    this.width = 40;
    this.height = 40;
    this.vx = 0;
    this.vy = 0;
    this.vg = 0.5;
    this.jumpStrength = -20;
    this.isJumping = false;
    this.speed = 15;
    this.startTime = performance.now(); // ゲーム開始時の時間を記録
  }

  draw() {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'red';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x + 10, this.y + 5, this.width / 5, this.height / 5);
    ctx.fillRect(this.x + this.width - 15, this.y + 5, this.width / 5, this.height / 5);
    ctx.fillRect(this.x + 10, this.y + this.height - 15, this.width - 20, this.height / 5);

    // 能力値（ジャンプ力、速度など）表示
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`ジャンプ力: ${this.jumpStrength}`, 10, 30);
    ctx.fillText(`重力: ${this.vg}`, 10, 60);
  }

  update() {
    const currentTime = performance.now();
    const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;

    // 最初の1秒間は落下しない
    if (elapsedTimeInSeconds < 1) {
      this.vy = 0; // 落下速度を0にする
    } else {
      // 落下処理
      this.vy += this.vg;
    }

    this.x += this.vx;
    this.y += this.vy;

    // キー操作
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.vx = -this.speed;  // 左に移動
      } else if (event.key === 'ArrowRight') {
        this.vx = this.speed;   // 右に移動
      } else if (event.key === 'ArrowUp' && !this.isJumping) {
        this.vy = this.jumpStrength;
        this.isJumping = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.vx = 0;  // キーを離した時に停止
      }
    });

    // タッチ操作
    const buttonHandlers = {
      'Jump': () => {
        if (!this.isJumping) {
          this.vy = this.jumpStrength;
          this.isJumping = true;
        }
      },
      'Left': () => this.vx = -this.speed,  // 左に移動
      'Right': () => this.vx = this.speed   // 右に移動
    };

    Object.keys(buttonHandlers).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      button.addEventListener('touchstart', buttonHandlers[buttonId]);
    });

    document.addEventListener('touchend', () => this.vx = 0);
  }
}

class Box {
  constructor() {
    this.x = CANVAS_W;
    this.y = rand(CANVAS_H / 2, CANVAS_H);
    this.width = rand(1, 300);
    this.height = rand(1, 100);
    this.speed = rand(5, 30);
    this.up = rand(0, 3);
    this.ability = rand(1, 10);
  }

  draw() {
    // アビリティで色等変更
    if (this.ability >= 1 && this.ability < 2) {
      ctx.fillStyle = "black";
    } else if (this.ability >= 2 && this.ability < 3) {
      ctx.fillStyle = "gold";
    } else if (this.ability >= 3 && this.ability < 4) {
      ctx.fillStyle = "springgreen";
    } else {
      ctx.fillStyle = "brown";
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    // ボックスが画面外に出たら削除
    if (this.x + this.width < 0 || this.y + this.height < 0) {
      const index = boxes.indexOf(this);
      if (index !== -1) {
        boxes.splice(index, 1);
      }
    } else {
      this.x -= this.speed;
      this.y += Math.sin(this.speed) * this.up;
    }
  }
}

// 新規インスタンス
const player = new Player();
const boxes = [];

// ボックスランダム生成
const createBox = () => {
  if (rand(0, 15) === 0) {
    boxes.push(new Box());
  }
};

// マグマが波打つ描画
const drawMaguma = () => {
  ctx.fillStyle = "red";
  const waveHeight = 10;
  for (let i = 0; i < CANVAS_W; i++) {
    const waveOffset = Math.sin((i + performance.now() / 50) * 0.5) * waveHeight;
    ctx.fillRect(i, CANVAS_H - 30 + waveOffset, 1, 50); // 波の動き
  }
};

// メイン処理
const loop = () => {
  if (isGameOver) {
    gameover();
    return; // ここでループを終了させる
  }

  // リセット処理
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー描画と更新
  player.draw();
  player.update();

  // ボックス描画と更新
  createBox();
  boxes.forEach(box => {
    checkCollision(player, box);
    box.draw();
    box.update();
  });

  // マグマ描画
  drawMaguma();

  // 時間の表示
  currentTime = performance.now();
  const elapsedTimeInSeconds = ((currentTime - startTime) / 1000).toFixed(2);
  const minutes = Math.floor(elapsedTimeInSeconds / 60);
  const seconds = (elapsedTimeInSeconds % 60).toFixed(2);
  
  // ゲーム画面上に経過時間を表示
  ctx.fillStyle = 'black';  // 文字色を白に変更
  ctx.font = '30px Arial';  // 文字サイズを大きく
  ctx.fillText(`経過時間: ${minutes}:${seconds}`, CANVAS_W / 3, 30);  // 上部中央に表示

  // ゲームオーバー判定
  checkLock();
  checkGameover(player);

  // 次のフレーム
  requestAnimationFrame(loop);
};

// 関数呼び出し
window.onload = () => {
  checkDisplay();
  startTime = performance.now(); // ゲームが開始された時間を記録
  requestAnimationFrame(loop);
};
