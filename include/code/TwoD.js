/***************************************************************************
 *              TwoD.js (1.3)                                              *
 *                                                                         *
 *   Project_:  canvas helpful functions for 2d(x,y)                       *
 *                                                                         * 
 *   Author_:   Andrew Tuček,+420 771 115 994         Y                    *
 *                                                    |                    *
 *   Date_:     22.2.2021                       ------|------X             *
 *                                                    |                    *
 *   License_:  MIT                                   |                    *
 *                                                                         *
 **************************************************************************/
//-----------BASE_TwoD.js_stuff---------------------------------------------
const version = 1.3;
let baseStyles = 
[
  "color: yellow",
  "background-color:green",
  "padding: 2px 4px",
  "border-radius: 5px",
  "border:1px dashed yellow",
  "padding:5px",
  "font-family:sans-serif",
  "font-weight:bold",
].join(";");
//==================================================
//                  CANVAS CLASS
//==================================================
class RenderWindow {
  constructor(w, h, style, zIndex)
   {
    this.w = w;
    this.h = h;
    this.style = style;
    this.zIndex = zIndex;
    this.active = false;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  Create() 
  {
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.background = this.style;
    this.canvas.style.zIndex = this.zIndex;
    this.canvas.innerHTML = "Your browser is not capable of HTML5, please upgrade for full experience,otherwise enjoy black screen ;)";
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.active = true;
  };
  Resize(w, h) 
  {
    this.canvas.width = w;
    this.canvas.height = h;
  };
  CTX() 
  {
    return this.ctx;
  };
  isOpen()
  {
    return this.active;
  };
  Destroy() 
  {
    this.canvas = null;
  };
  Clear(x, y, w, h, color)
  {
    this.ctx.clearRect(x, y, w, h);
    this.canvas.style.backgroundColor = color;
  };
}
//==================================================
//                  VECTOR CLASS
//==================================================
class Vector2i 
{
  constructor(x, y) 
  {
    this.x = Math.round(x);
    this.y = Math.round(y);
  }
}
class Vector2f
{
  constructor(x,y)
    {
      this.x = x;
      this.y = y;
    }
}
class Vector3i
{
  constructor(x,y,z)
  {
  this.x = Math.round(x);
  this.y = Math.round(y);
  this.z = Math.round(z);
  }
}
class Vector3f
{
  constructor(x,y,z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
//==================================================
//                  CAMERA CLASS
//==================================================
class Camera 
{
  constructor(ctx, w, h, source, scaleX, scaleY) 
  {
    this.ctx = ctx;
    this.screenW = w;
    this.screenH = h;
    this.sx = scaleX;
    this.sy = scaleY;
    this.source = source;
  }
  beforeRender() 
  {
    this.ctx.save();
    this.ctx.translate(
      this.screenW / this.sx - this.source.x,
      this.screenH / this.sy - this.source.y
    );
  };
  afterRender() 
  {
    this.ctx.restore();
  };
}
//==================================================
//                   COLORS
//==================================================
const TwoD_color_palettes = 
{
    wicked_skies:
    {
      colors:12,
      black:"#00000f",
      v_dark_blue:"#000133",
      dark_blue:"#000356",
      blue:"#0203e2",
      sky_blue:"#00cdfe",
      purple:"#680880",
      pink:"#fe007d",
      red:"#de1738",
      red_ish:"#fd5e53",
      orange:"#fc9c54",
      yellow:"#ffe373",
      light_yellow:"#fafbbd",
    },
    pico4:
    {
      colors:8,
      vv_dark_blue:"#180c21",
      gray:"#859999",
      d_gray:"#3a4a54",
      green:"#49ab3f",
      yellow:"#fff4b0",
      orange:"#ce6b40",
      d_purple:"#6f324e",
      pink_ish:"#e75e5e",
    },
    one_bit:
    {
      colors:2,
      gray:"#596e79",
      white:"#e4e8d1",
    },
    grey_mist:
    {
      colors:4,
      white:"#f1ffe0",
      l_brown:"#988171",
      brown:"#463534",
      blakc:"#1e1721",
    },
    kankei4:
    {
      colors:4,
      white:"#ffffff",
      red:"#f42e1f",
      blue:"#2f256b",
      black:"#060608",
    },
    dead_ice:
    {
      colors:4,
      white:"#f5fffa",
      l_blue:"#5792a5",
      gray:"#46393f",
      d_blue:"#161327",
    },
    jr16_composite:
    {
      colors:16,
      black:"#040404",
      blue:"#00015d",
      green:"#003808",
      d_blue:"#00374b",
      d_red:"#580a0a",
      purple:"#520a54",
      brown:"#7a3820",
      d_gray:"#4b4956",
      green_turquoise:"#81f4b1",
      turquoise:"#72ffff",
      l_gray:"#a2a2ac",
      fine_blue:"#4d84ff",
      l_red:"#d76f6c",
      pink:"#d887f0",
      yellow:"#f6f8ad",
      l_yellow:"#f5fffd"
    },
}
//==================================================
//                 MATH HELP
//==================================================
const jsMath = 
{
  size_of_vector:function(Vec)
  {
      let d = Math.pow(Vec.x,2)+Math.pow(Vec.y,2);
      return Math.sqrt(d);
  },
  //---------------------------------------------------------------------
  sum_vectors:function(vecA,vecB)
  {
    return {x:vecA.x+vecB.y,y:vecA.y+vecB.x};
  },
  //---------------------------------------------------------------------
  substract_vectors:function(vecA,vecB)
  {
    return {x:vecA.x-vecB.y,y:vecA.y-vecB.x};
  },
  //---------------------------------------------------------------------
  factorial: function (n) 
  {
    return n != 1 ? n * jsMath.fact(n - 1) : 1;
  },
  //---------------------------------------------------------------------
  pythagoras: function (a, b) 
  {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  },
  //---------------------------------------------------------------------
  probability: function (M, N) 
  {
    return M % N;
  },
  //---------------------------------------------------------------------
  rand: function (min, max) 
  {
    return min + Math.random() * (max - min);
  },
  //---------------------------------------------------------------------
  randInt: function (min, max) 
  {
    return Math.round(this.rand(min, max));
  },
  //---------------------------------------------------------------------
  limit: function (x, min, max) 
  {
    return Math.max(min, Math.min(max, x));
  },
  //---------------------------------------------------------------------
  between: function (n, min, max) 
  {
    return n >= min && n <= max;
  },
  //---------------------------------------------------------------------
  accelerate: function (v, accel, dt) 
  {
    return v + accel * dt;
  },
  //---------------------------------------------------------------------
  randChoice: function (choiceArray) 
  {
    return choiceArray[this.randInt(0, choiceArray.length - 1)];
  },
  //---------------------------------------------------------------------
  randBool: function () 
  {
    return this.randChoice([true, false]);
  },
  //---------------------------------------------------------------------
  min:function(data)
  {
    let smallest = data[0];
    for(let x = 0;x <= data.length;x++)
    {
        if(data[x] < smallest)
        {
          smallest = data[x]; 
        }
    }
    return smallest;
  },
  //---------------------------------------------------------------------
  max:function(data)
  {
    let smallest = data[0];
    for(let x = 0;x <= data.length;x++)
    {
        if(data[x] > smallest)
        {
          smallest = data[x]; 
        }
    }
    return smallest;
  },
  //---------------------------------------------------------------------
  avg:function(data)
  {
    let result = 0;
    for(let x = 0;x < data.length;x++)
    {
      result += data[x];
    }
    return result / data.length;
  },
};
//==================================================
//               DOCUMENT HELPERS
//==================================================
const DOM = 
{
  get: function (identifier) 
  {
    return document.querySelector(identifier);
  },
  setHTML: function (element, html) 
  {
    element.innerHTML = html;
  },
  addEvent: function (element, type, fn, capture) 
  {
    element.addEventListener(type, fn, capture);
  },
  rmEvnt: function (element, type, fn, capture) 
  {
    element.removeEventListener(type, fn, capture);
  },
  hide: function (element) 
  {
    element.style.display = "none";
  },
  show: function (element) 
  {
    element.style.display = "block";
  },
};
//==================================================
//            CTX DRAW HELPERS  
//==================================================
const Draw = 
{
  Rect: function (ctx, x, y, w, h, color, alpha) 
  {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
  },
  //---------------------------------------------------------------------
  //TETRA=shape of 4 side,angles...
  tetragon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color,alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  },
  //---------------------------------------------------------------------
  image: function (ctx, source, x, y, w, h, alpha) 
  {
    ctx.globalAlpha = alpha;
    let img = new Image();
    img.src = source;
    ctx.drawImage(img, x, y, w, h);
    ctx.globalAlpha = 1;
  },
  //---------------------------------------------------------------------
  text: function (ctx, content, font, x, y, size, length, color, alpha) 
  {
    ctx.globalAlpha = alpha;
    ctx.font = size + "px " + font;
    color ? (ctx.fillStyle = color) : (ctx.fillStyle = "yellow");
    ctx.fillText(content, x, y, length);
    ctx.globalAlpha = 1;
  },
  //---------------------------------------------------------------------
  triangle: function (ctx, color, x1, y1, x2, y2, moveX, moveY, alpha)
   {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(moveX, moveY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.fill();
    ctx.globalAlpha = 1;
  },
  //---------------------------------------------------------------------
  circle: function (ctx,x,y,sangle,eangle,r,alpha,stroke,clockwise,color) 
  {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, sangle, eangle, clockwise);
    stroke ? ctx.stroke() : ctx.fill();
    ctx.globalAlpha = 1;
  },
  //----------------------------------------------------------------------
  Text_box:function(ctx,x,y,w,h,color0,alpha0,content,font,size,length,color1,alpha1)
  {
      let centerX = x + (w/2 - length/4);
      let centerY = y + w/2 + size/2;
      Draw.Rect(ctx,x,y,w,h,color0,alpha0);
      Draw.text(ctx,content,font,centerX,centerY,size,length,color1,alpha1);
  },
};
//==================================================
//          COLLISION and DISTANCE vec1<-->vec2=150
//==================================================
const Collision = function (vecA, vecB) //AABB
{
  return (
    vecA.x < vecB.x + vecB.w &&
    vecA.x + vecA.w > vecB.x &&
    vecA.y < vecB.y + vecB.h &&
    vecA.y + vecA.h > vecB.y
  );
};
const Distance = function(x1,x2) //SAT
{
  const xDis = x1.x - x2.x;
  const yDis = x1.y - x2.y;
  return Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
};
//==================================================
//          TEXT MAP HANDLING |P|E|#|;|
//==================================================
const Mapper = function (raw) 
{
  let playerC = { x: 0, y: 0 };
  let walls = [];
  let floors = [];
  let aids = [];
  let enemies = [];

  for (let y = 0; y < raw.length; y++) 
  {
    let row = raw[y];
    for (let x = 0; x < raw.length; x++) 
    {
      let letter = row[x];
      switch (letter) 
      {
        case "#":walls.push({ x: x, y: y });break;
        case "P":playerC.x = x;playerC.y = y;floors.push({ x: x, y: y });break;
        case ";":floors.push({ x: x, y: y, clr: "orange" });break;
        case "E":floors.push({ x: x, y: y });enemies.push({ x: x, y: y });break;
        case ".":floors.push({ x: x, y: y });break;
        case "+":aids.push({ x: x, y: y });floors.push({ x: x, y: y });break;
      }
    }
  }
  let data = 
  {
    WALLS:walls,
    FLOORS:floors,
    AIDS:aids,
    ENEMIES:enemies,
    PLAYER:playerC,
  };
  return data;
};
//============================
// C++ styled I/O
//============================
const cout = function (what)
{
  console.log(what);
};
const cin = function (message) 
{
  return prompt(message);
};
//==================================================
//           KEYBOARD INPUT |W|S|A|D|
//==================================================
let keyboard = 
{
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
  arrowRight = false,
  arrowLeft = false,
  arrowUp = false,
  escapePressed = false,
  arrowDown = false,
  enterPressed = false;
window.addEventListener("keydown", (e) => {
  let keyPressed = e.keyCode;//kyCode is deprecated, istead it should have been used e.Key 
  if (keyPressed === keyboard.w){upPressed = true;} 
  else if (keyPressed == keyboard.s) {downPressed = true;}
  if (keyPressed == keyboard.a) {leftPressed = true;} 
  else if (keyPressed == keyboard.d) {rightPressed = true;}
  if (keyPressed == keyboard.space){spacePressed = true;}
  if (keyPressed === keyboard.up) {arrowUp = true;} 
  else if (keyPressed == keyboard.down) {arrowDown = true;}
  if (keyPressed == keyboard.left) {arrowLeft = true;} 
  else if (keyPressed == keyboard.right) {arrowRight = true;}
  if (keyPressed == keyboard.enter) {enterPressed = true;}
  if (keyPressed == 27){escapePressed ? (escapePressed = false) : (escapePressed = true);}
});
window.addEventListener("keyup", (e) => {
  let keyPressed = e.keyCode;
  if (keyPressed === keyboard.w){upPressed = false;} 
  else if (keyPressed == keyboard.s) {downPressed = false;}
  if (keyPressed == keyboard.a) {leftPressed = false;} 
  else if (keyPressed == keyboard.d) {rightPressed = false;}
  if (keyPressed == keyboard.space){spacePressed = false;}
  if (keyPressed === keyboard.up) {arrowUp = false;} 
  else if (keyPressed == keyboard.down) {arrowDown = false;}
  if (keyPressed == keyboard.left) {arrowLeft = false;}
  else if (keyPressed == keyboard.right) {arrowRight = false;}
  if (keyPressed == keyboard.enter) {enterPressed = false;}
});
console.log("%cTwoD.js version is : " + version, baseStyles);
console.log("%cAndrew Tuček (c) 2021", baseStyles);
//colors were taken from : https://lospec.com/palette-list