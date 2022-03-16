var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.height = window.innerHeight - 20;
canvas.width = window.innerWidth - 20;

var arrowrange = 800;

var balloon = {
  x: canvas.width / 2,
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

var img2 = new Image();
img2.src = "follow.png";

class Follow {
  constructor() {
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = canvas.height;
    this.width = 39;
    this.height = 46;
    this.follow = 120;
    this.arc = 0;
    this.more = false;
  }
  draw() {
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.ismore) {
      ctx.rotate(this.arc - Math.PI / 2);
    } else {
      ctx.rotate(-this.arc + Math.PI / 2);
    }
    ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    ctx.drawImage(img2, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

var timer = 0;
var repeat = 0;
var frepeat = 0;
var ispressA = false;
var ispressD = false;
var pjs = new Map();
pjs.set("arrow", []);
pjs.set("follow", []);
var animation;
var score = 0;
var over = false;
var hscore = 0;
var ashoot = 100;
var fshoot = 500;

function update() {
  animation = requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (repeat >= ashoot) {
    var arrow = new Arrow();
    pjs.get("arrow").push(arrow);
    repeat = 0;
  }

  if (frepeat >= fshoot) {
    var follow = new Follow();
    pjs.get("follow").push(follow);
    frepeat = 0;
  }

  if (timer % 50 === 0 && ashoot !== 15) {
    ashoot--;
  }

  if (timer % 7 === 0) {
    score++;
  }

  pjs.get("follow").forEach((a, i, o) => {
    if (a.y < -50) {
      o.splice(i, 1);
    }
  });
  pjs.get("arrow").forEach((a, i, o) => {
    if (a.y < -50) {
      o.splice(i, 1);
    }
  });

  if (ispressA && balloon.x - 3 > balloon.radius) {
    balloon.dx -= 3;
  }
  if (ispressD && balloon.x + 3 < canvas.width - balloon.radius) {
    balloon.dx += 3;
  }
  balloon.x += balloon.dx;
  balloon.y += Math.sin(timer / 20);
  balloon.draw();

  timer++;
  repeat++;
  frepeat++;
  balloon.dx = 0;

  pjs.get("arrow").forEach((a) => {
    a.y -= 10;
    a.draw();
  });

  pjs.get("follow").forEach((a) => {
    if (a.follow > 0) {
      const ry = Math.abs(a.y - balloon.y);
      const r = distance(balloon, a);
      const arc = Math.asin(ry / r);
      a.ismore = false;
      if (a.y > balloon.y) {
        a.y -= Math.sin(arc) * 3;
      } else {
        a.y += Math.sin(arc) * 3;
      }
      if (a.x > balloon.x) {
        a.x -= Math.cos(arc) * 3;
        a.ismore = true;
      } else {
        a.x += Math.cos(arc) * 3;
      }
      a.arc = arc;
      a.follow--;
      a.draw();
    } else {
      a.y -= Math.sin(a.arc) * 3;
      if (a.ismore) {
        a.x -= Math.cos(a.arc) * 3;
      } else {
        a.x += Math.cos(a.arc) * 3;
      }
      a.draw();
    }
  });

  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  ctx.font = "40px DungGeunMo";
  ctx.fillText("Score: " + score, canvas.width, 40);

  pjs.forEach((v) => {
    v.forEach((a) => {
      if (distance(balloon, a) < balloon.radius) {
        cancelAnimationFrame(animation);
        if (score > hscore) {
          hscore = score;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "100px DungGeunMo";
        ctx.fillText("GAME OVER", canvas.width / 2, 300);
        ctx.font = "50px DungGeunMo";
        ctx.fillText("final score: " + score, canvas.width / 2, 400);
        ctx.fillText("highest score: " + hscore, canvas.width / 2, 475);
        ctx.font = "70px DungGeunMo";
        ctx.fillStyle = "lime";
        ctx.fillText("press space key to replay", canvas.width / 2, 775);
        ctx.strokeStyle = "green";
        ctx.strokeText("press space key to replay", canvas.width / 2, 775);
        over = true;
        pjs.get("arrow").length = 0;
        balloon.x = canvas.width / 2;
        balloon.y = 100;
        score = 0;
        timer = 0;
        ashoot = 100;
        repeat = 0;
        frepeat = 0;
        pjs.get("follow").length = 0;
        pjs.length = 0;
      }
    });
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

document.addEventListener("touchend", (e) => {
  const x = e.changedTouches[0].clientX;
  if (x < canvas.width / 2) {
    ispressA = false;
  }
  if (x > canvas.width / 2) {
    ispressD = false;
  }
});

document.addEventListener("touchstart", (e) => {
  const x = e.changedTouches[0].clientX;
  if (x < canvas.width / 2) {
    ispressA = true;
  }
  if (x > canvas.width / 2) {
    ispressD = true;
  }
  if (over) {
    update();
    over = false;
  }
});

function checkMobileDevice() {
  var mobileKeyWords = new Array(
    "Android",
    "iPhone",
    "iPod",
    "BlackBerry",
    "Windows CE",
    "SAMSUNG",
    "LG",
    "MOT",
    "SonyEricsson"
  );
  for (var info in mobileKeyWords) {
    if (navigator.userAgent.match(mobileKeyWords[info]) != null) {
      return true;
    }
  }
  return false;
}
