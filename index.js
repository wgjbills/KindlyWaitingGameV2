import {registerNewHighscore, makeList} from "./globalHs.js";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const newGameBtn = document.getElementById("newGame");
const seeInstrBtn = document.getElementById("instrBtn");
const seeHsBtn = document.getElementById("hsBtn");
const goBackBtn = document.getElementById("backBtn");
const musicCont = document.getElementById("music");
const musicElem = document.getElementById("musicBox");
const audioCont = document.getElementById("audio");
const audioElem = document.getElementById("audioBox");
const leftTouch = document.getElementById("leftArea");
const rightTouch = document.getElementById("rightArea");
const rolloverElem = document.getElementById("rolloverBox");
const btns = document.querySelectorAll(".btn");
const leftInstr = document.querySelector(".instrLeft");
const rightInstr = document.querySelector(".instrRight");


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
let active = false;
let rotation = 0;
let musicEnabled = true;
let audioEnabled = true;
let touchedLeft = false;
let touchedRight = false;

const world_width = 900;
const world_height = 640;
const worldElem = document.querySelector('[data-world]');
let ratio = 1;
let defaultPlaybackRate;

const obsImg = createImage("img/chatbubble.png");
const rockImg = createImage("img/rock.png");
const roadblockImg = createImage("img/roadblock.png");
const playerImg = createImage("img/logoPlayer.png");

function createImage(path){
    let image = new Image();
    image.src = path;
    return image;
}

setPixelToWorldScale();
// window.addEventListener('resize', () => {
//     ratio = setPixelToWorldScale();
    
// /*     player.setR(ratio*player.getR());
//  */    /* player.x *= ratio;
//     player.y *= ratio; */
//     /* player.y *= ratio; */
//     /* Player.draw(ratio),
//     Obstacle.draw(ratio),
//     Rock.draw(ratio),
//     Roadblock.draw(ratio) */
// } );

/* window.onresize = function() { 
    const ratio = setPixelToWorldScale(); 
    Player.animate(ratio);
    Obstacle.animate(ratio);
    Rock.animate(ratio);
    Roadblock.animate(ratio);
} */

/* SCALING */
function setPixelToWorldScale() {
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < world_width / world_height){
        worldToPixelScale = window.innerWidth / world_width;
    } else {
        worldToPixelScale = window.innerHeight / world_height;
    }
    
    worldElem.style.width = (world_width * worldToPixelScale)+"px";
    worldElem.style.height = (world_height * worldToPixelScale)+"px";

    ctx.canvas.width = document.querySelector(".world").offsetWidth;
    ctx.canvas.height = document.querySelector(".world").offsetHeight;
    
    return worldToPixelScale;
  }
  
  canvas.width = world_width * ratio;
  canvas.height = world_height * ratio;
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

/* AUDIO & MUSIC */
btns.forEach(btn => {
  btn.addEventListener('mouseover', () => 
  playRolloverAudio())
});

function playRolloverAudio () {
  if (audioEnabled){
    rolloverElem.play();
  }
}
  
musicCont.addEventListener('click', function(){
      toggleMusic();
  });
  
function toggleMusic() {
    if (!musicEnabled) {
    musicEnabled = true;
    musicCont.style.backgroundImage = "url('img/musicOn.png')";
    musicElem.muted = false;
    musicElem.volume = 0.7;
    musicElem.play();
  } else {
    musicEnabled = false;
    musicCont.style.backgroundImage = "url('img/musicOff.png')";
    musicElem.muted = true;
  }
}
  
audioCont.addEventListener('click', function(){
      toggleAudio();
});
  
function toggleAudio() {
    if (!audioEnabled) {
        audioEnabled = true;
        audioCont.style.backgroundImage = "url('img/audioOn.png')";
    } else {
        audioEnabled = false;
        audioCont.style.backgroundImage = "url('img/audioOff.png')";
    }
}
  
function playJumpAudio () {
  if (audioEnabled){
      audioElem.play();
  }
}

function playGameOverAudio () {
  if (audioEnabled){
      gameOverBox.play();
  }
}

/* BUTTON FUNCTIONS */
newGameBtn.addEventListener('click', function() { // HIDE ALL MENU ELEMS, START GAME
    document.getElementById("newGame").style.display = "none";
    document.getElementById("header").style.display = "none";
    document.getElementById("instr").style.display = "none";       
    document.getElementById("instrBtn").style.display = "none";
    document.getElementById("hsBtn").style.display = "none";
    document.getElementById("hsBoard").style.display = "none";
    leftInstr.classList.add("activeInstr"); // APPEND CLASS TO SHOW TOUCH INSTRUCTIONS UPON START GAME
    rightInstr.classList.add("activeInstr");
    start();
});

