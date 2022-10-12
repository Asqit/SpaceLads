const version=1.3;let baseStyles=["color: yellow","background-color:green","padding: 2px 4px","border-radius: 5px","border:1px dashed yellow","padding:5px","font-family:sans-serif","font-weight:bold"].join(";");class RenderWindow{constructor(e,t,r,n){this.w=e,this.h=t,this.style=r,this.zIndex=n,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d")}Create(){this.canvas.width=this.w,this.canvas.height=this.h,this.canvas.style.background=this.style,this.canvas.style.zIndex=this.zIndex,this.canvas.innerHTML="Your browser is not capable of HTML5, please upgrade for full experience,otherwise enjoy black screen ;)",document.body.insertBefore(this.canvas,document.body.childNodes[0])}Resize(e,t){this.canvas.width=e,this.canvas.height=t}CTX(){return this.ctx}Destroy(){this.canvas=null}Clear(e,t,r,n,a){this.ctx.clearRect(e,t,r,n),this.canvas.style.backgroundColor=a}}class Vector2D{constructor(e,t,r,n){this.x=e,this.y=t,this.w=r,this.h=n}distanceTO(e,t){let r=this.x-e,n=this.y-t;return Math.sqrt(Math.pow(r,2)+Math.pow(n,2))}}class ViewPort{constructor(e,t,r,n,a,o){this.ctx=e,this.screenW=t,this.screenH=r,this.sx=a,this.sy=o,this.source=n}beforeRender(){this.ctx.save(),this.ctx.translate(this.screenW/this.sx-this.source.x,this.screenH/this.sy-this.source.y)}afterRender(){this.ctx.restore()}}const TwoD_color_palettes={wicked_skies:{black:"#00000f",v_dark_blue:"#000133",dark_blue:"#000356",blue:"#0203e2",sky_blue:"#00cdfe",purple:"#680880",pink:"#fe007d",red:"#de1738",red_ish:"#fd5e53",orange:"#fc9c54",yellow:"#ffe373",light_yellow:"#fafbbd"},pico4:{vv_dark_blue:"#180c21",gray:"#859999",d_gray:"#3a4a54",green:"#49ab3f",yellow:"#fff4b0",orange:"#ce6b40",d_purple:"#6f324e",pink_ish:"#e75e5e"},one_bit:{gray:"#596e79",white:"#e4e8d1"},grey_mist:{white:"#f1ffe0",l_brown:"#988171",brown:"#463534",blakc:"#1e1721"},kankei4:{white:"#ffffff",red:"#f42e1f",blue:"#2f256b",black:"#060608"},dead_ice:{white:"#f5fffa",l_blue:"#5792a5",gray:"#46393f",d_blue:"#161327"},jr16_composite:{black:"#040404",blue:"#00015d",green:"#003808",d_blue:"#00374b",d_red:"#580a0a",purple:"#520a54",brown:"#7a3820",d_gray:"#4b4956",green_turquoise:"#81f4b1",turquoise:"#72ffff",l_gray:"#a2a2ac",fine_blue:"#4d84ff",l_red:"#d76f6c",pink:"#d887f0",yellow:"#f6f8ad",l_yellow:"#f5fffd"}},jsMath={quad_equation:function(e,t,r){let n=Math.pow(t,2)-4*e*r;return{x1:-t+Math.sqrt(n)/2,x2:-t-Math.sqrt(n)/2}},cube_volume:function(e){return 6*Math.pow(e,2)},cube_surface:function(e){return Math.pow(e,3)},size_of_vector:function(e){let t=Math.pow(e.x,2)+Math.pow(e.y,2);return Math.sqrt(t)},sum_vectors:function(e,t){return{x:e.x+t.y,y:e.y+t.x}},substract_vectors:function(e,t){return{x:e.x-t.y,y:e.y-t.x}},factorial:function(e){return 1!=e?e*jsMath.fact(e-1):1},pythagoras:function(e,t){return Math.sqrt(Math.pow(e,2)+Math.pow(t,2))},probability:function(e,t){return e%t},rand:function(e,t){return e+Math.random()*(t-e)},randInt:function(e,t){return Math.round(this.rand(e,t))},limit:function(e,t,r){return Math.max(t,Math.min(r,e))},between:function(e,t,r){return e>=t&&e<=r},accelerate:function(e,t,r){return e+t*r},randChoice:function(e){return e[this.randInt(0,e.length-1)]},randBool:function(){return this.randChoice([!0,!1])},min:function(e){let t=e[0];for(let r=0;r<=e.length;r++)e[r]<t&&(t=e[r]);return t},max:function(e){let t=e[0];for(let r=0;r<=e.length;r++)e[r]>t&&(t=e[r]);return t},avg:function(e){let t=0;for(let r=0;r<e.length;r++)t+=e[r];return t/e.length}},DOM={get:function(e){return document.querySelector(e)},setHTML:function(e,t){e.innerHTML=t},addEvent:function(e,t,r,n){e.addEventListener(t,r,n)},rmEvnt:function(e,t,r,n){e.removeEventListener(t,r,n)},hide:function(e){e.style.display="none"},show:function(e){e.style.display="block"}},Draw={Rect:function(e,t,r,n,a,o,s){e.globalAlpha=s,e.fillStyle=o,e.fillRect(t,r,n,a),e.globalAlpha=1},tetragon:function(e,t,r,n,a,o,s,l,i,c,d){e.globalAlpha=d,e.fillStyle=c,e.beginPath(),e.moveTo(t,r),e.lineTo(n,a),e.lineTo(o,s),e.lineTo(l,i),e.closePath(),e.fill(),e.globalAlpha=1},image:function(e,t,r,n,a,o,s){e.globalAlpha=s;let l=new Image;l.src=t,e.drawImage(l,r,n,a,o),e.globalAlpha=1},text:function(e,t,r,n,a,o,s,l,i){e.globalAlpha=i,e.font=o+"px "+r,e.fillStyle=l||"yellow",e.fillText(t,n,a,s),e.globalAlpha=1},triangle:function(e,t,r,n,a,o,s,l,i){e.globalAlpha=i,e.fillStyle=t,e.beginPath(),e.moveTo(s,l),e.lineTo(r,n),e.lineTo(a,o),e.fill(),e.globalAlpha=1},circle:function(e,t,r,n,a,o,s,l,i,c){e.globalAlpha=s,e.fillStyle=c,e.beginPath(),e.arc(t,r,o,n,a,i),l?e.stroke():e.fill(),e.globalAlpha=1},Text_box:function(e,t,r,n,a,o,s,l,i,c,d,h,u){let f=t+(n/2-d/4),y=r+n/2+c/2;Draw.Rect(e,t,r,n,a,o,s),Draw.text(e,l,i,f,y,c,d,h,u)}},Collision=function(e,t){return e.x<t.x+t.w&&e.x+e.w>t.x&&e.y<t.y+t.h&&e.y+e.h>t.y},Distance=function(e,t){const r=e.x-t.x,n=e.y-t.y;return Math.sqrt(Math.pow(r,2)+Math.pow(n,2))},Mapper=function(e){let t={x:0,y:0},r=[],n=[],a=[],o=[];for(let s=0;s<e.length;s++){let l=e[s];for(let i=0;i<e.length;i++){switch(l[i]){case"#":r.push({x:i,y:s});break;case"P":t.x=i,t.y=s,n.push({x:i,y:s});break;case";":n.push({x:i,y:s,clr:"orange"});break;case"E":n.push({x:i,y:s}),o.push({x:i,y:s});break;case".":n.push({x:i,y:s});break;case"+":a.push({x:i,y:s}),n.push({x:i,y:s})}}}return{WALLS:r,FLOORS:n,AIDS:a,ENEMIES:o,PLAYER:t}},cout=function(e){console.log(e)},cin=function(e){return prompt(e)};let keyboard={w:87,s:83,a:65,d:68,up:38,right:39,left:37,down:40,space:32,enter:13},mouse={x:0,y:0,clicked:!1},rightPressed=!1,leftPressed=!1,upPressed=!1,downPressed=!1,spacePressed=!1,arrowRight=!1,arrowLeft=!1,arrowUp=!1,escapePressed=!1,arrowDown=!1,enterPressed=!1;window.addEventListener("keydown",(e=>{let t=e.keyCode;t===keyboard.w?upPressed=!0:t==keyboard.s&&(downPressed=!0),t==keyboard.a?leftPressed=!0:t==keyboard.d&&(rightPressed=!0),t==keyboard.space&&(spacePressed=!0),t===keyboard.up?arrowUp=!0:t==keyboard.down&&(arrowDown=!0),t==keyboard.left?arrowLeft=!0:t==keyboard.right&&(arrowRight=!0),t==keyboard.enter&&(enterPressed=!0),27==t&&(escapePressed=!escapePressed)})),window.addEventListener("keyup",(e=>{let t=e.keyCode;t===keyboard.w?upPressed=!1:t==keyboard.s&&(downPressed=!1),t==keyboard.a?leftPressed=!1:t==keyboard.d&&(rightPressed=!1),t==keyboard.space&&(spacePressed=!1),t===keyboard.up?arrowUp=!1:t==keyboard.down&&(arrowDown=!1),t==keyboard.left?arrowLeft=!1:t==keyboard.right&&(arrowRight=!1),t==keyboard.enter&&(enterPressed=!1)})),console.log("%cTwoD.js version is : 1.3",baseStyles),console.log("%cAndrew Tuček (c) 2021",baseStyles);