var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.height = window.innerHeight - 20;
canvas.width = window.innerWidth - 20;

var balloon = {
  x: 100,
  y: 100,
  dx: 0,
  radius: 50,
  height: 200,
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.height);
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
    this.x = Math.floor(Math.random() * canvas.width);
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
var ispressA = false;
var ispressD = false;
var arrows = [];
var animation;
var score = 0;

function update() {
  animation = requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (timer % 100 === 0) {
    var arrow = new Arrow();
    arrows.push(arrow);
  }
  if (timer % 7 === 0) {
    score++;
  }
  arrows.forEach((a) => {
    if (distance(balloon, a) < balloon.radius) {
      cancelAnimationFrame(animation);
    }

    a.y -= 10;
    a.draw();
  });
  arrows.forEach((a, i, o) => {
    if (a.y < 0) {
      o.splice(i, 1);
    }
  });

  if (ispressA) {
    balloon.dx -= 3;
  }
  if (ispressD) {
    balloon.dx += 3;
  }
  balloon.x += balloon.dx;
  balloon.y += Math.sin(timer / 20);
  balloon.draw();

  ctx.font = "40px";
  ctx.fillText("Score: " + score, 100, 100);

  timer++;
  balloon.dx = 0;
}
update();

function distance(a, b) {
  return Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2);
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
});
