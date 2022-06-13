/*
 * * * * * * * * * * * * * * * * * * * * *
 *       Project:2DSpace shooter         *
 *       Creator:Andrew Tuček            *
 *       Date:25.7.2020                  *
 * * * * * * * * * * * * * * * * * * * * *
 */
const canvas = document.querySelector(".window");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
let player = {
    x: (canvas.width - 50) / 2,
    y: (canvas.height - 50) / 2,
    width: 50,
    height: 50,
    blank: heroImage,
  },
  enemies = [], //enemy array
  cubes = false, //defines if game is rendered fast or with IMGs
  stars = [], //background Stars
  shots = [], //players bullet count
  players = [],
  waves = 0,
  eneSPeed = 2;
  score = 0,
  guns = 10,
  gunCooldown = 0,
  gunCooldown1 = 0,
  gamestarted = false;
//--------------------------CONSTRUCTORS_FOR_GAME---------------------------
const Player = function (x, y, width, height, blank, id) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.id = id;
  this.blank = blank;
  this.active = true;
  this.engine = 5; //increasing number makes moving faster
  this.hp = 100;
  this.active = true;
  this.gun = guns; //increasing number makes shooting faster 5-20
  this.create = function () {
    if (cubes) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y-canvas.height/4-2.5, 50, 5);
      ctx.fillRect(this.x + this.width/2-2.5, this.y-canvas.height/4-25, 5, 50);
    } else {
      ctx.drawImage(this.blank, this.x, this.y, this.width, this.height);
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y-canvas.height/4-2.5, 50, 5);
      ctx.fillRect(this.x + this.width/2-2.5, this.y-canvas.height/4-25, 5, 50);
    }
  };
  this.playerGetHit = function () {
    this.hp -= 25;
    if (this.hp <= 0) {
      this.active = false;
    }
    //search shape by ID then cutting its width
  };
  this.shoot = function (id) {
    if (id == 1) {
      if (gunCooldown === 0) {
        shots.push(new Bullet(this.x + this.width / 2, this.y - 20));
        gunCooldown = 100;
      }
    } else {
      if (gunCooldown1 === 0) {
        shots.push(new Bullet(this.x + this.width / 2, this.y - 20));
        gunCooldown1 = 100;
      }
    }
  };
  this.movementCheck = function (id) {
    if (id == 1) {
      if (rightPressed) {
        this.x += this.engine;
        heroImage.src = "./css/playerStrafeRight.png";
      } else if (leftPressed) {
        this.x -= this.engine;
        heroImage.src = "./css/playerStrafeLeft.png";
      }
      if (downPressed) {
        this.y += this.engine;
      } else if (upPressed) {
        this.y -= this.engine;
        stars.forEach((star) => {});
        heroImage.src = "./css/playerUp.png";
      }
      if (spacePressed) {
        players.forEach((player) => {
          if (player.id == 1) {
            player.shoot(players.id);
          }
        });
      }
    } else if (id == 2) {
      if (arrowRight) {
        this.x += this.engine;
      } else if (arrowLeft) {
        this.x -= this.engine;
      }
      if (arrowDown) {
        this.y += this.engine;
      } else if (arrowUp) {
        this.y -= this.engine;
        stars.forEach((star) => {});
      }
      if (enterPressed) {
        players.forEach((player) => {
          if (player.id == 2) {
            player.shoot(player.id);
          }
        });
      }
    }
  };
};
Player.prototype.collider = function () {
  if (this.x < 0) {
    //this.x += 10;
    this.x = canvas.width;
  } else if (this.x - 50 > canvas.width) {
    //this.x -= 10;
    this.x = 0;
  } else if (this.y < 0) {
    //this.y += 10;
    this.y = canvas.height;
  } else if (this.y - 50 > canvas.height) {
    //this.y -= 10;
    this.y = 0;
  }
};

