/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */

import { registerNewHighscore, makeList } from './globalHs.js';
import global from './global.js';
import { canvas, ctx } from './canvas.js';
import Text from './text.js';
import Obstacle from './obstacles/chatbubble.js';
import Roadblock from './obstacles/roadblock.js';
import Rock from './obstacles/rock.js';

const newGameBtn = document.getElementById('newGame');
const seeInstrBtn = document.getElementById('instrBtn');
const seeHsBtn = document.getElementById('hsBtn');
const goBackBtn = document.getElementById('backBtn');
const musicCont = document.getElementById('music');
const musicElem = document.getElementById('musicBox');
const audioCont = document.getElementById('audio');
const audioElem = document.getElementById('audioBox');
const gameOverElem = document.getElementById('gameOverBox');
const leftTouch = document.getElementById('leftArea');
const rightTouch = document.getElementById('rightArea');
const rolloverElem = document.getElementById('rolloverBox');
const btns = document.querySelectorAll('.btn');
const leftInstr = document.querySelector('.instrLeft');
const rightInstr = document.querySelector('.instrRight');

const worldWidth = 900;
const worldHeight = 900;
canvas.width = worldWidth;
canvas.height = worldHeight;
const worldElem = document.querySelector('[data-world]');

const obsImg = createImage('img/chatbubble.png');
const rockImg = createImage('img/rock.png');
const roadblockImg = createImage('img/roadblock.png');
const playerImg = createImage('img/logoPlayer.png');

function createImage(path) {
  const image = new Image();
  image.src = path;
  return image;
}

/* UTILITY FUNCTIONS */
/* SCALING */
setPixelToWorldScale();
window.addEventListener('resize', () => {
  setPixelToWorldScale();
});

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < worldWidth / worldHeight) {
    worldToPixelScale = window.innerWidth / worldWidth;
  } else {
    worldToPixelScale = window.innerHeight / worldHeight;
  }

  worldElem.style.width = `${worldWidth * worldToPixelScale}px`;
  worldElem.style.height = `${worldHeight * worldToPixelScale}px`;

  return worldToPixelScale;
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

  if (delta > interval) {
    then = now - (delta % interval);
    update();
  } else {
    window.requestAnimationFrame(fpsRate);
  }
}

/* RANDOM NUM GEN */
function randomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/* AUDIO & MUSIC */
btns.forEach((btn) => {
  btn.addEventListener('mouseover', () => playRolloverAudio());
});

function playRolloverAudio() {
  if (global.audioEnabled) {
    rolloverElem.play();
  }
}

musicCont.addEventListener('click', () => {
  toggleMusic();
});

function toggleMusic() {
  if (!global.musicEnabled) {
    global.musicEnabled = true;
    musicCont.style.backgroundImage = "url('img/musicOn.png')";
    musicElem.muted = false;
    musicElem.volume = 0.7;
    musicElem.play();
  } else {
    global.musicEnabled = false;
    musicCont.style.backgroundImage = "url('img/musicOff.png')";
    musicElem.muted = true;
  }
}

audioCont.addEventListener('click', () => {
  toggleAudio();
});

function toggleAudio() {
  if (!global.audioEnabled) {
    global.audioEnabled = true;
    audioCont.style.backgroundImage = "url('img/audioOn.png')";
  } else {
    global.audioEnabled = false;
    audioCont.style.backgroundImage = "url('img/audioOff.png')";
  }
}

function playJumpAudio() {
  if (global.audioEnabled) {
    audioElem.play();
  }
}

function playGameOverAudio() {
  if (global.audioEnabled) {
    gameOverElem.play();
  }
}

/* BUTTON FUNCTIONS */
newGameBtn.addEventListener('click', () => { // HIDE ALL MENU ELEMS, START GAME
  document.getElementById('newGame').style.display = 'none';
  document.getElementById('header').style.display = 'none';
  document.getElementById('instr').style.display = 'none';
  document.getElementById('instrBtn').style.display = 'none';
  document.getElementById('hsBtn').style.display = 'none';
  document.getElementById('hsBoard').style.display = 'none';
  leftInstr.classList.add('activeInstr'); // APPEND CLASS TO SHOW TOUCH INSTRUCTIONS UPON START GAME
  rightInstr.classList.add('activeInstr');
  start();
});

