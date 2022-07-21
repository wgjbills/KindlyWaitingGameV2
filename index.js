import {registerNewHighscore, makeList} from "./globalHs.js";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const newGameBtn = document.getElementById("newGame");
const seeInstrBtn = document.getElementById("instrBtn");
const seeHsBtn = document.getElementById("hsBtn");
const goBackBtn = document.getElementById("backBtn");

let score;
let highscore;
let scoreText;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keyPressed;
let isKeyPressed = false
let active = true;
let rotation = 0;
const world_width = 900;
const world_height = 640;
const worldElem = document.querySelector('[data-world');

const obsImg = createImage("img/chatbubble.png");
const rockImg = createImage("img/rock.png");
const roadblockImg = createImage("img/roadblock.png");
const playerImg = createImage("img/logoPlayer.png");

function createImage(path){
    let image = new Image();
    image.src = path;
    return image;
}

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale);

function setPixelToWorldScale() {
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < world_width / world_height){
        worldToPixelScale = window.innerWidth / world_width;
    } else {
        worldToPixelScale = window.innerHeight / world_height;
    }

    worldElem.style.width = (world_width * worldToPixelScale)+"px"
    worldElem.style.height = (world_height * worldToPixelScale)+"px"
}


ctx.canvas.width = document.querySelector(".world").offsetWidth;
ctx.canvas.height = document.querySelector(".world").offsetHeight;



newGameBtn.addEventListener('click', function() {
    document.getElementById("newGame").style.display = "none";
    document.getElementById("header").style.display = "none";
    document.getElementById("instr").style.display = "none";       
    /* document.getElementById("main").style.display = "block"; */
    document.getElementById("instrBtn").style.display = "none";
    document.getElementById("hsBtn").style.display = "none";
    document.getElementById("hsBoard").style.display = "none";
    start();
});

