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
let animationRequestId = null;

// 関数関係
const rand=(min,max)=>{
  return Math.floor(Math.random()*(max-min+1)+min);
};

const checkCollision=(A, B)=> {
    if(         //A=player
        A.x + A.width > B.x &&
        A.x < B.x + B.width &&
        A.y + A.height > B.y &&
        A.y < B.y + B.height &&
        A.vy >= 0
    ){  
        A.y = B.y - A.height;
        A.vy = 0;
        A.isJumping = false;
    }
};
const checkGameover=(e)=>{
    if(e.y>=CANVAS_H){
        isGameOver = true;
        cancelAnimationFrame(animationRequestId); // アニメーションを停止
    }
}
const gameover = () => {
    ctx.fillStyle = 'tomato';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    
    // gameover() 関数が呼ばれた時間を取得
    const currentTime = performance.now();
    // 経過時間を計算し、秒単位に変換
    
    const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
    // elapsedTimeInSeconds = eval(elapsedTimeInSeconds);
    ctx.fillText(`頑張った時間: ${elapsedTimeInSeconds} 秒`, CANVAS_W / 4, CANVAS_H / 2);
};

// 各クラス
class Player{
    constructor(){
        this.x = CANVAS_W/ 2;
        this.y = 0;
        this.width = 40;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;
        this.vg = 0.5;
        this.jumpStrength = -15;
        this.isJumping = false;
        this.speed = 8;
        }
    draw(){
        ctx.strokeStyle = 'pink';
        ctx.fillStyle = 'pink';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x + 10, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + this.width - 15, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + 10, this.y + this.height - 15, this.width - 20, this.height / 5);
    }
    update(){
        // 落下処理
        this.vy += this.vg;
        this.x += this.vx;
        this.y += this.vy;
        //キー操作
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
            this.vx = -this.speed;
            } else if (event.key === 'ArrowRight') {
            this.vx = this.speed;
            } else if (event.key === 'ArrowUp' && !this.isJumping) {
            this.vy = this.jumpStrength;
            this.isJumping = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            this.vx = 0;
            }
        });
        //タッチ操作
        const jumpButton = document.getElementById('Jump');
        const leftButton = document.getElementById('Left');
        const rightButton = document.getElementById('Right');

        jumpButton.addEventListener('touchstart', () => {
        if (!player.isJumping) {
            player.vy = player.jumpStrength;
            player.isJumping = true;
        }
        });
        
        leftButton.addEventListener('touchstart', () => {
        player.vx = -player.speed;
        });
        
        rightButton.addEventListener('touchstart', () => {
        player.vx = player.speed;
        });
        
        document.addEventListener('touchend', () => {
        player.vx = 0;
        });

}
}

class Box{
    constructor(){
    this.x = CANVAS_W;
    this.y = rand(CANVAS_H/2,CANVAS_H);
    this.width = rand(1,300);
    this.height = rand(1,100);
    this.speed = rand(1,30);
    this.up = rand(0,3);
    };
    draw(){
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    update() {
        // ボックスが画面外に出たら削除
        if (this.x + this.width < 0||this.y + this.height < 0) {
            const index = boxes.indexOf(this);
        if (index !== -1) {
            boxes.splice(index, 1);
        }
        } else {
            this.x -= this.speed;
            this.y += Math.sin(this.speed)*this.up;
        }
    }
}

//new
const player = new Player();
const boxes = [];
//boxランダム生成
const createBox = () => {
        if(rand(0,10)===0){
            boxes.push(new Box());
        }
    };

//メイン処理
const loop = () => {
    //リセット処理
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //player
    player.draw();
    player.update();
    //box
    createBox();
    for (const box of boxes) {
        checkCollision(player, box);
        box.draw();
        box.update();
    };
    //gameover
    checkGameover(player);
    if(isGameOver){
        gameover();
    }
    requestAnimationFrame(loop);
};

//関数呼び出し
window.onload = () => {
    startTime = performance.now(); // ゲームが開始された時間を記録
    requestAnimationFrame(loop);
};
