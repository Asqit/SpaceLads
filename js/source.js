/*
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
#		      _____                      _               _       		#
#			/  ___|                    | |             | |      		#
#			\ `--. _ __   __ _  ___ ___| |     __ _  __| |___   		#
#			 `--. \ '_ \ / _` |/ __/ _ \ |    / _` |/ _` / __|  		#
#			/\__/ / |_) | (_| | (_|  __/ |___| (_| | (_| \__ \  		#
#			\____/| .__/ \__,_|\___\___\_____/\__,_|\__,_|___/  		#
#			      | |                                           		#
#			      |_|                                 					#          
#				by Andrew Tuček                  						#
#				*this game uses TwoD.js library  						#
#				*date of begining:19.12.2020     						#
*/
let id,
	paused,
	introduction,
	enCount,
	canvas_ready = false,
	enSpeed,
	bullSpeed = 20,
	laserColor = "red";
	highScore = 0;
	waves = 0;

let enemies = [],
	bullets = [],
	obstacles = [],
	stars = [];
collectables = [];

const Player = {
	x: innerWidth / 2,
	y: innerHeight / 2,
	w: 50,
	h: 50,
	color: './include/skins/skinN01.png',
	hp: 100,
	score: 0,
	gunCld: 0,
	gunCldSpeed: 2.5,
	money: 0,
	speed: 2.5,
	hpRectW: innerWidth - 40,
	holdInScreen: function() {
		if (this.x > innerWidth) this.x = 0;
		if (this.x < 0) this.x = innerWidth;
		if (this.y > innerHeight) this.y = 0;
		if (this.y < 0) this.y = innerHeight;
	},
	shoot: function() {
		if (this.gunCld <= 0) {
			bullets.push(new Bullet(this.x + this.w / 2, this.y));
			this.gunCld = 100;
		}
	},
	getHit: function() {
		if (this.hp <= 25) {
			window.cancelAnimationFrame(id);
			save();
			reset();
		} else {
			this.hpRectW -= innerWidth / 4;
			this.hp -= 25;
		}
	},
	getHP: function() {
		if (this.hp < 100 && this.hpRectW > 10) {
			this.hp += 25;
			this.hpRectW += innerWidth / 4;
		}
	},
	keyHandler: function() {
		if (upPressed || arrowUp) this.y -= this.speed;
		if (downPressed || arrowDown) this.y += this.speed;
		if (leftPressed || arrowLeft) this.x -= this.speed;
		if (rightPressed || arrowRight) this.x += this.speed;
		if (spacePressed) this.shoot();
	},
	update: function() {
		this.keyHandler();
		this.holdInScreen();
	},
	render: function() {
		//UI
		draw.rect(Area.giveCTX(), 20, 20, this.hpRectW, 10, 'red');
		draw.text(Area.giveCTX(), 'score:' + this.score, 'yoster', 20, 100, 30, 100, '#7bbacb');
		draw.text(Area.giveCTX(), 'waves:' + waves, 'yoster', 20, 150, 30, 100, '#a5de31');
		draw.text(Area.giveCTX(), 'best score:' + highScore, 'yoster', 20, 200, 30, 100, '#4085e0');
		

		//cross for aim
		draw.rect(Area.giveCTX(), this.x - this.w / 2, this.y - 205, 100, 10, 'gray');
		draw.rect(Area.giveCTX(), this.x + this.w / 2 - 5, this.y - 250, 10, 100, 'gray');
		
		//Player itself
		draw.image(Area.giveCTX(), this.color, this.x, this.y, this.w, this.h);
	}
};

const Enemy = function() {
	let skins = ['./include/gfx/enemy.png',"./include/gfx/enemy0.png","./include/gfx/enemy1.png"];
	this.x = Math.floor(Math.random() * innerWidth);
	this.y = 0;
	this.w = 50;
	this.speed = enSpeed;
	this.h = this.w;
	this.color = skins[Math.floor(Math.random() * skins.length)];
	this.active = true;
	this.render = function() {
		draw.text(Area.giveCTX(), 'Enemy', 'arcade', this.x, this.y - 10, 20, 50, 'red');
		draw.image(Area.giveCTX(), this.color, this.x, this.y, this.w, this.h);
	};
	this.update = function() {
		let dirx = Player.x - this.x,
			diry = Player.y - this.y;

		let hyp = Math.sqrt(dirx * dirx + diry * diry);
		if (hyp) {
			dirx = dirx / hyp;
			diry = diry / hyp;
		}
		this.x += dirx * this.speed;
		this.y += diry * this.speed;

		//pokud je pozice nepřítele níž než konec obrazovky tak zemře
		if (this.y > innerHeight || this.y < 0 || this.x > innerWidth || this.x < 0) this.active = false;
	};
};

