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

// 関数関係
const rand=(min,max)=>{
  return Math.floor(Math.random()*(max-min+1)+min);
};
const checkCollision=(objA, objB)=> {
    return (
        objA.x + objA.width > objB.x &&
        objA.x < objB.x + objB.width &&
        objA.y + objA.height > objB.y &&
        objA.y < objB.y + objB.height &&
        objA.vy >= 0
    );
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
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'red';
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
        // コントローラー関係
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
        if (checkCollision(player, box)) {
            // プレイヤーがボックスに接触した場合
        
        }
        box.draw();
        box.update();
    };
    
    requestAnimationFrame(loop);
};

//関数呼び出し
window.onload = () => {
    requestAnimationFrame(loop);
};
