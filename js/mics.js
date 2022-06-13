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
  arrowDown = false,
  enterPressed = false;
  checked = false;

let heroImage = new Image();
heroImage.onload = function () {
  // show the here image
  heroReady = true;
};
heroImage.src = "./css/playerStraight.png";
let heroImage1 = new Image();
heroImage1.onload = function () {
  // show the here image
  heroReady = true;
};
heroImage1.src = "./css/resources/hero.png";

let enemyReady = false;
let enemyImage = new Image();
enemyImage.onload = function () {
  enemyReady = true;
};
enemyImage.src = "./css/resources/enemy (1).png";
let isSet = false;
setInterval(() => {
  if(gamestarted){ 
   if(cubes){
     if (isSet) {
       enemies.forEach((enemy)=>{
         enemy.color = "green";
         enemy.width += 5;
         enemy.height += 5;
         
       })
       isSet = false;
     } else if (!isSet) {
       enemies.forEach((enemy)=>{
         enemy.color = "red";
         enemy.width -= 5;
         enemy.height -= 5;
       })
       isSet = true;
     }
   }else{
     if (isSet) {
       enemyImage.src = "./css/resources/enemy (2).png";
       isSet = false;
     } else if (!isSet) {
       enemyImage.src = "./css/resources/enemy (1).png";
       isSet = true;
     }
   }
 }
 }, 500);
window.addEventListener("click", (e) => {
  if (e.target.className == "menu__content__play") {
    document.querySelector(".menu").style.display = "none";
    if (localStorage.getItem("psave")) {
      document.querySelector(".hotbar").style.visibility = "visible";
      cubes = false;
      gamestarted = true;
    } else {
      document.querySelector(".text").style.webkitAnimationPlayState =
        "running";
      setTimeout(() => {
        document.querySelector(".hotbar").style.visibility = "visible";
        cubes = false;
        gamestarted = true;
      }, 30000);
    }
  } else if (e.target.className == "menu__content__play--cubes") {
    document.querySelector(".menu").style.display = "none";
    document.querySelector(".hotbar").style.visibility = "visible";
    cubes = true;
    gamestarted = true;
  } else if (e.target.className == "menu__content__play--two") {
    players.push(
      new Player(canvas.width / 3, canvas.height / 3, 50, 50, heroImage1, 2)
    );
    //-----
    document.querySelector(".menu").style.display = "none";
    if (localStorage.getItem("psave")) {
      document.querySelector(".hotbar").style.visibility = "visible";
      cubes = false;
      gamestarted = true;
    } else {
      document.querySelector(".text").style.webkitAnimationPlayState =
        "running";
      setTimeout(() => {
        document.querySelector(".hotbar").style.visibility = "visible";
        cubes = false;
        gamestarted = true;
      }, 30000);
    }
    //-------
  } else if (e.target.className == "menu__content__creator") {
    alert(
      "I created this Game and My name is Andrew Tuček contact me at ondrejtucek9@gmail.com"
    );
  }
});
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
  if(keyPressed == 27){
    if(gamestarted){
    if(checked){
      escapePressed = false;
      document.querySelector(".curtain").style.transform = "translateY(-100%)";
      checked = false;
    }else{
      escapePressed = true;
      document.querySelector(".curtain").style.transform = "translateY(0%)";
      checked = true;
    }
  }
  }
});
window.addEventListener("keyup", (e) => {
  heroImage.src = "./css/playerStraight.png";
  heroImage1.src = "./css/playerStraight.png";
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