const Bullet = function(x, y) {
	this.x = x;
	this.y = y;
	this.w = 5;
	this.h = 20;
	this.color = laserColor;
	this.active = true;
	this.render = function() {
		draw.rect(Area.giveCTX(), this.x, this.y, this.w, this.h, this.color);
	};
	this.update = function() {
		if (this.y < 0) this.active = false;

		this.y -= bullSpeed;
	};
};

const Star = function() {
	let color = '#f1db4f';
	let asteroid = './include/gfx/asteroid.png';
	this.x = Math.floor(Math.random() * innerWidth);
	this.y = 0;
	this.chance = Math.random() * 5;
	this.w = Math.floor(Math.random() * 10);
	this.h = this.w;
	this.speed = Math.floor(Math.random() * 5) + 1;
	this.active = true;

	this.render = function() {
		if (this.chance >= 4.5) {
			draw.image(Area.giveCTX(), asteroid, this.x, this.y, 100, 100);
		}else draw.rect(Area.giveCTX(), this.x, this.y, this.w, this.h, color);
	};
	this.update = function() {
		if (this.chance >= 4.5) {
			this.y += 10;
		}
		if (this.y > innerHeight) this.active = false;
		this.y += this.speed;
	};
};




const Collectable = function() {
	let types = [ 'HP', 'MONEY' ];
	this.x = Math.floor(Math.random() * innerWidth);
	this.y = 0;
	this.w = 50;
	this.h = this.w;
	this.active = false;
	this.chance = Math.random() * 5;
	this.type = types[Math.floor(Math.random() * types.length)];
	this.color;
	this.type == 'HP' ? (this.color = './include/gfx/aid.png') : (this.color = './include/gfx/money.png');
	if (this.chance >= 4.8) this.active = true;
	this.render = function() {
		draw.image(Area.giveCTX(), this.color, this.x, this.y, this.w, this.h);
	};
	this.update = function() {
		if (this.y > innerHeight) this.active = false;
		this.y += 5;
	};
};

const Obstacle = function(x, y) {
	this.x = x;
	this.y = y;
	this.w = 100;
	this.h = 50;
	this.active = true;
	this.color = '#05ffea';
	this.render = function() {
		draw.rect(Area.giveCTX(), this.x, this.y, this.w, this.h, this.color);
	};
};


const col = function() {
	//proccess collision
	enemies.forEach((enemy) => {
		if (collision.collisionCheck(Player, enemy)) {
			enemy.active = false;
			Player.getHit();
			Player.score += 10;
			Player.money += 0.5;
		}
	});
	bullets.forEach((bullet) => {
		enemies.forEach((enemy) => {
			if (collision.collisionCheck(bullet, enemy)) {
				enemy.active = false;
				bullet.active = false;
				Player.score += 10;
				Player.money += 0.5;
			}
			obstacles.forEach((ob) => {
				if (collision.collisionCheck(bullet, ob)) {
					bullet.active = false;
					ob.active = false;
				}
			});
		});
	});
	collectables.forEach((coll) => {
		if (collision.collisionCheck(Player, coll)) {
			if (coll.type == 'HP') Player.getHP();
			else Player.money += 1;
			coll.active = false;
		}
	});
	stars.forEach((star) => {
		if (star.chance >= 4.5 && collision.distance(Player,star) < 100) {
			Player.getHit();
			star.active = false;
		}
		enemies.forEach((enemy) => {
			if (star.chance >= 4.5 && collision.collisionCheck(enemy, star)) {
				star.active = false;
				enemy.active = false;
			}
			obstacles.forEach((ob) => {
				if (collision.collisionCheck(ob, enemy)) {
					enemy.speed = -5;
				}
			});
		});
	});
};

