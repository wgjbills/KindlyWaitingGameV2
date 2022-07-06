const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score;
let highscore;
let scoreText;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

document.addEventListener('keydown', function(evt){
    keys[evt.code] = true;
});
document.addEventListener('keyup', function(evt){
    keys[evt.code] = false;
})

class Player{
    constructor (x, y, r, c){
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;

        this.dy = 0;
        this.jumpForce = 15;
        this.originalRad = r;
        this.grounded = false;
        this.jumpTimer = 0;
    }

    Animate () {
        if (keys['Space'] || keys['KeyW']) {
            this.Jump();
        } else{
            this.jumpTimer = 0;
        }

        if (keys['ShiftLeft'] || keys['KeyS']){
            this.r = this.originalRad / 2;
        } else{
            this.r = this.originalRad;
        }

        this.y += this.dy;

        if (this.y + this.r < canvas.height){
            this.dy += gravity;
            this.grounded = false;
        }else{
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.r;
        }

        this.Draw();
    }
    
    Jump () {
        if (this.grounded && this.jumpTimer == 0){
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15){
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }

    Draw () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, (2 * Math.PI), false)
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.closePath();
    }
}

class Obstacle {
    constructor (x, y, w, h, c){
        this.x = x;
        this.y = y,
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed;
    }

    Update (){
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    /*Draw () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, (2 * Math.PI), false)
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.closePath();
    }*/

    /*Draw () {
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radX, this.radY, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.stroke();
    }*/
}

class Text{
    constructor(t, x, y, a, c, s){
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.t, this.x, this.y);
        ctx.closePath();
    }
}

function getDistance(player, obstacle) {
    var distX = Math.abs(player.x - (obstacle.x + obstacle.w / 2));
    var distY = Math.abs(player.y - (obstacle.y + obstacle.h / 2));

    if (distX > (obstacle.w / 2 + player.r)) { return false; }
    if (distY > (obstacle.h / 2 + player.r)) { return false; }

    if (distX <= (obstacle.w)) { return true; }
    if (distY <= (obstacle.h)) { return true; }

    var dx = distX - obstacle.w / 2;
    var dy = distY - obstacle.h / 2;
    return (dx * dx + dy * dy <= (player.r*player.r));
}

/*function getDistance(x1, y1, x2, y2){
    let xDis = x2 - x1;
    let yDis = y2 - y1;

    //return 
    return Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
}*/

function SpawnObstacle (){
    let sizeX = RandomIntInRange(40, 140);
    let sizeY = sizeX / 2;
    let type = RandomIntInRange(0, 1);
    let obstacle = new Obstacle(canvas.width + sizeX, canvas.height - sizeX,
        sizeX, sizeY, '#2484E4');

    if (type == 1){
        obstacle.y -= player.originalRad - 10;
    }
    obstacles.push(obstacle);
}

function RandomIntInRange (min, max){
    return Math.round(Math.random() * (max - min) + min);
}

function Start () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.font = "20px sans-serif";

    gameSpeed = 4;
    gravity = 1;

    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')){
        highscore = localStorage.getItem('highscore');
    }

    player = new Player(100, 0, 50, '#3FFF00');

    scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 25,
    25, "right", "#212121", "20")

    requestAnimationFrame(Update);
}

let initialSpawnTimer = 200; 
let spawnTimer = initialSpawnTimer;
function Update () {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer--;
    if (spawnTimer <= 0){
        SpawnObstacle();
        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60){
            spawnTimer = 60;
        }
    }

    for (let i = 0; i < obstacles.length; i++){
        let o = obstacles[i];

        if (o.x + o.y < 0){
            obstacles.splice(i, 1);
        }
        /*if (distX <= (obstacle.w/2)) { return true; } 
        if (distY <= (obstacle.h/2)) { return true; }*/

        
        if (getDistance(player, o)/* < o.w/2 ||
        getDistance(player.x, player.y, o.x, o.y) < o.h/2*/) {
            obstacles = [];
            score = 0;
            spawnTimer = initialSpawnTimer;
            gameSpeed = 4;    
            window.localStorage.setItem('highscore', highscore);
        }

        /*if (player.x - player.r < o.x + o.w &&
            player.x + player.r > o.x &&
            player.y - player.r < o.y + o.h &&
            player.y + player.r > o.y
            ){
            obstacles = [];
            score = 0;
            spawnTimer = initialSpawnTimer;
            gameSpeed = 4;    
            window.localStorage.setItem('highscore', highscore);
            }*/

        o.Update()
    }

    player.Animate();

    score++;
    scoreText.t = "Score: " + score;
    scoreText.Draw();


    if (score > highscore){
        highscore = score;
        highscoreText.t = "Highscore: " + highscore;
        
    }

    highscoreText.Draw();

    gameSpeed += 0.002;
}

Start();







/*
const kindly = document.getElementById("kindly");
const obstacle = document.getElementById("obstacle");
console.log(kindly.classList)

function jump(){
    if (kindly.classList != "jump"){
       
        kindly.classList.add("jump");

        setTimeout(function (){
            kindly.classList.remove("jump");
        }, 300);
    }
}

let isAlive = setInterval(function (){
    let kindlyTop = parseInt(
        window.getComputedStyle(kindly).getPropertyValue("top")
    );
    let obstacleLeft = parseInt(
        window.getComputedStyle(obstacle).getPropertyValue("left")
    );

    if (obstacleLeft < 50 && obstacleLeft >= 0 && kindlyTop >= 140){
        alert("Game Over!")
    }
}, 10);

document.addEventListener("keydown", function (event){
    jump();
});**/