const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score;
let highscore;
let scoreText;
let highscoreText;
let player;
let gravity;
let obstacles = [];
/* let rocks = []; */
let gameSpeed;
let keys = {};

const obsImg = new Image();
obsImg.src = "img/chatbubble.png";

const rockImg = new Image();
rockImg.src = "img/rock.png";


document.addEventListener('keydown', function(evt){
    keys[evt.code] = true;
});
document.addEventListener('keyup', function(evt){
    keys[evt.code] = false;
});


class Player{
    constructor (x, y, r, c){
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;

        this.dy = 0;
        this.jumpForce = 22;
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
        } else{
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.r;
        }

        this.Draw();
    }
    
    Jump () {
        if (this.r != this.originalRad) return

        if (this.grounded && this.jumpTimer == 0){
            this.jumpTimer = 1.5;
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

    /* constructor (x, y, w, h, c){
        this.x = x;
        this.y = y,
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed;
    } */

    Update (){
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(this.x, this.y, this.w, this.h,);
        let image = this.obsImg;
        ctx.drawImage(this.obsImg, this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
    
    /* Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    } */

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

    Update (){
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(this.x, this.y, this.w, this.h,);
        let image = this.rockImg;
        ctx.drawImage(this.rockImg, this.x, this.y, this.w, this.h);
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

function SpawnObstacle (){
    let sizeX = RandomIntInRange(80, 160);
    let sizeY = sizeX / 2;
    let type = RandomIntInRange(0, 2);
    let rock;
    let obstacle = new Obstacle(
        x = canvas.width + sizeX, 
        y = canvas.height - sizeX, 
        w = sizeX,
        h = sizeY,
        obsImg
        );
        
        if (type == 0){
            obstacle = new Rock(
                x = canvas.width + sizeX, 
                y = canvas.height - sizeY, 
                w = sizeX,
                h = sizeY,
                rockImg 
            );  
    } else if (type == 1){
        obstacle.y -= player.originalRad - 10;
    } else if (type == 2){
        obstacle.y -= canvas.height - sizeX * 5;
    }

    obstacles.push(obstacle);
    /* rocks.push(rock); */
}

/* function SpawnRock (){
    let sizeX = RandomIntInRange(80, 160);
    let sizeY = sizeX / 2;
    let rock = new Rock(
        x = canvas.width + sizeX, 
        y = canvas.innerHeight - sizeY, 
        w = sizeX,
        h = sizeY,
        rockImg
        );

    rocks.push(rock);
} */

function RandomIntInRange (min, max){
    return Math.round(Math.random() * (max - min) + min);
}

function Start () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.font = "40px sans-serif";

    gameSpeed = 4;
    gravity = 1;

    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')){
        highscore = localStorage.getItem('highscore');
    }

    player = new Player(100, 0, 50, '#3FFF00');

    scoreText = new Text("Score: " + score, 45, 45, "left", "#212121", "40");
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 45,
    45, "right", "#FFDB51", "40")

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
            spawnTimer = RandomIntInRange(40, 80);
            /* spawnTimer = 60; */
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