const update = function(dt) {
	//proccess the game without rendering
	col();
	if (Math.random() < 0.04) {
		stars.push(new Star());
		collectables.push(new Collectable());
	}
	stars = stars.filter((star) => {
		return star.active;
	});
	collectables = collectables.filter((coll) => {
		return coll.active;
	});
	bullets = bullets.filter((bullet) => {
		return bullet.active;
	});
	enemies = enemies.filter((enemy) => {
		return enemy.active;
	});

	obstacles = obstacles.filter((ob) => {
		return ob.active;
	});

	if (enemies.length == 0) {
		enCount += 1;
		enSpeed += 0.2;
		waves += 1;
		for (let i = 0; i < enCount; i++) {
			enemies.push(new Enemy());
		}
	}

	if (Player.gunCld > 0) {
		Player.gunCld -= Player.gunCldSpeed;
	}

	//--------------------------------------

	stars.forEach((star) => {
		star.update();
	});
	collectables.forEach((coll) => {
		coll.update();
	});

	bullets.forEach((bullet) => {
		bullet.update();
	});

	enemies.forEach((enemy) => {
		enemy.update();
	});

	Player.update();
};

const render = function() {
	Area.clear();

	stars.forEach((star) => {
		star.render();
	});
	collectables.forEach((coll) => {
		coll.render();
	});
	bullets.forEach((bullet) => {
		bullet.render();
	});
	enemies.forEach((enemy) => {
		enemy.render();
	});
	obstacles.forEach((ob) => {
		ob.render();
	});
	Player.render();


	//actives
	if (mouse.clicked) {
		draw.text(Area.giveCTX(), 'Developer look', 'yoster', innerWidth - 250, 100, 50, 200, 'pink'); //x y size len color
		draw.text(Area.giveCTX(), 'Active Stars:' + stars.length, 'yoster', innerWidth - 250, 150, 50, 200, 'gold'); //x y size len color
		draw.text(Area.giveCTX(), 'Active bullets:' + bullets.length, 'yoster', innerWidth - 250, 200, 50, 200, 'navy');
		draw.text(Area.giveCTX(), 'Active enemies' + enemies.length, 'yoster', innerWidth - 250, 250, 50, 200, 'green');
		draw.text(Area.giveCTX(), 'Players HP:' + Player.hp, 'yoster', innerWidth - 250, 300, 50, 200, 'red');
		draw.text(Area.giveCTX(), 'FPS:'+Math.floor(fps), 'yoster', innerWidth - 250, 350, 50, 200, 'red');
	
	}
};

function timestamp() {return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();}
let dt,now,last = timestamp(),step = 1 / 60,fps = 0;
const loop = function(){
    now = timestamp();
    dt = Math.min(1,(now - last)/1000);//seconds
    fps = 1 / dt;
    dt = dt - step;
    Math.floor(fps);
    update(dt);
    render(dt);
    last = now;
    id = window.requestAnimationFrame(loop);
};


const load = function() {
	if (localStorage.length <= 0) alert('No save,go play new game');
	let dataFromLcl = JSON.parse(localStorage.getItem('psave'));
	Player.speed = dataFromLcl[1];
	Player.money = dataFromLcl[0];
	Player.color = dataFromLcl[3];
	Player.gunCldSpeed = dataFromLcl[2];
	laserColor = dataFromLcl[4];
	bullSpeed = dataFromLcl[5];
	highScore = dataFromLcl[6];
	document.querySelector('.store__content__balance').innerHTML = 'Balance:' + Player.money;
};

