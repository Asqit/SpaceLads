/******************************************
 * 
 * @Author :  Andrew Tuček,ondrej.tucek(at)educanet.cz
 * 
 * @Last_Change : 23.3.2021
 * 
 * @Project : SpaceLads(graduation work) 
 * 
 *****************************************/

 let star__app = new RenderWindow(innerWidth,innerHeight,"#00000f",960);
 let star__ctx = star__app.CTX();
 let star_id;
  const star_star_creator= function(){
    this.x=jsMath.rand(0,star__app.w);
    this.y=0;
    this.w=jsMath.rand(10,20);
    this.h=this.w;
    this.speed=jsMath.rand(1.5,5);
    this.active=true;
    this.render=function()
    {
      Draw.Rect(star__ctx,this.x,this.y,this.w,this.h,TwoD_color_palettes.wicked_skies.yellow,1);
    },
    this.update=function()
    {
      this.y += this.speed; 
      if(this.y > star__app.h) this.active = false;
    }
  }
  let stars_stars = [];

 const star_update = function()
 {
    star__app.Clear(0,0,star__app.w,star__app.h,"#00000f");
    if (Math.random() < 0.04) 
    {
      stars_stars.push(new star_star_creator());
    }
    stars_stars = stars_stars.filter(st =>{return st.active});
    stars_stars.forEach(st=>{st.render(),st.update();});
    star_id = requestAnimationFrame(star_update);
 }
 //-------MENU EFFECT END-----------------

const app = new RenderWindow(innerWidth,innerHeight,TwoD_color_palettes.wicked_skies.black,950);
const ctx = app.CTX();

let id,
    enCount,
    enSpeed,
    highScore = 0;
    waves = 0;

let enemies = [],
    bullets = [],
    obstacles = [],
    stars = [];
    collectables = [];

let timestamp = function () 
{
  return window.performance && window.performance.now
    ? window.performance.now()
    : new Date().getTime();
};