seeInstrBtn.addEventListener('click', () => { // HIDE IRRELEVANT, SHOW RELEVANT MENU ELEMS
  document.getElementById('header').style.display = 'none';
  document.getElementById('instrBtn').style.display = 'none';
  document.getElementById('newGame').style.display = 'none';
  document.getElementById('instr').style.display = 'block';
  document.getElementById('backBtn').style.display = 'block';
  document.getElementById('hsBtn').style.display = 'none';
  document.getElementById('hsBoard').style.display = 'none';
  document.getElementById('backBtn').style.top = '63%';
});

seeHsBtn.addEventListener('click', () => { // HIDE IRRELEVANT, SHOW RELEVANT MENU ELEMS
  document.getElementById('header').style.display = 'none';
  document.getElementById('hsBtn').style.display = 'none';
  document.getElementById('newGame').style.display = 'none';
  document.getElementById('instrBtn').style.display = 'none';
  document.getElementById('instr').style.display = 'none';
  document.getElementById('hsBoard').style.display = 'block';
  document.getElementById('backBtn').style.display = 'block';
  document.getElementById('backBtn').style.top = '80%';
  makeList(); // GETS HIGHSCORE LIST FROM DB, SHOWS TOP 10
});

goBackBtn.addEventListener('click', () => {
  goBack();
});

function goBack() { // GO BACK TO MENU HOME
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('instr').style.display = 'none';
  document.getElementById('header').style.display = 'block';
  document.getElementById('newGame').style.display = 'block';
  document.getElementById('instrBtn').style.display = 'block';
  document.getElementById('hsBtn').style.display = 'block';
  document.getElementById('hsBoard').style.display = 'none';
}

/* KEY/TOUCH CONTROLLERS */
document.addEventListener('keydown', (evt) => {
  if (global.isKeyPressed) return;

  global.isKeyPressed = true;
  global.keyPressed = evt.code;
});

document.addEventListener('keyup', (evt) => {
  if (evt.code !== global.keyPressed) return; // ONLY RESPOND TO KEY ALREADY PRESSED

  global.isKeyPressed = false;
  global.keyPressed = null;
});

leftTouch.addEventListener('touchstart', () => {
  global.touchedLeft = true;
});

leftTouch.addEventListener('touchend', () => {
  global.touchedLeft = false;
});

rightTouch.addEventListener('touchstart', () => {
  global.touchedRight = true;
});

rightTouch.addEventListener('touchend', () => {
  global.touchedRight = false;
});

