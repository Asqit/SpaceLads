const TwoDVersion = 1;
const Area = {
  area: document.createElement("canvas"),
  create: function (w, h, zIndex, color) {
    this.area.width = w;
    this.area.height = h;
    this.area.style.zIndex = zIndex;
    this.area.style.backgroundColor = color;
    this.num = Math.floor(Math.random() * 100);
    this.area.className = "canvas" + this.num;
    this.area.innerHTML =
      "your browser does not support HTML5, please upgrade first!";
    this.area.ctx = this.area.getContext("2d");
    document.body.insertBefore(this.area, document.body.childNodes[0]);
  },
  resize: function (w, h) {
    document.querySelector(".canvas" + this.num).width = w;
    document.querySelector(".canvas" + this.num).height = h;
  },
  giveCTX: function () {
    return this.area.ctx;
  },
  clear: function () {
    this.area.ctx.clearRect(0, 0, this.area.width, this.area.height);
  },
  destroy: function () {
    this.area = null;
  },
};
const collision = {
  distance: function (x1, x2) {
    const xDis = x1.x - x2.x;
    const yDis = x1.y - x2.y;
    return Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
  },
  collisionCheck: function (a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  },
};
const draw = {
  rect: function (ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  },
  tetragon: function (ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },
  image: function (ctx, source, x, y, w, h) {
    let img = new Image();
    img.src = source;
    ctx.drawImage(img, x, y, w, h);
  },
  text: function (ctx, content, font, x, y, size, lenght, color) {
    ctx.font = size + "px " + font;
    color ? (ctx.fillStyle = color) : (ctx.fillStyle = "yellow");
    ctx.fillText(content, x, y, lenght);
  },
  triangle: function (ctx, color, x1, y1, x2, y2, moveX, moveY) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(moveX, moveY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.fill();
  },
  UI: function (
    ctx,
    x1,
    y1,
    w1,
    h1,
    color1,
    content,
    font,
    x2,
    y2,
    size,
    lenght,
    color2
  ) {
    this.rect(ctx, x1, y1, w1, h1, color1);
    font == ""
      ? (font = "Georgia")
      : this.text(ctx, content, font, x1 + x2, y1 + y2, size, lenght, color2);
  },
};
let keyboard = {
    w: 87,
    s: 83,
    a: 65,
    d: 68,
    up: 38,
    right: 39,
    left: 37,
    down: 40,
    space: 32,
    enter: 13,
  },
  mouse = { x: 0, y: 0, clicked: false },
  rightPressed = false,
  leftPressed = false,
  upPressed = false,
  downPressed = false,
  spacePressed = false,
  heroReady = false,
  arrowRight = false,
  arrowLeft = false,
  arrowUp = false,
  escapePressed = false;
(arrowDown = false), (enterPressed = false);
checked = false;
window.addEventListener("keydown", (e) => {
  let keyPressed = e.keyCode;
  if (keyPressed === keyboard.w) {
    upPressed = true;
  } else if (keyPressed == keyboard.s) {
    downPressed = true;
  }
  if (keyPressed == keyboard.a) {
    leftPressed = true;
  } else if (keyPressed == keyboard.d) {
    rightPressed = true;
  }
  if (keyPressed == keyboard.space) {
    spacePressed = true;
  }
  if (keyPressed === keyboard.up) {
    arrowUp = true;
  } else if (keyPressed == keyboard.down) {
    arrowDown = true;
  }
  if (keyPressed == keyboard.left) {
    arrowLeft = true;
  } else if (keyPressed == keyboard.right) {
    arrowRight = true;
  }
  if (keyPressed == keyboard.enter) {
    enterPressed = true;
  }
  if (keyPressed == 27) {
    escapePressed = true;
  }
  if (keyPressed == 105 || enterPressed)
    showFPS ? (showFPS = false) : (showFPS = true);
});
window.addEventListener("keyup", (e) => {
  let keyPressed = e.keyCode;
  if (keyPressed === keyboard.w) {
    upPressed = false;
  } else if (keyPressed == keyboard.s) {
    downPressed = false;
  }
  if (keyPressed == keyboard.a) {
    leftPressed = false;
  } else if (keyPressed == keyboard.d) {
    rightPressed = false;
  }
  if (keyPressed == keyboard.space) {
    spacePressed = false;
  }
  if (keyPressed === keyboard.up) {
    arrowUp = false;
  } else if (keyPressed == keyboard.down) {
    arrowDown = false;
  }
  if (keyPressed == keyboard.left) {
    arrowLeft = false;
  } else if (keyPressed == keyboard.right) {
    arrowRight = false;
  }
  if (keyPressed == keyboard.enter) {
    enterPressed = false;
  }
});
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("mousedown", (e) => {
  mouse.clicked = true;
});
window.addEventListener("mouseup", (e) => {
  mouse.clicked = false;
});
const camera = {
  preRender(source, screenW, screenH) {
    Area.giveCTX().save();
    Area.giveCTX().translate(screenW / 2 - source.x, screenH / 2 - source.y);
  },
  postRender() {
    Area.giveCTX().restore();
  },
};
const sfx = {
  sound: "",
  create: function (source) {
    this.sound = new Audio(source);
  },
  play: function () {
    this.sound.play();
  },
  stop: function () {
    this.sound.stop();
  },
  loop: function () {
    this.sound.loop = true;
  },
  stopLoop: function () {
    this.sound.loop = false;
  },
};
const Vector = function (x, y) {
  this.x = x;
  this.y = y;
  this.distanceTO = function (xTo, yTo) {
    let diffX = this.x - xTo;
    let diffY = this.y - yTo;
    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  };
};
const casting = {
  intFromFloat: function (floatingNum) {
    return Math.floor(floatingNum);
  },
  floatFromString: function (string) {
    return parseFloat(string);
  },
  intFromString: function (string) {
    return parseInt(string);
  },
};

const Physics = {
  move: function (obj, dt) {
    obj.coords.x += obj.speed.x * dt;
    obj.coords.y += obj.speed.y * dt;
  },
};
const Mapper = function (raw) {
  let walls = [],
    floors = [],
    aids = [],
    enemies = [];
  let playerC = { x: 0, y: 0 };
  for (let y = 0; y < raw.length; y++) {
    let row = raw[y];
    for (let x = 0; x < raw.length; x++) {
      let letter = row[x];

      switch (letter) {
        case "#":
          walls.push({ x: x, y: y });
          break;
        case "P":
          playerC.x = x;
          playerC.y = y;
          floors.push({ x: x, y: y });
          break;
        case ";":
          floors.push({ x: x, y: y, clr: "orange" });
          break;
        case "E":
          floors.push({ x: x, y: y });
          enemies.push({ x: x, y: y });
          break;
        case ".":
          floors.push({ x: x, y: y });
          break;
        case "+":
          aids.push({ x: x, y: y });
          floors.push({ x: x, y: y });
          break;
      }
    }
  }
  let data = {
    WALLS: walls,
    FLOORS: floors,
    AIDS: aids,
    ENEMIES: enemies,
    PLAYER: playerC,
  };
  return data;
};
console.log("%cTwoD.js was made by Andrew Tuček (c) 2020", "color:yellow");
console.log(
  "Current library version is:%c" + TwoDVersion + "." + 0,
  "color:green"
);