const loopStuff =
{
  dt: 0,
  now: 0,
  last: timestamp(),
  step: 1 / 60,
  fps: 0,
};
//------------------------------------------TŘÍDY----------------------------------------------------
const hero = {
  x: innerWidth / 2, //počáteční X pozice
  y: innerHeight / 2, //počáteční y pozice
  w: 50,//šířka kolizního čtverce
  h: 50,//výška kolizního čtverce
  color: "./include/skins/skinN01.png", //současný obrázek hřáče
  hp: 100,//životy
  score: 0,//skore
  gunCld: 0,//ochlazení zbraňe
  gunCldSpeed: 2.5, //rychlost střelby
  money: 0, //peníze
  speed: 250, //rychlost
  hpRectW: innerWidth - 40,//UI životy
  last_hit:6, //čas od poslední rány
  opacity:1,
  holdInScreen : function() 
  {
    //cílem funkce je udržet hráče v poli 
    if (this.x > app.w) this.x = 0; 
    if (this.x < 0) this.x = app.w; 
    if (this.y > app.h) this.y = 0; 
    if (this.y < 0) this.y = app.h; 
  },
  shoot: function() 
  {

    if (this.gunCld <= 0) 
    { 
      bullets.push(new Bullet(this.x + this.w / 2, this.y, "PLAYER", TwoD_color_palettes.wicked_skies.sky_blue));
      this.gunCld = 100;
    }

  },
  hit : function() 
  {

    if (this.hp < 25) 
    { //pokud je zdraví menší než 25 potom --> ulož hru,resetuj hru
      window.cancelAnimationFrame(id);
      save();
      reset();
    } 
    else
    {//jinak uber hráčovi životy a zobraz to na UI elementu
      this.hpRectW -= innerWidth / 4;
      this.hp -= 25;
    }
  },
  setHp : function() 
  { 
    //připočítávám hráčovi životy
    if (this.hp < 100 && this.hpRectW > 10)  
    {
      this.hp += 25;
      this.hpRectW += innerWidth / 4;
    }
  },
  keyHandler : function() 
  {
    //fyzika - lineární zrychlení
    // v = a * t
    //zrychlení = rychlost * čas
    if (upPressed || arrowUp) this.y -= this.speed * loopStuff.dt;
    if (downPressed || arrowDown) this.y += this.speed * loopStuff.dt;
    if (leftPressed || arrowLeft) this.x -= this.speed * loopStuff.dt;
    if (rightPressed || arrowRight) this.x += this.speed * loopStuff.dt;
    if (spacePressed) this.shoot(); // pokud je stisklé spacebar tlačítko potom --> vystřel
  },
  update:function() 
  {
    //ochlazení zbraně je vetší než 0 ? --> potom odečítej rychlostí ochlazení
    if (this.gunCld > 0) 
    {
      this.gunCld -= this.gunCldSpeed;
    }
    this.keyHandler();
    this.holdInScreen();
  },
  render : function() 
  {
    //UI prvky 
    Draw.Rect(ctx, 20, 20, this.hpRectW, 10, TwoD_color_palettes.wicked_skies.red); //HP čtverec
    Draw.text(ctx,"score:" + this.score,"yoster",20,100,30,100,TwoD_color_palettes.wicked_skies.yellow); //skore
    Draw.text(ctx,"waves:" + waves,"yoster",20,150,30,100,TwoD_color_palettes.wicked_skies.red);//waves
    Draw.text(ctx,"best score:" + highScore,"yoster",20,200,30,500,TwoD_color_palettes.wicked_skies.orange);//nejvyšší skore od poslední hry
    Draw.Rect(ctx,this.x - this.w / 2,this.y - 205,100,10,TwoD_color_palettes.wicked_skies.light_yellow); //míření
    Draw.Rect(ctx,this.x + this.w / 2 - 5,this.y - 250,10,100,TwoD_color_palettes.wicked_skies.light_yellow);//míření

    //hráčův obrázek
    Draw.image(ctx, this.color, this.x, this.y, this.w, this.h,this.opacity);//samotný hráč
  }
}
//--------------------------------------------------
//                  ENEMY/NEPŘÍTEL
//--------------------------------------------------
class Enemy 
{
  constructor() 
  {
    //pole stringů,uchovává udáje o URL obrázcích
    let skins = 
    [
      "./include/gfx/enemy.png",
      "./include/gfx/enemy0.png",
      "./include/gfx/enemy1.png",
    ];
    let type = ["SMART","DUMB"];  //typ, udává nepřitelovo chování
    this.x = Math.floor(Math.random() * innerWidth);
    this.y = 0;
    this.w = 50; //šířka
    this.type = jsMath.randChoice(type); //náhodný chování
    this.speed = enSpeed; //rychlost pohybu
    this.h = this.w;//výška = šířka
    this.cld = 0;//ochlazení střelby
    this.color = jsMath.randChoice(skins); //náhodný obrázek
    this.active = true;//je nepřítel živý/aktivní ?
    this.speedX = 0; //rychlost X 
    this.speedY = 100; //rychlost Y
  }
//  behavior - chování
//  
//  smart -> spočítá se rozdíl mezi hráčem a nepřítelem a poletí za ním
//  dumb/else -> pokud je hráč na vzdálenost y menší než 200px, potom zrychly
  behavior()
  {
    if(this.type == "SMART")
    {
      let dirx = hero.x - this.x;
      let diry = hero.y - this.y;
      let hyp = Math.sqrt(dirx * dirx + diry * diry);
        if (hyp) 
        {
          dirx = dirx / hyp;
          diry = diry / hyp;
        }
      this.x += dirx * this.speed * loopStuff.dt;
      this.y += diry * this.speed * loopStuff.dt;
    }
    else //----------------------------------DUMB-------------------------------------
    {
      if (Math.abs(hero.y - this.y) < 200) 
      {
        this.speedY = 100;
        if (hero.x - this.x > 0) 
        {
          this.speedX = 250;
        } 
        else if (hero.x - this.x < 0) 
        {
          this.speedX = -250;
        } 
        else 
        {
          this.speedX = 0;
        }
      }
      this.y += this.speedY * loopStuff.dt;
      this.x += this.speedX * loopStuff.dt;
    }
  }
  render = function () 
  {
    Draw.text(ctx,"Enemy","arcade",this.x,this.y - 10,20,50,TwoD_color_palettes.wicked_skies.red_ish); // jmenovka nad nepřítelem
    Draw.image(ctx, this.color, this.x, this.y, this.w, this.h); //nepřítel sám
  };
  shoot = function () 
  {
    if (this.cld <= 0) 
    { //stejně jako u hráče,střelba
      bullets.push(new Bullet(this.x, this.y, "ENEMY", TwoD_color_palettes.wicked_skies.red_ish));
      this.cld = 100;
    }
  };
  update = function () 
  {
    //pokud vzdálenost hráče a nepřítele je menší než 300px a vlna je větší než 10 potom střílej
      //vzdálenost = vzálenost dvou vektorů 
    if (Distance(hero, {x: this.x,y: this.y,w: this.w,h: this.h,}) < 300 &&waves >= 10)this.shoot();

    //stejný systém chlazení střelby jako u hráče
    if (this.cld > 0) {
      this.cld -= 2.5;
    }

    this.behavior(); //spouštění chování

    if (this.y > innerHeight || this.y < 0 || this.x > innerWidth || this.x < 0) //pokud je nepřítel mimo hrací pole -->zabí nepřítele
      this.active = false;
  };
}
//--------------------------------------------------
//                  BULLET/STŘELA
//--------------------------------------------------
class Bullet
{
  constructor(x, y, creator, clr) 
  {
    this.x = x; //x,y hodnoty jsou přiřazeny od parametrů konstruktoru
    this.y = y; 
    this.w = 5; //šířka
    this.h = 20; //výška
    this.owner = creator;//kdo střelu vytvořil
    this.color = clr;//barva
    this.fps = 0;//pole pro životnost 
    this.active = true;//živá ?
  }
  render = function () 
  {
    Draw.Rect(ctx, this.x, this.y, this.w, this.h, this.color); //vykreslení čtverce
  };
  update = function () 
  {
    if (this.y < 0 || this.y > app.h) this.active = false; //pokud je střela.y menší než 0 potom zabí
    if (this.owner == "PLAYER") this.y -= 1000 * loopStuff.dt; //pokud je vlastní hráč potom střela letí nahoru
    //pokud je vlastní nepřitel a počet vln je mezi 11 a 49 potom leť dolů
    else if(this.owner == "ENEMY" && waves >= 10 && waves<50) this.y += 800 * loopStuff.dt; 
    else if(this.owner == "ENEMY" && waves >= 50) //pokud je vlastník nepřitel a počet vln přesáhl 50, potom pronásleduj hráče
    { 
      this.fps++;//počítáváme "snímky"
      if(this.fps > 30) this.active = false; //pokud žije déle než 30snímku zabí
      this.h=10;
      this.w = 10;

      //pronásledování jako u nepřítele.behavior = "SMART"
      let dirx = Player.x - this.x;
      let diry = Player.y - this.y;
      let hyp = Math.sqrt(dirx * dirx + diry * diry);
      
      //thx god for stackoverlow <3
      if (hyp) 
      {
        dirx = dirx / hyp;
        diry = diry / hyp;
      }

      this.x += dirx * 600 * loopStuff.dt;
      this.y += diry * 600 * loopStuff.dt;
    }
  };
}
//--------------------------------------------------
//                  STAR/HVĚZDA
//--------------------------------------------------
class Star 
{
  constructor() 
  {
    this.color = TwoD_color_palettes.wicked_skies.yellow; //žlutá barva
    this.x = jsMath.rand(0,app.w); //náhodná pozice v rozsahu canvasu
    this.y = 0; 
    this.chance = jsMath.rand(1,5); //šance že to bude asteroid 
    this.w = jsMath.rand(2,15) //náhodná šířka
    this.h = this.w; //výška = šířka
    this.speed = jsMath.rand(50,150); //náhodná rychlost,efekt parallaxu 
    this.active = true; // je hvězda živá ?

    //pokud je šance větší než 4.5 potom změň obrázek
    if (this.chance >= 4.5) {
      this.color = "./include/gfx/asteroid.png";
    }
  }
  render = function () 
  {
    if (this.chance >= 4.5) 
    {
      Draw.image(ctx, this.color, this.x, this.y, 100, 100);//vykresly obrázek
    } 
    else Draw.Rect(ctx, this.x, this.y, this.w, this.h, this.color);  //šance menší než 4.5 vykresly čtverec
  };
  update = function () 
  {
    if (this.chance >= 4.5) 
    { //pokud je šance větší než 4.5 hvězda poletí rychlostí 1000 * čas od posledního zavolání loopu
      this.y += 1000 * loopStuff.dt;
    }
    if (this.y > innerHeight) this.active = false; //hvězda mimo hrací pole ? zabí 
    this.y += this.speed * loopStuff.dt;//rychlost pro obyčejnou hvězdu
  };
}
//--------------------------------------------------
//             COLLECTABLES/SBÍRATELNÉ
//--------------------------------------------------
class Collectable 
{
  constructor() 
  {
    let types = ["HP", "MONEY"]; //pole možností 
    this.x = jsMath.rand(50,app.w-50); //náhodná pozice X v hracím poly
    this.y = 0;
    this.w = 50;
    this.h = this.w;
    this.active = false; //živý ?
    this.chance = jsMath.rand(1,5);//šance 
    this.type = jsMath.randChoice(types); //náhodná možnost 
    this.color;
    //je typ hp --> ano nastav obrázek na aid.png : ne nastav na money.png;
    (this.type == "HP") ? (this.color = "./include/gfx/aid.png") : (this.color = "./include/gfx/money.png");
    if (this.chance >= 4.8) this.active = true; //pokud je šance pro život vetší než 4.8 žije, menší = ne žije 
  }
  render = function () 
  {
    Draw.image(ctx, this.color, this.x, this.y, this.w, this.h); //vykreslení 
  };
  update = function () 
  {
    //pokud je mimo pole -> zabí 
    if (this.y > innerHeight) this.active = false;
    this.y += 150 * loopStuff.dt;
  };
}
//--------------------------------------------------
//                  OBSTACLE/PŘEKÁŽKA
//--------------------------------------------------
class Obstacle 
{
  constructor(x, y) 
  {
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 50;
    this.opacity = 1;
    this.active = true;
    this.color = TwoD_color_palettes.wicked_skies.light_yellow;
  }
  render = function () 
  {
    Draw.Rect(ctx, this.x, this.y, this.w, this.h, this.color);
  };
}
//------------------------------------------------KOLIZE------------------------------------------------------
const col = function () 
{
  enemies.forEach((enemy) => {
    if (Collision(hero, enemy)) {
      enemy.active = false;
      hero.hit(loopStuff.dt);
      hero.score += 10;
      hero.money += 0.5;
    }
  });
  bullets.forEach((bullet) => {
    if (Collision(bullet, hero) && bullet.owner == "ENEMY") {
      bullet.active = false;
      hero.hit(loopStuff.dt);
      hero.score -= 10;
    }
    enemies.forEach((enemy) => {
      if (Collision(bullet, enemy) && bullet.owner == "PLAYER") {
        enemy.active = false;
        bullet.active = false;
        hero.score += 10;
        hero.money += 0.5;
      }
      obstacles.forEach((ob) => {
        if (Collision(bullet, ob)) {
          bullet.active = false;
          ob.active = false;
        }
      });
    });
  });
  collectables.forEach((coll) => {
    if (Collision(hero, coll)) {
      if (coll.type == "HP") hero.setHp();
      else hero.money += 1;
      coll.active = false;
    }
  });
  stars.forEach((star) => {
    if (star.chance >= 4.5 && Distance(hero, star) < 100) {
      hero.hit(loopStuff.dt);
      star.active = false;
    }
    enemies.forEach((enemy) => {
      if (star.chance >= 4.5 && Collision(enemy, star)) {
        star.active = false;
        enemy.active = false;
      }
      obstacles.forEach((ob) => {
        if (Collision(ob, enemy)) {
          enemy.speed = -1000;
          enemy.speedY = -1000;
          enemy.speedX = 0;
        }
      });
    });
  });
};
//--------------------------------------------------------------LOOP COMPONENTS-----------------------------------------------------
const update = function (dt) 
{
  col(); //hlídej kolizy 

  if (Math.random() < 0.04) //náhoda menší než .04 ? --> vytvoř nové instance pro hvězdu a sbíratelné
  {
    stars.push(new Star());
    collectables.push(new Collectable());
  }

  //filtrace živých a mrtvých 
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

//  pokud pole nepřátel je prázdné 
//  potom připočti enCount o 1, enSpeed o 10,waves o 1
//  for cyklus,který připočte nové instance do polí
  if (enemies.length == 0) 
  {
    enCount += 1;
    enSpeed += 10;
    waves += 1;
    for (let i = 0; i < enCount; i++) 
    {
      enemies.push(new Enemy());
    }
  }
  if(hero.hp < 25)
  {
    hero.hit();
  }

  //spouštění všech metod, nepřátel,nábojů,hráče...
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
  hero.update();
};
const render = function () 
{
  app.Clear(0,0,innerWidth,innerHeight,TwoD_color_palettes.wicked_skies.black); //vyčisti okno před novým kreslením

  //spouštění vykreslování 
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

  hero.render();

};