/* PLAYER CLASS */
class Player {
  constructor(playerImg, x, y, r) {
    this.playerImg = playerImg;
    this.x = x;
    this.y = y;
    this.r = r;
    this.w = this.r * 2;
    this.h = this.r * 2;

    this.dy = 0;
    this.originalJumpForce = 18;
    this.jumpForce = this.originalJumpForce;
    this.originalRad = r;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  animate() { // IF CLICK/HOLD SPACE/W/TOUCH_RIGHT THEN JUMP
    if (['Space', 'KeyW'].includes(global.keyPressed) || global.touchedRight) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    // IF CLICK/HOLD SHIFT_LEFT/S/TOUCH_LEFT THEN SHRINK TO HALF RADIUS
    if (['ShiftLeft', 'KeyS'].includes(global.keyPressed) || global.touchedLeft) {
      this.r = this.originalRad / 2;
      this.w = this.originalRad;
      this.h = this.originalRad;
    } else {
      this.r = this.originalRad;
      this.w = this.r * 2;
      this.h = this.r * 2;
    }

    /* GRAVITY */
    this.y += this.dy;

    if (this.y + this.r < canvas.height) {
      this.dy += global.gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.r;
    }

    this.draw();
  }

  jump() {
    if (this.r !== this.originalRad) return;

    if (this.grounded && this.jumpTimer === 0) { // CAN JUMP IF GROUNDED
      this.jumpTimer = 1.5;
      this.dy = -this.jumpForce;
      playJumpAudio();
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer += 1;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  draw() {
    ctx.translate((this.x), (this.y));
    ctx.rotate(global.rotation);

    ctx.translate((-this.x), (-this.y));
    ctx.drawImage(
      this.playerImg,
      this.x - this.r,
      this.y - this.r,
      this.r * 2,
      this.r * 2,
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

/* GET DISTANCE BETWEEN PLAYER/OBSTACLE */
function getDistance(player, obstacle) {
  const distX = Math.abs(player.x - (obstacle.x + obstacle.w / 2));
  const distY = Math.abs(player.y - (obstacle.y + obstacle.h / 2));

  if (distX > (obstacle.w / 2 + player.r)) { return false; }
  if (distY > (obstacle.h / 2 + player.r)) { return false; }

  if (distX <= (obstacle.w)) { return true; }
  if (distY <= (obstacle.h)) { return true; }

  const dx = distX - obstacle.w / 2;
  const dy = distY - obstacle.h / 2;
  return (dx * dx + dy * dy <= (player.r * player.r));
}

/* SPAWN OBSTACLES */
const initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function spawnObstacle() {
  let sizeX;
  let sizeY;
  const type = randomIntInRange(0, 2); // RANDOM GEN OBSTACLE TYPE 0-2
  let obstacle = new Obstacle(
    canvas.width + sizeX,
    canvas.height - sizeX,
    sizeX,
    sizeY,
    obsImg,
  );

  if (type === 0) {
    sizeX = randomIntInRange(120, 160);
    sizeY = sizeX / 2;
    obstacle = new Rock(
      canvas.width + sizeX,
      canvas.height - sizeY,
      sizeX,
      sizeY,
      rockImg,
    );
  } else if (type === 1) {
    sizeX = randomIntInRange(80, 160);
    sizeY = sizeX / 2;
    obstacle = new Obstacle(
      canvas.width + sizeX,
      canvas.height,
      sizeX,
      sizeY,
      obsImg,
    );
    obstacle.y -= global.player.originalRad + randomIntInRange(sizeX / 2, sizeX * 2);
  } else if (type === 2) {
    sizeX = 150;
    sizeY = sizeX / 2;
    obstacle = new Roadblock(
      canvas.width + sizeX,
      canvas.height - sizeY,
      sizeX,
      sizeY,
      roadblockImg,
    );
  }

  global.obstacles.push(obstacle);
}

/* SETTING START GAME ATTRIBUTES */
function start() {
  ctx.font = `${toString(40)}px Courier New`;

  global.active = true;

  global.gameSpeed = 7;
  global.gravity = 1;
  global.defaultPlaybackRate = 1;

  global.score = 0;
  global.highscore = 0;
  if (localStorage.getItem('highscore')) {
    global.highscore = localStorage.getItem('highscore');
  }

  global.player = new Player(playerImg, 100, 0, 50, 1);
  global.scoreText = new Text(
    `Score: ${global.score}`,
    45,
    65,
    'left',
    '#212121',
    40,
  );
  global.highscoreText = new Text(
    `Highscore: ${global.highscore}`,
    45,
    110,
    'left',
    'gold',
    40,
  );

  window.requestAnimationFrame(fpsRate);
}

/* UPDATE CANVAS FUNCTION */
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEAR LAST CANVAS BEFORE DRAWING NEW

  spawnTimer -= 1;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = initialSpawnTimer - global.gameSpeed * 8;

    if (spawnTimer < 60) {
      spawnTimer = randomIntInRange(40, 80);
    }
  }

  for (let i = global.obstacles.length - 1; i >= 0; i -= 1) {
    const o = global.obstacles[i];
    o.update();
    o.draw();

    if (o.x + o.y < 0) {
      global.obstacles.splice(i, 1);
    }

    /* WHEN GAME OVER */
    if (getDistance(global.player, o)) {
      playGameOverAudio();
      global.active = false;
      global.obstacles = [];
      spawnTimer = initialSpawnTimer;
      global.gameSpeed = 6;
      window.localStorage.setItem('highscore', global.highscore);
      global.score -= 1;
      global.highscore -= 1;
      if (global.score >= global.highscore) {
        registerNewHighscore(global.highscore + 1);
      }
      goBack(); // CALLS MENU
    }
  }

  if (global.active) { // IF STILL ALIVE
    window.requestAnimationFrame(fpsRate);
    leftTouch.style = 'z-index: 7';
    rightTouch.style = 'z-index: 7';
  } else {
    leftTouch.style = 'z-index: 5';
    rightTouch.style = 'z-index: 5';
  }

  global.player.animate();

  global.score += 1;
  global.scoreText.t = `Score: ${global.score}`;
  global.scoreText.draw();

  /* SET NEW HIGHSCORE */
  if (global.score > global.highscore) {
    global.highscore = global.score;
    global.highscoreText.t = `Highscore: ${global.highscore}`;
  }

  global.player.draw();
  global.highscoreText.draw();

  global.rotation += (Math.PI / 180) * 2 + global.gameSpeed * 0.01; // ROTATION SPEED INCREASES WITH GAME PROGRESS
  global.gameSpeed += 0.0015; // GAMESPEED INCREASES WITH GAME PROGRESS

  musicElem.playbackRate = global.defaultPlaybackRate;
  global.defaultPlaybackRate += 0.00003; // MUSIC SPEED INCREASES WITH GAME PROGRESS
}