const Enemy = function (x, y, width, height, blank) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.chance = Math.random() * 6;
  this.blank = blank;
  this.speedY = Math.random() * 2;
  this.color = "red";
  this.speedX = 0;
  this.active = true;
  this.hp = 100;
  this.GetHit = function () {
    this.hp -= 25;
    this.width -= 5;
    this.height -= 5;
    if (this.hp <= 0) {
      this.active = false;
      players.forEach((player)=>{
        player.hp += 25;
        document.querySelector(".message").style.visibility = "visible";
        setTimeout(()=>{
          document.querySelector(".message").style.visibility = "hidden";  
        },1500);
      })
    }
  };
  this.create = function () {
    if (cubes) {
      if (this.chance >= 5.8) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width * 2, this.height * 2);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    } else {
      if (this.chance >= 5.8 && !cubes) {
        ctx.drawImage(
          this.blank,
          this.x,
          this.y,
          this.width * 2,
          this.height * 2
        );
      } else {
        ctx.drawImage(this.blank, this.x, this.y, this.width, this.height);
      }
    }
  };
};
Enemy.prototype.borderPolice = function () {
  if (this.x < 0) {
    //this.x += 10;
    this.x = canvas.width;
  } else if (this.x - 50 > canvas.width) {
    //this.x -= 10;
    this.x = 0;
  }
};
Enemy.prototype.move = function () {
  players.forEach((player) => {
    /*
    if (Math.abs(player.y - this.y) < 200) {
      this.speedY = 1;
      if (player.x - this.x > 0) {
        this.speedX = 3;
      } else if (player.x - this.x < 0) {
        this.speedX = -3;
      } else {
        this.speedX = 0;
      }
    }
    this.y += this.speedY;
    this.x += this.speedX;*/
    
   let dirx = player.x - this.x,
   diry = player.y - this.y;
 //normalizing
 let hyp = Math.sqrt(dirx * dirx + diry * diry);
 if (hyp) {
   dirx = dirx / hyp;
   diry = diry / hyp;
 }
 this.x += dirx * eneSPeed;
 this.y += diry * eneSPeed;
  });
};
let enemyCount = 0;
for (let i = 0; i < enemyCount; i++) {
  enemies.push(
    new Enemy(
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height),
      50,
      50,
      enemyImage
    )
  );
}
const Stars = function () {
  this.numbers = [1, 1.5, 2.5, 3, 3.5];
  this.x = Math.floor(Math.random() * canvas.width);
  this.y = Math.floor(Math.random() * canvas.height) * -2;
  this.active = true;
  this.size = Math.floor(Math.random() * 10);
  this.starVelocity = this.numbers[
    Math.floor(Math.random() * this.numbers.length)
  ];
  this.create = function () {
    ctx.fillStyle = "#ffff66";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  };
  this.updateStars = function () {
    this.y += this.starVelocity;
  };
};
let starSpeed = Math.floor(Math.random() * 3);
const Bullet = function (x, y) {
  this.width = 5;
  this.height = 20;
  this.x = x;
  this.y = y;
  this.active = true;
  let colors = ["#FF331F", "#007FFF", "#FFC100", "#7CDF64", "#80DED9"];
  let ranColor = colors[Math.floor(Math.random() * colors.length)];
  this.create = function () {
    ctx.fillStyle = ranColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.update = function () {
    this.y -= 10;
  };
  this.borderPolice = function () {
    if (this.y < 0) {
      this.active = false;
    }
  };
};
const Camera = function () {
  this.x = 0;
  this.y = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  //after ctx.clearRect();
  this.preRender = function () {
    var targetX = -player.x + ctx.canvas.width / 2;
    var targetY = -player.y + ctx.canvas.height / 2;

    var vectorX = targetX - this.x;
    var vectorY = targetY - this.y;

    this.offsetX = this.x - targetX;
    this.offsetY = this.y - targetY;

    this.x += vectorX / 10;
    this.y += vectorY / 10;

    ctx.save();
    ctx.translate(this.x, this.y);
  };
  //in the end of rendering
  this.postRender = function () {
    ctx.restore();
  };
};
//----------------------------------------------------------------------------
function collisionCheck(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
let distanceIn2d = function (x1, x2) {
  const xDis = x1.x - x2.x;
  const yDis = x1.y - x2.y;
  let result = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
  if(result < 5){
    return true;
  }else{
    return false;
  }
};
function collisionOccurs() {
  players.forEach((player) => {
    shots.forEach(function (bullet) {
      enemies.forEach(function (enemy) {
        if (collisionCheck(bullet, enemy)) {
          if (enemy.chance >= 5.8) {
            enemy.GetHit();
            bullet.active = false;
          } else {
            enemy.active = false;
            score += 10;
            bullet.active = false;
          }
        } else if (collisionCheck(bullet, player)) {
          bullet.active = false;
          player.playerGetHit();
        }
      });
    });
  });
  players.forEach((player) => {
    enemies.forEach(function (enemy) {
      if (collisionCheck(enemy, player)) {
        if (enemy.chance >= 5.8) {
          enemy.GetHit();
          player.hp -= 50;
          score += 10;
        } else {
          enemy.active = false;
          player.playerGetHit();
          score += 10;
        }
      }
    });
  });
}
//----------------------------------------------------------------------------

const reset = function () {
  enemies.forEach(function (enemy) {
    enemy.x = Math.floor(Math.random() * canvas.width) - 50;
    enemy.y = Math.floor(Math.random() * canvas.height) * -2;
    enemy.speedY += 1;
  });
  enemies.push(
    new Enemy(
      Math.floor(Math.random() * canvas.width) - 50,
      Math.floor(Math.random() * canvas.height) * -2,
      50,
      50,
      enemyImage
    )
  );
};
let id; // required for canceling game loop
const update = () => {
  if (Math.random() < 0.04) stars.push(new Stars());
  enemies = enemies.filter((enemy) => {
    return enemy.active;
  });
  stars = stars.filter((star) => {
    return star.active;
  });
  shots = shots.filter((shot) => {
    return shot.active;
  });
  players = players.filter((player) => {
    return player.active;
  });
  if (enemies.length <= 0) {
    enemyCount += 1;
    waves += 1;
    eneSPeed += 0.2;
    if (players.length == 0) {
      player.hp = -25;
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
      window.cancelAnimationFrame(id);
      localStorage.setItem("psave", true);
    } else {
      for (let i = 0; i < enemyCount; i++) {
        enemies.push(
          new Enemy(
            Math.floor(Math.random() * canvas.width) - 50,
            Math.floor(Math.random() * canvas.height) * -1.2,
            50,
            50,
            enemyImage
          )
        );
      }
    }
  }
  if (players.length == 0) {
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    window.cancelAnimationFrame(id);
    localStorage.setItem("psave", true);
  }
};


const render = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //cam.preRender();
  players.forEach((player)=>{
  stars.forEach((e) => {
    e.create();
    e.updateStars();
    if (e.y > canvas.height) {
      e.active = false;
    }
  });
  update();
  if (gamestarted) {
    if (gunCooldown > 0) {
      gunCooldown -= guns;
    }
    if (gunCooldown1 > 0) {
      gunCooldown1 -= guns;
    }
    collisionOccurs();
      player.create();
      player.collider();
      player.movementCheck(player.id);
      document.querySelector(".hotbar__frames").lastElementChild.innerHTML = player.hp;
    shots.forEach((e) => {
      e.create();
      e.update();
      e.borderPolice();
    });
    enemies.forEach((e) => {
      e.create();
      e.move();
      e.borderPolice();
      e.y += 1.5;
      if (e.y > canvas.height * 2) {
        reset();
        waves += 1;
      }
    });
    //cam.postRender();
    document.querySelector(".hotbar__waves").lastElementChild.innerHTML = waves;
    document.querySelector(".hotbar__score").lastElementChild.innerHTML = score;
  }
})
}


const Kanjo = function () {
  id = requestAnimationFrame(Kanjo);
  if(!escapePressed){
    render();
  }
};
let cam;
window.addEventListener("load", () => {
  localStorage.length == 0
    ? console.log("save is not present,introduction")
    : console.log("save is present,no introduction");
  players.push(
    new Player(player.x, player.y, player.width, player.height, player.blank, 1)
  );
cam = new Camera();
  Kanjo();
  gamestarted = false;
  enemyCount = 30;
});
