var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.height = window.innerHeight - 20;
canvas.width = window.innerWidth - 20;

var arrowrange = 800;

var balloon = {
  x: window.innerWidth / 2,
  y: 100,
  dx: 0,
  radius: 50,
  height: 200,
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  },
};

var img1 = new Image();
img1.src = "arrow.png";

class Arrow {
  constructor() {
    this.x = Math.abs(
      Math.floor(Math.random() * arrowrange) + balloon.x - arrowrange / 2
    );
    this.y = canvas.height;
    this.width = 16;
    this.height = 60;
  }
  draw() {
    ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(img1, this.x - 24, this.y);
  }
}

var timer = 0;
var repeat = 0;
var ispressA = false;
var ispressD = false;
var arrows = [];
var animation;
var score = 0;
var over = false;
var hscore = 0;
var shoot = 50;

function update() {
  animation = requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (repeat >= shoot) {
    var arrow = new Arrow();
    arrows.push(arrow);
    repeat = 0;
  }

  if (timer % 50 === 0 && shoot !== 10) {
    shoot--;
  }

  if (timer % 7 === 0) {
    score++;
  }

  arrows.forEach((a, i, o) => {
    if (a.y < 0) {
      o.splice(i, 1);
    }
  });

  if (ispressA && balloon.x - 3 > balloon.radius) {
    balloon.dx -= 3;
  }
  if (ispressD && balloon.x + 3 < window.innerWidth - balloon.radius) {
    balloon.dx += 3;
  }
  balloon.x += balloon.dx;
  balloon.y += Math.sin(timer / 20);
  balloon.draw();

  timer++;
  repeat++;
  balloon.dx = 0;

  arrows.forEach((a) => {
    a.y -= 10;
    a.draw();
  });

  ctx.fillStyle = "black";
  ctx.font = "40px DungGeunMo";
  ctx.fillText("Score: " + score, window.innerWidth - 300, 50);

  arrows.forEach((a) => {
    if (distance(balloon, a) < balloon.radius) {
      cancelAnimationFrame(animation);
      if (score > hscore) {
        hscore = score;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.font = "100px DungGeunMo";
      ctx.fillText("GAME OVER", 900, 300);
      ctx.font = "50px DungGeunMo";
      ctx.fillText("final score: " + score, 900, 400);
      ctx.fillText("highest score: " + hscore, 900, 475);
      ctx.font = "70px DungGeunMo";
      ctx.fillStyle = "lime";
      ctx.fillText("press space key to replay", 900, 775);
      ctx.strokeStyle = "green";
      ctx.strokeText("press space key to replay", 900, 775);
      over = true;
      arrows.length = 0;
      balloon.x = window.innerWidth / 2;
      score = 0;
      timer = 0;
      shoot = 50;
      repeat = 0;
    }
  });
}
update();

function distance(a, b) {
  return Math.sqrt((a.x - (b.x + b.width / 2)) ** 2 + (a.y - b.y) ** 2);
}

document.addEventListener("keyup", (e) => {
  if (e.code === "KeyA") {
    ispressA = false;
  }
  if (e.code === "KeyD") {
    ispressD = false;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyA") {
    ispressA = true;
  }
  if (e.code === "KeyD") {
    ispressD = true;
  }
  if (e.code === "Space" && over) {
    update();
    over = false;
  }
});