const save = function() {
	let dataToLcl = [];
	dataToLcl.push(Player.money);
	dataToLcl.push(Player.speed);
	dataToLcl.push(Player.gunCldSpeed);
	dataToLcl.push(Player.color);
	dataToLcl.push(laserColor);
	dataToLcl.push(bullSpeed);


	if(Player.score > highScore)
	{
		dataToLcl.push(Player.score);
	}else dataToLcl.push(highScore);


	localStorage.setItem('psave', JSON.stringify(dataToLcl));
};
const init = function(type) {
	//init variables
	Area.create(innerWidth, innerHeight, 999, '#2e2f2a');
	canvas_ready = true;
	enCount = 0;
	enSpeed = 2;
	document.title = 'SpaceLads - space shooter';
	//init game
	if (type == 'l') {
		if(localStorage.length <= 0) location.reload();
		document.querySelector('.UI').style.display = 'none';
		obstacles.push(
			new Obstacle(400, innerHeight - innerHeight / 3),
			new Obstacle(400, innerHeight - innerHeight / 3 - 55),
			new Obstacle(805, innerHeight - innerHeight / 3),
			new Obstacle(805, innerHeight - innerHeight / 3 - 55),
			new Obstacle(1210, innerHeight - innerHeight / 3),
			new Obstacle(1210, innerHeight - innerHeight / 3 - 55)
		);
		load();
		loop();
	}
	if (type == 'n') {
		//introduction
		howTOPlay();
		document.querySelector('.UI').style.display = 'none';		
		localStorage.clear();
		obstacles.push(
			new Obstacle(400, innerHeight - innerHeight / 3),
			new Obstacle(400, innerHeight - innerHeight / 3 - 55),
			new Obstacle(805, innerHeight - innerHeight / 3),
			new Obstacle(805, innerHeight - innerHeight / 3 - 55),
			new Obstacle(1210, innerHeight - innerHeight / 3),
			new Obstacle(1210, innerHeight - innerHeight / 3 - 55)
		);
		loop();
	}

	for (let i = 0; i < 2; i++) {
		enemies.push(new Enemy());
	}
};

const reset = function() {
	alert('Your score was:' + Player.score);
	alert('Waves survived:' + waves);
	location.reload();
};

const store = {
	buyGun: function() {
		load();
		if (Player.money >= 10 && Player.gunCldSpeed < 20) {
			Player.gunCldSpeed += 2.5;
			Player.money -= 10;
			save();
		} else alert('no more money left or max level');
	},
	buyEngine: function() {
		load();
		if (Player.money >= 10 && Player.speed < 15 ) {
			Player.speed += 2.5;
			Player.money -= 10;
			save();
		} else alert('no more money left or max level');
	},
	buySkin: function(id) {
		load();
		let curentID = (id -= 1);
		let skinSRC = document.getElementById(curentID).src;
		if (Player.money >= 50) {
			Player.color = skinSRC;
			Player.money -= 50;
			save();
		} else alert('get some money first');
	},
};

let idNum = 0;
const giveID = function() {
	idNum += 1;
	return idNum;
};

const changeStoreContent = function(what) {
	if (what == 'skins') {
		load();
		document.querySelector('.store__content__headline').innerHTML = `Skins`;
		document.querySelector('.store__content__content').innerHTML = `
			<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN01.png" alt="skin for user">
			<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN02.png" alt="skin for user">
			<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN03.png" alt="skin for user">
			<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN04.png" alt="skin for user">
			
			`;
	} else if(what == "guns"){
		load();
		document.querySelector('.store__content__headline').innerHTML = `Upgrades`;
		document.querySelector('.store__content__content').innerHTML = `
        <button class="w" onclick="store.buyGun()">gun speed</button></br>
        <button class="w" onclick="store.buyEngine()">moving speed</button>
        `;
	}
};
function howTOPlay ()
{
	document.querySelector(".HowToPlay").style.display = "block";

}


window.addEventListener('click', (e) => {
	if (e.target.className == 'UI__menu__links__link s')
		document.querySelector('.store').style.transform = 'translatex(0%)';
	else if (e.target.className == 'store') document.querySelector('.store').style.transform = 'translatex(150%)';
	if(e.target.className == "credits") document.querySelector(".credits").style.display = "none";
	if(e.target.className == "HowToPlay__content__red") document.querySelector(".HowToPlay").style.display = "none",active_tutorial = false;

});

window.addEventListener('load', () => {
	localStorage.length <= 0 ? (introduction = true) : console.log('save present,no intro');
});

window.addEventListener('resize', () => {
	if(canvas_ready)
	{
		Area.resize(innerWidth, innerHeight);
	}
});


/*
#			 _____                      _               _       		#
#			/  ___|                    | |             | |      		#
#			\ `--. _ __   __ _  ___ ___| |     __ _  __| |___   		#
#			 `--. \ '_ \ / _` |/ __/ _ \ |    / _` |/ _` / __|  		#
#			/\__/ / |_) | (_| | (_|  __/ |___| (_| | (_| \__ \  		#
#			\____/| .__/ \__,_|\___\___\_____/\__,_|\__,_|___/  		#
#			      | |                                           		#
#			      |_|                                 					#          
#				by Andrew Tuček                  						#
#				*this game uses TwoD.js library  						#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
*/