const loop = function () 
{

  //výpočet FPS a Delta času
  loopStuff.now = timestamp();
  loopStuff.dt = Math.min(1, (loopStuff.now - loopStuff.last) / 1000); //asSeconds
  loopStuff.fps = 1 / loopStuff.dt;

  //když je paused tak jsou výpočty hry zastaveny a zobrazen div .paused
  if(escapePressed)
  {
    DOM.show(DOM.get(".paused"));
  }
  else
  {
    DOM.hide(DOM.get(".paused"));
  }
  if(!escapePressed)update();
  
  
  render();//vykresly hru 

  loopStuff.last = loopStuff.now; //čas posledního cyklu

  id = window.requestAnimationFrame(loop); //rekurze pro loop
};
//--------------------------------------------------------------LOAD,SAVE && INIT-----------------------------------------------------
const load = function () 
{
  //  
  //1) kontrola pokud je localstorage bez savu
  //2) načítání proměných z localstorage
  //
  if (localStorage.length <= 0) alert("No save,go play new game");
  let dataFromLcl = JSON.parse(localStorage.getItem("psave"));
  hero.speed = dataFromLcl[1];
  hero.money = dataFromLcl[0];
  hero.color = dataFromLcl[3];
  hero.gunCldSpeed = dataFromLcl[2];
  highScore = dataFromLcl[4];
  document.querySelector(".store__content__balance").innerHTML =
    "Balance:" + hero.money;
};
const save = function () 
{
  //1)naházet věci do arraye
  //2)vhodit array do localstorage
  let dataToLcl = [];
  dataToLcl.push(hero.money);
  dataToLcl.push(hero.speed);
  dataToLcl.push(hero.gunCldSpeed);
  dataToLcl.push(hero.color);
  if (hero.score > highScore) 
  {
    dataToLcl.push(hero.score);
  } else dataToLcl.push(highScore);
  localStorage.setItem("psave", JSON.stringify(dataToLcl));
};
const init = function (type) 
{
  window.cancelAnimationFrame(star_id);//zruš rekurzi pro star__id
  delete star__app;//smaž instanci
  delete star__ctx;//smaž instanci
  delete stars_stars;//smaž instanci
  app.Create(); //vytvoř canvas
  enCount = 0; //počet nepřátel je 0
  enSpeed = 100; //rychlost nepřátel je 100 * delta
  document.title = "SpaceLads - space shooter"; //titulek dokumentu

  if (type == "l") 
  {
    //načítaní staré hry
    //1) kontrola savu
    //2) skrytí sekce ".UI"
    //3)nastavení pozic štítům
    //4)načtení hráčovo savu
    //5)spuštění hry 
    if (localStorage.length <= 0) location.reload();
    DOM.hide(DOM.get(".UI"));
    obstacles.push(
      new Obstacle(app.w / 5,app.h - app.h / 3),
      new Obstacle(app.w / 5 * 2,app.h - app.h / 3),
      new Obstacle(app.w / 5 * 3,app.h - app.h / 3),
      new Obstacle(app.w / 5 * 4,app.h - app.h / 3),
      new Obstacle(app.w / 5,app.h - app.h / 3  + 50),
      new Obstacle(app.w / 5 * 2,app.h - app.h / 3 + 50),
      new Obstacle(app.w / 5 * 3,app.h - app.h / 3 + 50),
      new Obstacle(app.w / 5 * 4,app.h - app.h / 3 + 50),

    );
    load();
    loop();
  }
  if (type == "n") 
  { //nová hra
    //1)jak hru hrát
    //2)shovat menu
    //3)vyčisti localstorage
    //4)naházet překážky
    howTOPlay();
    document.querySelector(".UI").style.display = "none";
    localStorage.clear();
    obstacles.push(
      new Obstacle(app.w / 5,app.h - app.h / 3),
      new Obstacle(app.w / 5 * 2,app.h - app.h / 3),
      new Obstacle(app.w / 5 * 3,app.h - app.h / 3),
      new Obstacle(app.w / 5 * 4,app.h - app.h / 3),
      new Obstacle(app.w / 5,app.h - app.h / 3  + 50),
      new Obstacle(app.w / 5 * 2,app.h - app.h / 3 + 50),
      new Obstacle(app.w / 5 * 3,app.h - app.h / 3 + 50),
      new Obstacle(app.w / 5 * 4,app.h - app.h / 3 + 50),
    );
    loop(); //spusť hru
    escapePressed = true;//dočasné pozastavení hry
  }
  for (let i = 0; i < 2; i++)//nový počet nepřátel je 2 
  {
    enemies.push(new Enemy());
  }
};
//--------------------------------------------------------------MISC_reset,store,changeStoreContent,giveID,howToPlay,event_listeners-----------------------------------------------------
//funkce pro resetování a presměrování zpět do menu
const reset = function () 
{
  alert("Your score was:" + hero.score);
  alert("Waves survived:" + waves);
  location.reload();
};
//obchod je objekt s anonimnímy funkcemi
const store = 
{
  buyGun: function () 
  {
    load();
    if (hero.money >= 10 && hero.gunCldSpeed < 20) 
    {
      hero.gunCldSpeed += 2.5;
      hero.money -= 10;
      save();
    } 
    else alert("no more money left or max level");
  },
  buyEngine: function () 
  {
    load();
    if (hero.money >= 10 && hero.speed < 1000) 
    {
      hero.speed += 50;
      hero.money -= 10;
      save();
    } 
    else alert("no more money left or max level");
  },
  buySkin: function (id) 
  {
    load();
    let curentID = (id -= 1);
    let skinSRC = document.getElementById(curentID).src;
    if (hero.money >= 50) 
    {
      hero.color = skinSRC;
      hero.money -= 50;
      save();
    } 
    else alert("get some money first");
  },
};
let idNum = 0;
const giveID = function () 
{
  idNum += 1;
  return idNum;
};
//měníme bonusy dle kliknutého výběru
const changeStoreContent = function (what) 
{
  if (what == "skins") //vybraný bonus = skins 
  {
    load();//načti peníze
    document.querySelector(".store__content__headline").innerHTML = `Skins`;//nastav bonusy
    document.querySelector(".store__content__content").innerHTML = `
			<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN01.png" alt="skin for user">
			<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN02.png" alt="skin for user">		
			`;
  } 
  else if (what == "guns") //pokud jinak
  {
    load();//načti peníze
    document.querySelector(".store__content__headline").innerHTML = `Upgrades`;//změn obsah
    document.querySelector(".store__content__content").innerHTML = `
        <button class="w" onclick="store.buyGun()">gun speed</button></br>
        <button class="w" onclick="store.buyEngine()">moving speed</button>
        `;
  }
};
function howTOPlay() 
{
  DOM.show(DOM.get(".HowToPlay")); //zobraz sekci(vezmi sekci("HowToPlay"))
}

