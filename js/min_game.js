let star_id,star__app=new RenderWindow(innerWidth,innerHeight,"#00000f",960),star__ctx=star__app.CTX();const star_star_creator=function(){this.x=jsMath.rand(0,star__app.w),this.y=0,this.w=jsMath.rand(10,20),this.h=this.w,this.speed=jsMath.rand(1.5,5),this.active=!0,this.render=function(){Draw.Rect(star__ctx,this.x,this.y,this.w,this.h,TwoD_color_palettes.wicked_skies.yellow,1)},this.update=function(){this.y+=this.speed,this.y>star__app.h&&(this.active=!1)}};let stars_stars=[];const star_update=function(){star__app.Clear(0,0,star__app.w,star__app.h,"#00000f"),Math.random()<.04&&stars_stars.push(new star_star_creator),stars_stars=stars_stars.filter((e=>e.active)),stars_stars.forEach((e=>{e.render(),e.update()})),star_id=requestAnimationFrame(star_update)},app=new RenderWindow(innerWidth,innerHeight,TwoD_color_palettes.wicked_skies.black,950),ctx=app.CTX();let id,paused,introduction,enCount,enSpeed,canvas_ready=!1,highScore=0;waves=0;let enemies=[],bullets=[],obstacles=[],stars=[];collectables=[];let timestamp=function(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()};const loopStuff={dt:0,now:0,last:timestamp(),step:1/60,fps:0},Player={x:innerWidth/2,y:innerHeight/2,w:50,h:50,color:"./include/skins/skinN01.png",hp:100,score:0,gunCld:0,gunCldSpeed:2.5,money:0,speed:250,hpRectW:innerWidth-40,holdInScreen:function(){this.x>app.w&&(this.x=0),this.x<0&&(this.x=app.w),this.y>app.h&&(this.y=0),this.y<0&&(this.y=app.h)},shoot:function(){this.gunCld<=0&&(bullets.push(new Bullet(this.x+this.w/2,this.y,"PLAYER",TwoD_color_palettes.wicked_skies.sky_blue)),this.gunCld=100)},getHit:function(){this.hp<=25?(window.cancelAnimationFrame(id),save(),reset()):(this.hpRectW-=innerWidth/4,this.hp-=25)},getHP:function(){this.hp<100&&this.hpRectW>10&&(this.hp+=25,this.hpRectW+=innerWidth/4)},keyHandler:function(){(upPressed||arrowUp)&&(this.y-=this.speed*loopStuff.dt),(downPressed||arrowDown)&&(this.y+=this.speed*loopStuff.dt),(leftPressed||arrowLeft)&&(this.x-=this.speed*loopStuff.dt),(rightPressed||arrowRight)&&(this.x+=this.speed*loopStuff.dt),spacePressed&&this.shoot()},update:function(){this.gunCld>0&&(this.gunCld-=this.gunCldSpeed),this.keyHandler(),this.holdInScreen()},render:function(){Draw.Rect(ctx,20,20,this.hpRectW,10,TwoD_color_palettes.wicked_skies.red),Draw.text(ctx,"score:"+this.score,"yoster",20,100,30,100,TwoD_color_palettes.wicked_skies.yellow),Draw.text(ctx,"waves:"+waves,"yoster",20,150,30,100,TwoD_color_palettes.wicked_skies.red),Draw.text(ctx,"best score:"+highScore,"yoster",20,200,30,500,TwoD_color_palettes.wicked_skies.orange),Draw.Rect(ctx,this.x-this.w/2,this.y-205,100,10,TwoD_color_palettes.wicked_skies.light_yellow),Draw.Rect(ctx,this.x+this.w/2-5,this.y-250,10,100,TwoD_color_palettes.wicked_skies.light_yellow),Draw.image(ctx,this.color,this.x,this.y,this.w,this.h)}};class Enemy{constructor(){this.x=Math.floor(Math.random()*innerWidth),this.y=0,this.w=50,this.type=jsMath.randChoice(["SMART","DUMB"]),this.speed=enSpeed,this.h=this.w,this.cld=0,this.color=jsMath.randChoice(["./include/gfx/enemy.png","./include/gfx/enemy0.png","./include/gfx/enemy1.png"]),this.active=!0,this.speedX=0,this.speedY=100}behavior(){if("SMART"==this.type){let e=Player.x-this.x,t=Player.y-this.y,s=Math.sqrt(e*e+t*t);s&&(e/=s,t/=s),this.x+=e*this.speed*loopStuff.dt,this.y+=t*this.speed*loopStuff.dt}else Math.abs(Player.y-this.y)<200&&(this.speedY=100,Player.x-this.x>0?this.speedX=250:Player.x-this.x<0?this.speedX=-250:this.speedX=0),this.y+=this.speedY*loopStuff.dt,this.x+=this.speedX*loopStuff.dt}render=function(){Draw.text(ctx,"Enemy","arcade",this.x,this.y-10,20,50,TwoD_color_palettes.wicked_skies.red_ish),Draw.image(ctx,this.color,this.x,this.y,this.w,this.h)};shoot=function(){this.cld<=0&&(bullets.push(new Bullet(this.x,this.y,"ENEMY",TwoD_color_palettes.wicked_skies.red_ish)),this.cld=100)};update=function(){Distance(Player,{x:this.x,y:this.y,w:this.w,h:this.h})<300&&waves>=10&&this.shoot(),this.cld>0&&(this.cld-=2.5),this.behavior(),(this.y>innerHeight||this.y<0||this.x>innerWidth||this.x<0)&&(this.active=!1)}}class Bullet{constructor(e,t,s,a){this.x=e,this.y=t,this.w=5,this.h=20,this.owner=s,this.color=a,this.fps=0,this.active=!0}render=function(){Draw.Rect(ctx,this.x,this.y,this.w,this.h,this.color)};update=function(){if((this.y<0||this.y>app.h)&&(this.active=!1),"PLAYER"==this.owner)this.y-=1e3*loopStuff.dt;else if("ENEMY"==this.owner&&waves>10&&waves<50)this.y+=800*loopStuff.dt;else if("ENEMY"==this.owner&&waves>50){this.fps++,this.fps>30&&(this.active=!1),this.h=10,this.w=10;let e=Player.x-this.x,t=Player.y-this.y,s=Math.sqrt(e*e+t*t);s&&(e/=s,t/=s),this.x+=600*e*loopStuff.dt,this.y+=600*t*loopStuff.dt}}}class Star{constructor(){this.color=TwoD_color_palettes.wicked_skies.yellow,this.x=jsMath.rand(0,app.w),this.y=0,this.chance=jsMath.rand(1,5),this.w=jsMath.rand(2,15),this.h=this.w,this.speed=jsMath.rand(50,150),this.active=!0,this.chance>=4.5&&(this.color="./include/gfx/asteroid.png")}render=function(){this.chance>=4.5?Draw.image(ctx,this.color,this.x,this.y,100,100):Draw.Rect(ctx,this.x,this.y,this.w,this.h,this.color)};update=function(){this.chance>=4.5&&(this.y+=1e3*loopStuff.dt),this.y>innerHeight&&(this.active=!1),this.y+=this.speed*loopStuff.dt}}class Collectable{constructor(){this.x=jsMath.rand(50,app.w-50),this.y=0,this.w=50,this.h=this.w,this.active=!1,this.chance=jsMath.rand(1,5),this.type=jsMath.randChoice(["HP","MONEY"]),this.color,"HP"==this.type?this.color="./include/gfx/aid.png":this.color="./include/gfx/money.png",this.chance>=4.8&&(this.active=!0)}render=function(){Draw.image(ctx,this.color,this.x,this.y,this.w,this.h)};update=function(){this.y>innerHeight&&(this.active=!1),this.y+=150*loopStuff.dt}}class Obstacle{constructor(e,t){this.x=e,this.y=t,this.w=100,this.h=50,this.opacity=1,this.active=!0,this.color=TwoD_color_palettes.wicked_skies.light_yellow}render=function(){Draw.Rect(ctx,this.x,this.y,this.w,this.h,this.color)}}const col=function(){enemies.forEach((e=>{Collision(Player,e)&&(e.active=!1,Player.getHit(),Player.score+=10,Player.money+=.5)})),bullets.forEach((e=>{Collision(e,Player)&&"ENEMY"==e.owner&&(e.active=!1,Player.getHit(),Player.score-=10),enemies.forEach((t=>{Collision(e,t)&&"PLAYER"==e.owner&&(t.active=!1,e.active=!1,Player.score+=10,Player.money+=.5),obstacles.forEach((t=>{Collision(e,t)&&(e.active=!1,t.active=!1)}))}))})),collectables.forEach((e=>{Collision(Player,e)&&("HP"==e.type?Player.getHP():Player.money+=1,e.active=!1)})),stars.forEach((e=>{e.chance>=4.5&&Distance(Player,e)<100&&(Player.getHit(),e.active=!1),enemies.forEach((t=>{e.chance>=4.5&&Collision(t,e)&&(e.active=!1,t.active=!1),obstacles.forEach((e=>{Collision(e,t)&&(t.speed=-t.speed-600*loopStuff.dt)}))}))}))},update=function(e){if(enemies.forEach((e=>{Collision(Player,e)&&(e.active=!1,Player.getHit(),Player.score+=10,Player.money+=.5)})),bullets.forEach((e=>{Collision(e,Player)&&"ENEMY"==e.owner&&(e.active=!1,Player.getHit(),Player.score-=10),enemies.forEach((t=>{Collision(e,t)&&"PLAYER"==e.owner&&(t.active=!1,e.active=!1,Player.score+=10,Player.money+=.5),obstacles.forEach((t=>{Collision(e,t)&&(e.active=!1,t.active=!1)}))}))})),collectables.forEach((e=>{Collision(Player,e)&&("HP"==e.type?Player.getHP():Player.money+=1,e.active=!1)})),stars.forEach((e=>{e.chance>=4.5&&Distance(Player,e)<100&&(Player.getHit(),e.active=!1),enemies.forEach((t=>{e.chance>=4.5&&Collision(t,e)&&(e.active=!1,t.active=!1),obstacles.forEach((e=>{Collision(e,t)&&(t.speed=-t.speed-600*loopStuff.dt)}))}))})),Math.random()<.04&&(stars.push(new Star),collectables.push(new Collectable)),stars=stars.filter((e=>e.active)),collectables=collectables.filter((e=>e.active)),bullets=bullets.filter((e=>e.active)),enemies=enemies.filter((e=>e.active)),obstacles=obstacles.filter((e=>e.active)),0==enemies.length){enCount+=1,enSpeed+=10,waves+=1;for(let e=0;e<enCount;e++)enemies.push(new Enemy)}stars.forEach((e=>{e.update()})),collectables.forEach((e=>{e.update()})),bullets.forEach((e=>{e.update()})),enemies.forEach((e=>{e.update()})),Player.update()},render=function(){app.Clear(0,0,innerWidth,innerHeight,TwoD_color_palettes.wicked_skies.black),stars.forEach((e=>{e.render()})),collectables.forEach((e=>{e.render()})),bullets.forEach((e=>{e.render()})),enemies.forEach((e=>{e.render()})),obstacles.forEach((e=>{e.render()})),Player.render()},loop=function(){paused=!!escapePressed,loopStuff.now=timestamp(),loopStuff.dt=Math.min(1,(loopStuff.now-loopStuff.last)/1e3),loopStuff.fps=1/loopStuff.dt,paused?DOM.show(DOM.get(".paused")):DOM.hide(DOM.get(".paused")),paused||update(),app.Clear(0,0,innerWidth,innerHeight,TwoD_color_palettes.wicked_skies.black),stars.forEach((e=>{e.render()})),collectables.forEach((e=>{e.render()})),bullets.forEach((e=>{e.render()})),enemies.forEach((e=>{e.render()})),obstacles.forEach((e=>{e.render()})),Player.render(),loopStuff.last=loopStuff.now,id=window.requestAnimationFrame(loop)},load=function(){localStorage.length<=0&&alert("No save,go play new game");let e=JSON.parse(localStorage.getItem("psave"));Player.speed=e[1],Player.money=e[0],Player.color=e[3],Player.gunCldSpeed=e[2],highScore=e[4],document.querySelector(".store__content__balance").innerHTML="Balance:"+Player.money},save=function(){let e=[];e.push(Player.money),e.push(Player.speed),e.push(Player.gunCldSpeed),e.push(Player.color),Player.score>highScore?e.push(Player.score):e.push(highScore),localStorage.setItem("psave",JSON.stringify(e))},init=function(e){window.cancelAnimationFrame(star_id),star__app.Destroy(),star__ctx=null,stars_stars=null,app.Create(),canvas_ready=!0,enCount=0,enSpeed=100,document.title="SpaceLads - space shooter","l"==e&&(localStorage.length<=0&&location.reload(),document.querySelector(".UI").style.display="none",obstacles.push(new Obstacle(app.w/5,app.h-app.h/3),new Obstacle(app.w/5*2,app.h-app.h/3),new Obstacle(app.w/5*3,app.h-app.h/3),new Obstacle(app.w/5*4,app.h-app.h/3),new Obstacle(app.w/5,app.h-app.h/3+50),new Obstacle(app.w/5*2,app.h-app.h/3+50),new Obstacle(app.w/5*3,app.h-app.h/3+50),new Obstacle(app.w/5*4,app.h-app.h/3+50)),load(),loop()),"n"==e&&(howTOPlay(),document.querySelector(".UI").style.display="none",localStorage.clear(),obstacles.push(new Obstacle(app.w/5,app.h-app.h/3),new Obstacle(app.w/5*2,app.h-app.h/3),new Obstacle(app.w/5*3,app.h-app.h/3),new Obstacle(app.w/5*4,app.h-app.h/3),new Obstacle(app.w/5,app.h-app.h/3+50),new Obstacle(app.w/5*2,app.h-app.h/3+50),new Obstacle(app.w/5*3,app.h-app.h/3+50),new Obstacle(app.w/5*4,app.h-app.h/3+50)),loop());for(let e=0;e<2;e++)enemies.push(new Enemy)},reset=function(){alert("Your score was:"+Player.score),alert("Waves survived:"+waves),location.reload()},store={buyGun:function(){load(),Player.money>=10&&Player.gunCldSpeed<20?(Player.gunCldSpeed+=2.5,Player.money-=10,save()):alert("no more money left or max level")},buyEngine:function(){load(),Player.money>=10&&Player.speed<1e3?(Player.speed+=50,Player.money-=10,save()):alert("no more money left or max level")},buySkin:function(e){load();let t=e-=1,s=document.getElementById(t).src;Player.money>=50?(Player.color=s,Player.money-=50,save()):alert("get some money first")}};let idNum=0;const giveID=function(){return idNum+=1,idNum},changeStoreContent=function(e){"skins"==e?(load(),document.querySelector(".store__content__headline").innerHTML="Skins",document.querySelector(".store__content__content").innerHTML=`\n\t\t\t<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN01.png" alt="skin for user">\n\t\t\t<img class="skin" id=${giveID()} onclick="store.buySkin(${giveID()})" src="include/skins/skinN02.png" alt="skin for user">\t\t\n\t\t\t`):"guns"==e&&(load(),document.querySelector(".store__content__headline").innerHTML="Upgrades",document.querySelector(".store__content__content").innerHTML='\n <button class="w" onclick="store.buyGun()">gun speed</button></br>\n <button class="w" onclick="store.buyEngine()">moving speed</button>\n ')};function howTOPlay(){document.querySelector(".HowToPlay").style.display="block"}window.addEventListener("click",(e=>{"UI__menu__links__link s"==e.target.className?document.querySelector(".store").style.transform="translatex(0%)":"store"==e.target.className&&(document.querySelector(".store").style.transform="translatex(150%)"),"credits"==e.target.className&&(document.querySelector(".credits").style.display="none"),"HowToPlay__content__red"==e.target.className&&(document.querySelector(".HowToPlay").style.display="none",active_tutorial=!1)})),window.addEventListener("load",(()=>{star__app.Create(),star_update(),localStorage.length<=0?introduction=!0:console.log("save present,no intro")})),window.addEventListener("resize",(()=>{canvas_ready&&app.Resize(innerWidth,innerHeight)}));
