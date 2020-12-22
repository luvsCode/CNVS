//------------------------- SET CANVAS -------------------------
const canvas = document.getElementById("cnvs");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//------------------------- GLOBAL -------------------------
let score = 0;
let gameFrame = 0;
let maxEnemies = 30;
let currentEnemies = 0;
const playerSprite = new Image();
playerSprite.src = "./assets/nickfury.png";
const keys = [];
const superEnemy = new Image();
superEnemy.src = "./assets/bahamut.png";
const mainEnemy = new Image();
mainEnemy.src = "./assets/leviathan.png";
const enemyImg = new Image();
enemyImg.src = "./assets/phoenix.png";
const background = new Image();
background.src = "./assets/futurebg.jpg";
const ammoPic = new Image();
ammoPic.src = "./assets/batSprite.png";

const random2numbers = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const minMax = Math.floor(Math.random() * (max - min) + min);
  return minMax;
};

const drawSprite = (img, sX, sY, sW, sH, dX, dY, dW, dH) => {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
};

//------------------------- ENEMY SETUP -------------------------
const enemyArray = [];

class Enemies {
  constructor() {
    this.x = canvas.width;
    this.y = random2numbers(400, canvas.height - 100);
    this.img = enemyImg;
    this.width = 96;
    this.height = 96;
    this.frameX = 0;
    this.frameY = 1;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
  }

  update() {
    this.x -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy) * 2;
  }

  draw() {
    drawSprite(
      this.img,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (this.frameX < 3) {
      this.frameX++;
    } else {
      this.frameX = 0;
    }
    //this.frameX <= 3 ? this.frameX++ : (this.frameX = 0);
  }
}

class Vermin {
  constructor(y, width, height, img, speed) {
    this.x = canvas.width;
    this.y = y;
    this.img = img;
    this.width = width;
    this.height = height;
    this.frameX = 0;
    this.frameY = 1;
    this.speed = speed;
    this.distance;
    this.counted = false;
  }

  update() {
    this.x -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy) * 2;
  }

  draw() {
    drawSprite(
      this.img,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (this.frameX < 3) {
      this.frameX++;
    } else {
      this.frameX = 0;
    }
    //this.frameX <= 3 ? this.frameX++ : (this.frameX = 0);
  }
}
// let popVermin = new Vermin(
//   random2numbers(400, canvas.height - 100),
//   96,
//   96,
//   "./leviathan.png"
// );

let popEnemies = setInterval(() => {
  enemyArray.push(new Enemies());
  enemyArray.push(
    new Vermin(
      random2numbers(80, canvas.height - 700),
      96,
      96,
      mainEnemy,
      Math.random() * 10 + 1
    )
  );
  enemyArray.push(
    new Vermin(
      random2numbers(650, canvas.height - 100),
      96,
      96,
      superEnemy,
      Math.random() * 2 + 1
    )
  );
  currentEnemies++;
  console.log(enemyArray);
}, 500);

function handleEnemies() {
  for (i = 0; i < enemyArray.length; i++) {
    // if (currentEnemies < maxEnemies) {
    //   popVermin.update();
    //   popVermin.draw();
    // }

    //enemyPop[i];
    enemyArray[i].update();
    enemyArray[i].draw();

    if (enemyArray[i].x < 0 - enemyArray[i].width) {
      enemyArray.splice(i, 1);
    }

    if (enemyArray[i]) {
      if (enemyArray[i].distance < enemyArray[i].width) {
        if (!enemyArray[i].counted) {
          score++;
          enemyArray[i].counted = true;
          enemyArray.splice(i, 1);
        }
      }
    }
  }

  if (currentEnemies == maxEnemies) {
    clearInterval(popEnemies);
  }

  return;
}

//------------------------- PLAYER SETUP -------------------------

const player = {
  x: 100,
  y: canvas.height - 200,
  width: 32,
  height: 48,
  frameX: 0,
  frameY: 2,
  speed: 10,
  moving: false,
};

window.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
  player.moving = true;
});

window.addEventListener("keyup", function (e) {
  delete keys[e.keyCode];
  player.moving = false;
});

function movePlayer() {
  //move up
  if (keys[38] && player.y > 400) {
    player.y -= player.speed;
    player.frameY = 3;
    player.moving = true;
  }
  //move left
  if (keys[37] && player.x > 0) {
    player.x -= player.speed;
    player.frameY = 1;
    player.moving = true;
  }

  //move down
  if (keys[40] && player.y < canvas.height - 100) {
    player.y += player.speed;
    player.frameY = 0;
    player.moving = true;
  }

  //move right
  if (keys[39] && player.x < canvas.width - player.width) {
    player.x += player.speed;
    player.frameY = 2;
    player.moving = true;
  }
}

function handlePlayerFrame() {
  if (player.frameX < 3 && player.moving) player.frameX++;
  else player.frameX = 0;
}

//------------------------- ANIMATE AND RENDER -------------------------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawSprite(
    playerSprite,
    player.width * player.frameX,
    player.height * player.frameY,
    player.width,
    player.height,
    player.x,
    player.y,
    player.width * 1.5,
    player.height * 1.5
  );

  ctx.font = "3.5rem Gochi Hand";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 50);
}

//------------------------- MAIN CALL -------------------------
function updateGame() {
  animate();
  handleEnemies();
  movePlayer();
  handlePlayerFrame();
  requestAnimationFrame(updateGame);
}
updateGame();