//naslouč na kliknutí myši
window.addEventListener("click", (e) => {
  if (e.target.className == "UI__menu__links__link s")
    document.querySelector(".store").style.transform = "translatex(0%)";
  else if (e.target.className == "store")
    document.querySelector(".store").style.transform = "translatex(150%)";
  if (e.target.className == "credits")
    document.querySelector(".credits").style.display = "none";
  if (e.target.className == "HowToPlay__content__red")
    (document.querySelector(".HowToPlay").style.display = "none");
  if(e.target.className == "HowToPlay__content__red" && escapePressed)
  {
    (document.querySelector(".HowToPlay").style.display = "none");
    escapePressed=false;
  }
});
//spusť hvězdy v menu po načtení
window.addEventListener("load", () => {
  star__app.Create();
  star_update();
});

//pokud se změní velikost stránky, zmenši canvas
window.addEventListener("resize", () => {
  if (app.isOpen()) {
    app.Resize(innerWidth,innerHeight);
  }
});

/*
 _________________________________________
|         POTÍŽE a výčty                 |
|   1. blbý load stránky...opraveno      |
|   2. no finity state machine           |
|   3. herní engine by byl...            |
|   ...úžasnej                           |
|   4. překážky nemají responzivní pozice|
|   ....opraveno                         |
|_______         ________________________|
        |___  __|
            ||    ______
            \\ __|______|____ 
             \\ |*|-|*|---_
               |    __    |  
*/