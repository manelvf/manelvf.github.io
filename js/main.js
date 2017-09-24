
var n_of_balls = 5;

// return -1 or 1
function getRandomSign() {
  var v = Math.round(Math.random());
  if (v==0) 
    return -1;
  else 
    return 1;
}

function getRandomWithLimit(min,max) {
  do {
    // search for a nice value. If not found, try again
    var v = Math.round(Math.random() * (max-min)) + min;
  } while( (v>(max * App.borderLimit)) &&
    (v< (max - (max * App.borderLimit)))
  );

  return v;
}

function zeropad(v,n) {
  z = n-String(v).length;
  s = "";
  for (var c = 0; c < z; c++) {
    s += "0";
  }
  return s+v;
}



function Ball (ctx){
  this.ctx = ctx;
}

Ball.prototype.init = function() {
  this.dx = getRandomSign();
  this.dy = getRandomSign();
  this.x = getRandomWithLimit(0, App.availW);
  this.y = getRandomWithLimit(0, App.availH);
  this.radius = 50;
}

Ball.prototype.draw = function() {
  var ctx = App.ctx;
  ctx.fillStyle = "rgba(100, 255, 205, 0.5)";
  ctx.beginPath();
  ctx.arc(b.x, b.y, this.radius, 0, Math.PI*2,true);
  ctx.fill();
}

Ball.prototype.move = function() {
  this.x += this.dx;
  this.y += this.dy;

  if ((this.x + this.radius) > App.availW)
    this.dx = -1;
  else if ((this.x - this.radius) < 0) 
    this.dx = 1;

  if ((this.y + this.radius) > App.availH)
    this.dy = -1;
  else if ((this.y - this.radius) < 0) 
    this.dy = 1;

}


balls = [];


App = {
  keypressed : [],
  keyListeners : [], // functions to listen for keys pressed
  availW: 0,
  availH: 0,
  PERIOD: 1000/30, // millisenconds
  borderLimit:  0.25 // for new balls
}


function Hero() {
}

Hero.prototype.init = function() {
  this.points = 0;
  this.x = App.availW/2;
  this.y = App.availH/2;
  this.radius = 40;
  if (this.keyEvent)
    delete(App.keyListeners[this.keyEvent-1]);
  this.keyEvent = App.keyListeners.push(this.checkMovement());
}

Hero.prototype.draw = function() {
  var ctx = App.ctx;
  ctx.fillStyle = "rgba(255, 100, 100, 0.5)";
  ctx.fillRect((this.x) - 20, (this.y) - 20, 40,40);

  ctx.fillStyle = "rgba(255, 255, 100, 0.5)";
  ctx.beginPath();
  ctx.arc(this.x,this.y,12,0,Math.PI,false);   // Mouth (clockwise)
  ctx.moveTo(this.x-10,this.y-10);
  ctx.arc(this.x-10,this.y-10,5,0,Math.PI*2,true);  // Left eye
  ctx.moveTo(this.x+10,this.y-10);
  ctx.arc(this.x+10,this.y-10,5,0,Math.PI*2,true);  // Right eye
  ctx.stroke();
}

Hero.prototype.checkMovement = function() {
  var that = this;
  var p;

  return function() {

    if (App.keypressed[37]) {
      that.x--; 
      that.points++;
    }
    if (App.keypressed[39]) {
      that.x++; 
      that.points++;
    }
    if (App.keypressed[38]) {
      that.y--; 
      that.points++;
    }
    if (App.keypressed[40]) {
      that.y++; 
      that.points++;
    }
  }
}

var hero = new Hero();


function doMovements() {
  for(var k=0; k < App.keyListeners.length; k++) {
    if (typeof(App.keyListeners[k]) == "function")
      App.keyListeners[k]();
  }
}


function draw() {
    var ctx = App.ctx;

    ctx.clearRect(0,0,App.availW,App.availH); // clear canvas
    ctx.save();

    hero.draw();

    for (var k = 0; k<balls.length; k++) {
      b = balls[k];
      b.move();
      b.draw();
    }

    ctx.fillStyle = "rgba(100, 100, 255, 0.8)";
    ctx.fillText(zeropad(hero.points,8), App.availW * (2/3), 40);
    ctx.fillStyle = "rgba(100, 100, 255, 0.6)";
    ctx.fillText("Use the Arrow Keys to SURVIVE!",
        App.availW * (1/3),
        App.availH * (2/3));

    ctx.restore();

    window.requestAnimationFrame(draw);
}

function checkPositions(el1, el2) {
  var dx = el1.x - el2.x;
  var dy = el1.y - el2.y;
  
  var d = Math.sqrt((dx*dx) + (dy*dy));
  var r = el1.radius + el2.radius;

  if (r > d) 
    return true;
  else
    return false;
}

function checkMovements() {
  for(var k=0; k<balls.length; k++) {
    if (checkPositions(hero, balls[k]))
      hero.init();
    if (checkPositions(balls[k], balls[(k+1)%balls.length])) {
      balls[k].dx *= -1;
      balls[k].dy *= -1;
      balls[k].x += balls[k].dx*3;
      balls[k].y += balls[k].dy*3;
      var b = balls[(k+1)%balls.length];
      b.dx *= -1;
      b.dy *= -1;
      b.x += b.dx*2;
      b.y += b.dy*2;
    }
  }
}


function init() {
  if (document.body && document.body.offsetWidth) {
   winW = document.body.offsetWidth;
   winH = document.body.offsetHeight;
  }
  if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
  }
  if (window.innerWidth && window.innerHeight) {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }

  el = document.getElementById("screenFrame");
  el.style["background-color"] = "transparent";
  el.style["color"] = "red";
  el.style.left = "0px";
  el.style.top = "0px";
  el.style.width = winW+"px";
  el.style.height = winH+"px";
  el.style.display="block";

  frame = document.getElementById("frame");
  frame.width = winW;
  frame.height= winH;

  App.availW = winW;
  App.availH = winH;


  if (frame.getContext) {
    App.ctx = frame.getContext("2d");
    App.ctx.font = "20pt Arial";

    for (var k=0; k<n_of_balls; k++) {

      var b = new Ball(App.ctx);
      b.init();
      balls.push(b);
    }

    hero.init();

    window.onkeydown = function(e) {
      App.keypressed[e.which] = true;
    }
    window.onkeyup= function(e) {
      App.keypressed[e.which] = false;
    }
    // setInterval(function() { draw(ctx); }, 1000/30);
    window.requestAnimationFrame(draw);
    setInterval(checkMovements,1000/30);
    setInterval(doMovements,1000/30);
  } 

}

// init 
ready(function() {
  init();
});



function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


function toggleClass(el, className) {
if (el.classList) {
  el.classList.toggle(className);
} else {
  var classes = el.className.split(' ');
  var existingIndex = classes.indexOf(className);

  if (existingIndex >= 0)
    classes.splice(existingIndex, 1);
  else
    classes.push(className);

  el.className = classes.join(' ');
}
}