seeInstrBtn.addEventListener('click', function(){ // HIDE IRRELEVANT, SHOW RELEVANT MENU ELEMS
    document.getElementById("header").style.display = "none";
    document.getElementById("instrBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("instr").style.display = "block";
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("hsBtn").style.display = "none";
    document.getElementById("hsBoard").style.display = "none";
    document.getElementById("backBtn").style.top = "63%";
});

seeHsBtn.addEventListener('click', function(){ // HIDE IRRELEVANT, SHOW RELEVANT MENU ELEMS
    document.getElementById("header").style.display = "none";
    document.getElementById("hsBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("instrBtn").style.display = "none";
    document.getElementById("instr").style.display = "none";
    document.getElementById("hsBoard").style.display = "block";
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("backBtn").style.top = "80%";
    makeList(); // GETS HIGHSCORE LIST FROM DB, SHOWS TOP 10
});

goBackBtn.addEventListener('click', function() {
    goBack();
});

function goBack() { // GO BACK TO MENU HOME
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("instr").style.display = "none";
    document.getElementById("header").style.display = "block";
    document.getElementById("newGame").style.display = "block";
    document.getElementById("instrBtn").style.display = "block";
    document.getElementById("hsBtn").style.display = "block";
    document.getElementById("hsBoard").style.display = "none";
};

/* RANDOM NUM GEN */
function randomIntInRange (min, max){
    return Math.round(Math.random() * (max - min) + min);
}

/* KEY/TOUCH CONTROLLERS */
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

leftTouch.addEventListener('touchstart', function() {
  touchedLeft = true;

});

leftTouch.addEventListener('touchend', function() {
    touchedLeft = false;
});

rightTouch.addEventListener('touchstart', function() {
  touchedRight = true;

});

rightTouch.addEventListener('touchend', function() {
    touchedRight = false;
  });

/* PLAYER CLASS */
class Player {
  constructor(playerImg, x, y, r, ratio) {
    this.playerImg = playerImg;
    this.x = x; 
    this.y = y;
    this.r = r;
    this.w = r * 2;
    this.h = r * 2;

    this.dy = 0;
    this.originalJumpForce = 18;
    this.jumpForce = this.originalJumpForce * ratio;
    this.originalRad = r;
    this.grounded = false;
    this.jumpTimer = 0;
    /* this.newRotation = 0; */
    this.ratio = 1;
  }

  updateRatio(ratio) {
    this.ratio = ratio;
  }

  getRatioValue(value) {
    console.log(ratio);
    return value * ratio * 4;
  }

  animate() { // IF CLICK/HOLD SPACE/W/TOUCH_RIGHT THEN JUMP
    if (["Space", "KeyW"].includes(keyPressed) || touchedRight) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    // IF CLICK/HOLD SHIFT_LEFT/S/TOUCH_LEFT THEN SHRINK TO HALF RADIUS
    if (["ShiftLeft", "KeyS"].includes(keyPressed) || touchedLeft) {
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

    /* GRAVITY */
    this.y += this.dy; 

    if (this.y + this.r < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.r;
    }

    this.draw();
  }

  jump() {
    if (this.r != this.originalRad) return;

    if (this.grounded && this.jumpTimer == 0) { // CAN JUMP IF GROUNDED
      this.jumpTimer = 1.5;
      this.dy = -this.jumpForce;
      playJumpAudio();
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  draw() {
    ctx.translate(this.x, this.y);
    ctx.rotate(rotation);

    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
      this.playerImg,
      this.x - this.getRatioValue(this.r),
      this.y - this.getRatioValue(this.r),
      this.w,
      this.h
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

/* CHATBUBBLE OBSTACLE CLASS */
class Obstacle {
  constructor(x, y, w, h, obsImg) {
    this.obsImg = obsImg;
    (this.x = x), (this.y = y), (this.w = w);
    this.h = h;

    this.dx = -gameSpeed; // OBSTACLE MOVEMENT 
    obsImg.width = this.w;
    obsImg.height = this.h;
  }

  update() {
    this.x += this.dx;
    this.dx = -gameSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(
      this.obsImg,
      this.x,
      this.y,
      this.w * 1.1,
      this.h
    );
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

/* ROCK OBSTACLE CLASS */
class Rock {
  constructor(x, y, w, h, rockImg) {
    this.rockImg = rockImg;
    this.x = x + w / 4;
    this.y = y + h / 1.7;
    this.originalW = w;
    this.originalH = h;
    this.w = w;
    this.h = h;

    this.dx = -gameSpeed;
    rockImg.width = this.w;
    rockImg.height = this.h;
  }

  updateRatio(ratio) {
    this.w = this.originalH * ratio;
    this.h = this.originalW * ratio;
  }

  update() {
    this.x += this.dx;
    this.dx = -gameSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(
      this.rockImg,
      this.x - this.w * 0.7, // MULTIPLIERS TO TWEAK COLLISION AREA
      this.y - this.h * 0.6,
      this.w + this.w * 1.5,
      this.h + this.h * 1.1
    );
    ctx.closePath();
  }
}

/* ROADBLOCK OBSTACLE CLASS */
class Roadblock {
  constructor(x, y, w, h, roadblockImg) {
    this.roadblockImg = roadblockImg;
    (this.x = x), (this.y = y), (this.w = w);
    this.h = h;

    this.dx = -gameSpeed;
    roadblockImg.width = this.w;
    roadblockImg.height = this.h;
  }

  update() {
    this.x += this.dx;
    this.dx = -gameSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(
      this.roadblockImg,
      this.x,
      this.y - this.h * 0.1,
      this.w,
      this.h * 1.25
    );
    ctx.closePath();
  }
}

/* SCORE/HIGHSCORE CLASS */
class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  updateRatio(ratio) {
    this.x = this.x * ratio;
    this.y = this.y * ratio;
    this.s = this.s * ratio;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px Courier New";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

/* GET DISTANCE BETWEEN PLAYER/OBSTACLE */
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

/* SPAWN OBSTACLES */
let initialSpawnTimer = 200; 
let spawnTimer = initialSpawnTimer;

function spawnObstacle (){
    let sizeX;
    let sizeY;
    let type = randomIntInRange(0, 2); // RANDOM GEN OBSTACLE TYPE 0-2
    let obstacle = new Obstacle(
        canvas.width + sizeX, 
        canvas.height - sizeX, 
        sizeX,
        sizeY,
        obsImg
        );
        
        if (type == 0){
            sizeX = randomIntInRange(120, 160) * ratio;
            sizeY = sizeX / 2;
            obstacle = new Rock(
                canvasWidth + sizeX, 
                canvasHeight - sizeY, 
                sizeX,
                sizeY,
                rockImg  
                );  
            } else if (type == 1){
            sizeX = randomIntInRange(80, 160) * ratio;
            sizeY = sizeX / 2;
            obstacle = new Obstacle(
                canvasWidth + sizeX, 
                canvasHeight, 
                sizeX,
                sizeY,
                obsImg
                );
            obstacle.y -= player.originalRad  + randomIntInRange(sizeX/2, sizeX*2);
        } else if (type == 2){
            sizeX = 150 * ratio;
            sizeY = sizeX / 2;
            obstacle = new Roadblock(
                canvasWidth + sizeX, 
                canvasHeight - sizeY, 
                sizeX,
                sizeY,
                roadblockImg  
            );
        }

    obstacles.push(obstacle);
}

/* SETTING START GAME ATTRIBUTES */
function start () {
    ctx.font = toString(40*ratio) + "px Courier New";

    active = true;

    gameSpeed = 7 * ratio;
    gravity = 1;
	  defaultPlaybackRate = 1;

    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')){
        highscore = localStorage.getItem('highscore');
    }

    player = new Player(playerImg, 100, 0, 50, 1);
    scoreText = new Text("Score: " + score, 45, 45, "left", "#212121", 40);
    highscoreText = new Text(
      "Highscore: " + highscore,
      45,
      90,
      "left",
      "gold",
      40
    );

    window.requestAnimationFrame(fpsRate);
}

/* FPS CONTROLLER */
const fps = 60;
const interval = 1000 / fps;
let now;
let then = performance.now();
let delta;

function fpsRate() {
    now = performance.now();
    delta = now - then;
    
    if (delta > interval){
		then = now - (delta % interval);
        update();
    } else {
		window.requestAnimationFrame(fpsRate);
	}
}

/* UPDATE CANVAS FUNCTION */
function update () {

    ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEAR LAST CANVAS BEFORE DRAWING NEW

    spawnTimer -= 1;
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

        /* WHEN GAME OVER */
        if (getDistance(player, o)) {
            playGameOverAudio();
            active = false;
            obstacles = [];
            spawnTimer = initialSpawnTimer;
            gameSpeed = 6 * ratio;    
            window.localStorage.setItem('highscore', highscore);
            score -= 1;
            highscore -= 1;
            if (score >= highscore){
                registerNewHighscore(highscore+1);
            }
            goBack(); // CALLS MENU
        }
    }

    if (active){ // IF STILL ALIVE
        window.requestAnimationFrame(fpsRate);
        leftTouch.style = "z-index: 7";
        rightTouch.style = "z-index: 7";
    } else {
        leftTouch.style = "z-index: 5";
        rightTouch.style = "z-index: 5";
    }
    
    player.animate();
    
    score += 1;
    scoreText.t = "Score: " + score;
    scoreText.draw();

    /* SET NEW HIGHSCORE */
    if (score > highscore){
        highscore = score;
        highscoreText.t = "Highscore: " + highscore;
        
    }

    /* SCALING REALTIME */
    window.addEventListener("resize", () => {
      ratio = setPixelToWorldScale();
      player.updateRatio(ratio);
      scoreText.updateRatio(ratio);
      highscoreText.updateRatio(ratio);
      obstacles.forEach((obstacle) => {
        obstacle.updateRatio(ratio);
      });
    });

    highscoreText.draw();
    
    
    rotation += Math.PI/180 * 2 + gameSpeed * 0.01; // ROTATION SPEED INCREASES WITH GAME PROGRESS
    gameSpeed += 0.0015 * ratio; // GAMESPEED INCREASES WITH GAME PROGRESS

	musicElem.playbackRate = defaultPlaybackRate;
	defaultPlaybackRate += 0.00003; // MUSIC SPEED INCREASES WITH GAME PROGRESS

}