seeInstrBtn.addEventListener('click', function(){
    document.getElementById("header").style.display = "none";
    document.getElementById("instrBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("instr").style.display = "block";
    document.getElementById("instr").style.visibility = "visible";
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("hsBtn").style.display = "none";
    document.getElementById("hsBoard").style.display = "none";
    document.getElementById("backBtn").style.top = "45.6%";
});

seeHsBtn.addEventListener('click', function(){
    document.getElementById("header").style.display = "none";
    document.getElementById("hsBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("instrBtn").style.display = "none";
    document.getElementById("instr").style.display = "none";
    document.getElementById("hsBoard").style.display = "block";
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("backBtn").style.top = "82%";
    makeList();
});

goBackBtn.addEventListener('click', function() {
    goBack();
});

function goBack() {
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("instr").style.display = "none";
    document.getElementById("header").style.display = "block";
    document.getElementById("newGame").style.display = "block";
    document.getElementById("instrBtn").style.display = "block";
    document.getElementById("hsBtn").style.display = "block";
    document.getElementById("hsBoard").style.display = "none";
};

document.addEventListener('keydown', function(evt) {
  if (isKeyPressed) return;
  
  isKeyPressed = true;
  keyPressed = evt.code;

});
document.addEventListener('keyup', function(evt) {
    if (evt.code !== keyPressed) return; // only respond to the key already pressed
    
    isKeyPressed = false;
    keyPressed = null;
});

function randomIntInRange (min, max){
    return Math.round(Math.random() * (max - min) + min);
}

class Player{
    constructor (x, y, r, w, h, playerImg){
        this.playerImg = playerImg;
        this.x = x;
        this.y = y;
        this.r = r;
        this.w = r*2;
        this.h = r*2;

        this.dy = 0;
        this.jumpForce = 18;
        this.originalRad = r;
        this.grounded = false;
        this.jumpTimer = 0;
        /* this.newRotation = 0; */
    }

    animate () {
        if (['Space', 'KeyW'].includes(keyPressed)) {
             this.jump();
        } else{
            this.jumpTimer = 0;
        }

        if (['ShiftLeft', 'KeyS'].includes(keyPressed)){
            /* this.newRotation = rotation * 2; */
            this.r = this.originalRad / 2;
            this.w = this.originalRad;
            this.h = this.originalRad;
        } else {
            /* this.newRotation = rotation; */
            this.r = this.originalRad;
            this.w = this.r * 2;
            this.h = this.r * 2;
        }

        this.y += this.dy;

        if (this.y + this.r < canvas.height){
            this.dy += gravity;
            this.grounded = false;
        } else{
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.r;
        }
    
        this.draw();
    }
    
    jump () {
        if (this.r != this.originalRad) return;

        if (this.grounded && this.jumpTimer == 0){
            this.jumpTimer = 1.5;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15){
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        } 
    }

    draw () {
        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);
        
        ctx.translate(-(this.x), -(this.y));
        ctx.drawImage(this.playerImg, (this.x-this.r), (this.y-this.r), this.w, this.h);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        /* ctx.save();
        ctx.rotate(gameSpeed);
        ctx.drawImage(this.playerImg, this.x-this.r, this.y-this.r, this.w, this.h);
        ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
        ctx.restore(); */

        /* ctx.beginPath();
        ctx.rotate(gameSpeed);
        ctx.drawImage(this.playerImg, this.x-this.r, this.y-this.r, this.w, this.h);
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.arc(this.x, this.y, this.r, 0, (2 * Math.PI), false);
        ctx.fill();
        ctx.rotate(-gameSpeed);
        ctx.closePath(); */
    }
}

class Obstacle {
    constructor (x, y, w, h, obsImg){
        this.obsImg = obsImg;
        this.x = x,
        this.y = y,
        this.w = w;
        this.h = h;

        this.dx = -gameSpeed;
        obsImg.width = this.w;
        obsImg.height = this.h;
    }

    update (){
        this.x += this.dx;
        this.dx = -gameSpeed;
    }

    draw () {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(this.x, this.y, this.w, this.h,);
        ctx.drawImage(this.obsImg, this.x, this.y, this.w*1.1, this.h);
        ctx.closePath();
    }

    /////// CIRCLE
    /*draw () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, (2 * Math.PI), false)
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.closePath();
    }*/

    /////// ELLIPSE
    /*draw () {
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radX, this.radY, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.stroke();
    }*/
}

class Rock {
    constructor (x, y, w, h, rockImg){
        this.rockImg = rockImg;
        this.x = x,
        this.y = y,
        this.w = w;
        this.h = h;

        this.dx = -gameSpeed;
        rockImg.width = this.w;
        rockImg.height = this.h;
    }

    update (){
        this.x += this.dx;
        this.dx = -gameSpeed;
    }

    draw () {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(this.x+20, this.y+40, this.w-20, this.h-40);
        ctx.drawImage(this.rockImg, this.x-20, this.y, this.w*1.5, this.h*1.5);
        ctx.closePath();
    }
}

class Roadblock {
    constructor (x, y, w, h, roadblockImg){
        this.roadblockImg = roadblockImg;
        this.x = x,
        this.y = y,
        this.w = w;
        this.h = h;

        this.dx = -gameSpeed;
        roadblockImg.width = this.w;
        roadblockImg.height = this.h;
    }

    update (){
        this.x += this.dx;
        this.dx = -gameSpeed;
    }

    draw () {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(this.x, this.y+15, this.w, this.h,);
        ctx.drawImage(this.roadblockImg, this.x, this.y, this.w, this.h*1.15);
        ctx.closePath();
    }
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

    draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px";
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

/* function rockDis(player, rock) {
    var distX = Math.abs(player.x - (rock.x + rock.w / 2));
    var distY = Math.abs(player.y - (rock.y + rock.h / 2));

    if (distX > (rock.w / 2 + player.r)) { return false; }
    if (distY > (rock.h / 2 + player.r)) { return false; }

    if (distX <= (rock.w)) { return true; }
    if (distY <= (rock.h)) { return true; }

    var dx = distX - rock.w / 2;
    var dy = distY - rock.h / 2;
    return (dx * dx + dy * dy <= (player.r*player.r));
} */

/*function getDistance(x1, y1, x2, y2){
    let xDis = x2 - x1;
    let yDis = y2 - y1;
    
    //return 
    return Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
}*/

let initialSpawnTimer = 200; 
let spawnTimer = initialSpawnTimer;

function spawnObstacle (){
    let sizeX;
    let sizeY;
    let type = randomIntInRange(0, 2);
    let obstacle = new Obstacle(
        canvas.width + sizeX, 
        canvas.height - sizeX, 
        sizeX,
        sizeY,
        obsImg
        );
        
        if (type == 0){
            sizeX = randomIntInRange(100, 160);
            sizeY = sizeX / 2;
            obstacle = new Rock(
                canvas.width + sizeX, 
                canvas.height - sizeY, 
                sizeX,
                sizeY,
                rockImg  
                );  
            } else if (type == 1){
            sizeX = randomIntInRange(80, 160);
            sizeY = sizeX / 2;
            obstacle = new Obstacle(
                canvas.width + sizeX, 
                canvas.height - sizeX, 
                sizeX,
                sizeY,
                obsImg
                );
            obstacle.y -= player.originalRad  + randomIntInRange(-50, 150);
        } else if (type == 2){
            sizeX = 150;
            sizeY = sizeX / 2;
            obstacle = new Roadblock(
                canvas.width + sizeX, 
                canvas.height - sizeY, 
                sizeX,
                sizeY,
                roadblockImg  
            );
        }

    obstacles.push(obstacle);
}


function start () {
    /* ctx.canvas.width = document.querySelector(".world").offsetWidth;
    ctx.canvas.height = document.querySelector(".world").offsetHeight; */
    /* ctx.canvas.width = document.querySelector(".world").width;
    ctx.canvas.height = document.querySelector(".world").height; */
    
    ctx.font = "40px Courier New";

    active = true;

    gameSpeed = 6;
    gravity = 1;

    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')){
        highscore = localStorage.getItem('highscore');
    }

    player = new Player(100, 0, 50, 100, 100, playerImg);

    scoreText = new Text("Score: " + score, 45, 45, "left", "#212121", "40");
    highscoreText = new Text("Highscore: " + highscore, 45,
    90, "left", "gold", "40");
    
    window.requestAnimationFrame(update);
}


let lastTime;

function update (time) {
    if (lastTime != null) {
        const delta = time - lastTime;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer--;
    if (spawnTimer <= 0){
        spawnObstacle();
        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60){
            spawnTimer = randomIntInRange(40, 80);
        }
    }

    for (let i = obstacles.length-1; i >= 0; i--){
        let o = obstacles[i];
        o.update();
        o.draw();

        if (o.x + o.y < 0){
            obstacles.splice(i, 1);
        }

        
        if (getDistance(player, o)) {
            active = false;
            obstacles = [];
            spawnTimer = initialSpawnTimer;
            gameSpeed = 6;    
            window.localStorage.setItem('highscore', highscore);
            score -= 1;
            highscore -= 1;
            if (score >= highscore){
                registerNewHighscore(highscore+1);
            }
            goBack();
        }
    }

    lastTime = time;
    if (active){
        window.requestAnimationFrame(update);
    }
    
    player.animate();
    
    score++;
    scoreText.t = "Score: " + score;
    scoreText.draw();


    if (score > highscore){
        highscore = score;
        highscoreText.t = "Highscore: " + highscore;
        
    }

    highscoreText.draw();
    
    
    rotation+=Math.PI/180 * 2 + gameSpeed * 0.01;
    gameSpeed += 0.002;
    
}