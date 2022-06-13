# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
#			 _____                      _               _       		#
#			/  ___|                    | |             | |      		#
#			\ `--. _ __   __ _  ___ ___| |     __ _  __| |___   		#
#			 `--. \ '_ \ / _` |/ __/ _ \ |    / _` |/ _` / __|  		#
#			/\__/ / |_) | (_| | (_|  __/ |___| (_| | (_| \__ \  		#
#			\____/| .__/ \__,_|\___\___\_____/\__,_|\__,_|___/  		#
#			      | |                                           		#
#			      |_|                                 					#          
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 



úvod:
1)popis TwoD.js
2)popis kodu

cheat:
po spuštění hry!
F12>console>Player.money += častka co vás napadne;



1)POPIS TWOD.JS

TwoD je jednoduchá 2D knihovnička funkcí v javascriptu

obsahuje: 1)herní prostředí (canvas)
           2)detekci kolize
            3)kreslící funkce 
             4)manipulace s inputem
              5)vlastní herní cyklus s měřením FPS
               6)jednoduchá 2D "Top down" kamera
                7)audio

#https://github.com/Asqit/TwoD.js
# je to soukromé, není přístup ;D
#soubor je minifikovaný, ale né obfuskovaný


2)POPIS HRY

mezi řádky 
18-27 je deklarace proměných 
id = pro requestAnimFrame
paused boolean pro pauzu HRY


mezi řádky
29-89 je hráč "Player"
je to objekt s vlastními proměnými a metodami


mezi řádky
91-116 je nepřítel "Enemy" konstruktor

mezi řádky
119-133 je naboj "Bullet" konstruktor
jako parametr jsou souřadnice hráče

mezi řádky
135-151 je hvězda "Star" konstruktor

mezi řádky
154-173 je funkce pro detekci kolize

mezi řádky
176-218 je update funkce 
ta má za úkol propočíst všechno co se děje bez toho aniž by to vykresila

220-234
je funkce pro vykreslení 

236-246
je hlavní cyklus


249-255
je load funkce
ta načíta z localstorage

256-263
je save
ta ukládá do localstorage

	enemies.forEach((enemy) => {
		if (collision.collisionCheck(Player, enemy)) {
			enemy.active = false;
			Player.getHit();
			Player.score += 10;
			Player.money += 1;
		}
	});
	bullets.forEach((bullet) => {
		enemies.forEach((enemy) => {
			if (collision.collisionCheck(bullet, enemy)) {
				enemy.active = false;
				bullet.active = false;
				Player.score += 10;
				Player.money += 1;
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
		if (star.chance >= 4.5 && collision.collisionCheck(Player, star)) {
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