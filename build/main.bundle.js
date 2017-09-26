"use strict";

var Data = {
  "about_me": "\n      <img style=\"float:left;padding: 0px 15px 15px 0px;\" src=\"images/eu.jpg\" widht=\"104\" height=\"105\" />\n      <p>Hi, I'm a professional software developer, interested in a wide range of topics: web development, e-commerce, graphics programming, automated testing, blockchain.... You can browse through my previous works in the other column.  \n      </p>\n\t<p>This webpage is itself a game. You can control the main character that appears in the middle of the screen using the cursor keys and it should avoid colliding with the big enemy balls. Most of the text is rendered using Javascript. \n      <p>\n      Some time ago I started to contribute and/or helped to initialize a few Open Source projects. Please don't hesitate on contact me in order to collaborate or ask any question about them. \n      </p>\n        <p>You can find me on:</p>\n        <ul class=\"square\">\n          <li><a href=\"http://twitter.com/galchwyn\">Twitter</a></li>\n          <li><a href=\"http://facebook.com/manel.villar\">Facebook</a></li>\n          <li><a href=\"http://http://es.linkedin.com/in/manelvillar\" >LinkedIn</a></li>\n          <li><a href=\"http://github.com/manelvf\">Github</a></li>\n\t  <li><a href=\"https://www.slideshare.net/manelvillar/\">Slideshare</a></li>\n          <li>Or simply by email: <a href=\"mailto:manelvf@gmail.com\" >manelvf@gmail.com</a></li>\n        </ul>\n\t",

  "links": "\n\t<p>You might be interested in checking my technical blog: <a href=\"https://manelvf.github.io/blog\">The Fallen Apples</a>.\n\t</p>\n\t<p>Some experiments:\n      <ul class=\"square\"> <li><a href=\"https://github.com/manelvf/Transboard\">Transboard</a>: Collaborative tool for application file translations. It's goal it's to provide a way to organize translation work when multiple translatores are collaborating on the same project. Currently <a href=\"http://transboard.manelvf.com\">in production</a>. [Ruby/Sinatra]</li>\n        <li><a href=\"https://github.com/manelvf/forestal2\">Forestal</a>: this application was developed as part of a timber delivery company chain of tools. It's main goal is goods tracking. [Python/Django] </li>\n\t\t\t</ul>\n\n      <p>My <a href=\"http://js1k.com\">JS1K</a> and JS demo entries:</p>\n      <ul class=\"square\">\n        <li><a href=\"http://js1k.com/2010-first/demos#id38\">Pulse</a>. A light \"pulsar\" made for the first compo (2010)</li>\n        <li><a href=\"http://js1k.com/2012-love/demo/1025\">Hidden Love</a>. Entry for 2012 compo, themed \"Love\"</li>\n        <li><a href=\"http://manelvf.com/drones\">Battle of the Drones</a>. Entry for <a href=\"http://ludumdare.com\">Ludum Dare 25</a></li>\n      </ul>\n\n        <ul class=\"square\">\n          <li><a href=\"http://https://vimeo.com/album/93295\" >Ilion Tools</a>: Some videos made from the tools developed on Ilion Animation Studios [ExtJS] (2007-2009).</li>\n        </ul>\n\n\t"
};
"use strict";

var n_of_balls = 5;

// return -1 or 1
function getRandomSign() {
  var v = Math.round(Math.random());
  if (v == 0) return -1;else return 1;
}

function getRandomWithLimit(min, max) {
  var v = void 0;

  do {
    // search for a nice value. If not found, try again
    v = Math.round(Math.random() * (max - min)) + min;
  } while (v > max * App.borderLimit && v < max - max * App.borderLimit);

  return v;
}

function zeropad(v, n) {
  var z = n - String(v).length;
  var s = "";
  for (var c = 0; c < z; c++) {
    s += "0";
  }
  return s + v;
}

function Ball(ctx) {
  this.ctx = ctx;
}

Ball.prototype.init = function () {
  this.dx = getRandomSign();
  this.dy = getRandomSign();
  this.x = getRandomWithLimit(0, App.availW);
  this.y = getRandomWithLimit(0, App.availH);
  this.radius = 50;
};

Ball.prototype.draw = function () {
  var ctx = App.ctx;
  ctx.fillStyle = "rgba(100, 255, 205, 0.5)";
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  ctx.fill();
};

Ball.prototype.move = function () {
  this.x += this.dx;
  this.y += this.dy;

  if (this.x + this.radius > App.availW) this.dx = -1;else if (this.x - this.radius < 0) this.dx = 1;

  if (this.y + this.radius > App.availH) this.dy = -1;else if (this.y - this.radius < 0) this.dy = 1;
};

var App = {
  balls: [],
  keypressed: [],
  keyListeners: [], // functions to listen for keys pressed
  availW: 0,
  availH: 0,
  PERIOD: 1000 / 30, // millisenconds
  borderLimit: 0.25 // for new balls
};

function Hero() {}

Hero.prototype.init = function () {
  this.points = 0;
  this.x = App.availW / 2;
  this.y = App.availH / 2;
  this.radius = 40;
  if (this.keyEvent) delete App.keyListeners[this.keyEvent - 1];
  this.keyEvent = App.keyListeners.push(this.checkMovement());
};

Hero.prototype.draw = function () {
  var ctx = App.ctx;
  ctx.fillStyle = "rgba(255, 100, 100, 0.5)";
  ctx.fillRect(this.x - 20, this.y - 20, 40, 40);

  ctx.fillStyle = "rgba(255, 255, 100, 0.5)";
  ctx.beginPath();
  ctx.arc(this.x, this.y, 12, 0, Math.PI, false); // Mouth (clockwise)
  ctx.moveTo(this.x - 10, this.y - 10);
  ctx.arc(this.x - 10, this.y - 10, 5, 0, Math.PI * 2, true); // Left eye
  ctx.moveTo(this.x + 10, this.y - 10);
  ctx.arc(this.x + 10, this.y - 10, 5, 0, Math.PI * 2, true); // Right eye
  ctx.stroke();
};

Hero.prototype.checkMovement = function () {
  var that = this;

  return function () {

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
  };
};

var hero = new Hero();

function doMovements() {
  for (var k = 0; k < App.keyListeners.length; k++) {
    if (typeof App.keyListeners[k] == "function") App.keyListeners[k]();
  }
}

function draw() {
  var ctx = App.ctx;
  var balls = App.balls;

  ctx.clearRect(0, 0, App.availW, App.availH); // clear canvas
  ctx.save();

  hero.draw();

  for (var k = 0; k < balls.length; k++) {
    var b = balls[k];
    b.move();
    b.draw();
  }

  ctx.fillStyle = "rgba(100, 100, 255, 0.8)";
  ctx.fillText(zeropad(hero.points, 8), App.availW * (2 / 3), 40);
  ctx.fillStyle = "rgba(100, 100, 255, 0.6)";
  ctx.fillText("Use the Arrow Keys to SURVIVE!", App.availW * (1 / 3), App.availH * (2 / 3));

  ctx.restore();

  window.requestAnimationFrame(draw);
}

function checkPositions(el1, el2) {
  var dx = el1.x - el2.x;
  var dy = el1.y - el2.y;

  var d = Math.sqrt(dx * dx + dy * dy);
  var r = el1.radius + el2.radius;

  if (r > d) return true;else return false;
}

function checkMovements() {
  var balls = App.balls;

  for (var k = 0; k < balls.length; k++) {
    if (checkPositions(hero, balls[k])) hero.init();
    if (checkPositions(balls[k], balls[(k + 1) % balls.length])) {
      balls[k].dx *= -1;
      balls[k].dy *= -1;
      balls[k].x += balls[k].dx * 3;
      balls[k].y += balls[k].dy * 3;
      var b = balls[(k + 1) % balls.length];
      b.dx *= -1;
      b.dy *= -1;
      b.x += b.dx * 2;
      b.y += b.dy * 2;
    }
  }
}

function init() {
  var winW = void 0,
      winH = void 0;

  if (document.body && document.body.offsetWidth) {
    winW = document.body.offsetWidth;
    winH = document.body.offsetHeight;
  }
  if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
  }
  if (window.innerWidth && window.innerHeight) {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }

  var el = document.getElementById("screenFrame");
  el.style["background-color"] = "transparent";
  el.style["color"] = "red";
  el.style.left = "0px";
  el.style.top = "0px";
  el.style.width = winW + "px";
  el.style.height = winH + "px";
  el.style.display = "block";

  var frame = document.getElementById("frame");
  frame.width = winW;
  frame.height = winH;

  App.availW = winW;
  App.availH = winH;

  if (frame.getContext) {
    App.ctx = frame.getContext("2d");
    App.ctx.font = "20pt Arial";

    for (var k = 0; k < n_of_balls; k++) {
      var b = new Ball(App.ctx);
      b.init();
      App.balls.push(b);
    }

    hero.init();

    window.onkeydown = function (e) {
      App.keypressed[e.which] = true;
    };
    window.onkeyup = function (e) {
      App.keypressed[e.which] = false;
    };
    // setInterval(function() { draw(ctx); }, 1000/30);
    window.requestAnimationFrame(draw);
    setInterval(checkMovements, 1000 / 30);
    setInterval(doMovements, 1000 / 30);
  }
}
"use strict";

// init 
ready(function () {
  expand_json();

  init();
});

function intitle(str) {
  return "<h3>" + (str.charAt(0).toUpperCase() + str.slice(1)).replace("_", " ") + "</h3>";
}

function expand_json() {
  for (var key in Data) {
    document.getElementById(key).innerHTML = intitle(key) + Data[key];
  }
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
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

    if (existingIndex >= 0) classes.splice(existingIndex, 1);else classes.push(className);

    el.className = classes.join(' ');
  }
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzL2RhdGEuanMiLCIuLi9qcy9nYW1lLmpzIiwiLi4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTztBQUNWLHc0Q0FEVTs7QUFvQlY7QUFwQlUsQ0FBWDs7O0FDQUEsSUFBSSxhQUFhLENBQWpCOztBQUVBO0FBQ0EsU0FBUyxhQUFULEdBQXlCO0FBQ3ZCLE1BQUksSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsRUFBWCxDQUFSO0FBQ0EsTUFBSSxLQUFHLENBQVAsRUFDRSxPQUFPLENBQUMsQ0FBUixDQURGLEtBR0UsT0FBTyxDQUFQO0FBQ0g7O0FBRUQsU0FBUyxrQkFBVCxDQUE0QixHQUE1QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxNQUFJLFVBQUo7O0FBRUEsS0FBRztBQUNEO0FBQ0EsUUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsTUFBaUIsTUFBSSxHQUFyQixDQUFYLElBQXdDLEdBQTVDO0FBQ0QsR0FIRCxRQUdVLElBQUssTUFBTSxJQUFJLFdBQWhCLElBQ04sSUFBSyxNQUFPLE1BQU0sSUFBSSxXQUp6Qjs7QUFPQSxTQUFPLENBQVA7QUFDRDs7QUFFRCxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsRUFBc0I7QUFDcEIsTUFBSSxJQUFJLElBQUksT0FBTyxDQUFQLEVBQVUsTUFBdEI7QUFDQSxNQUFJLElBQUksRUFBUjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUMxQixTQUFLLEdBQUw7QUFDRDtBQUNELFNBQU8sSUFBRSxDQUFUO0FBQ0Q7O0FBSUQsU0FBUyxJQUFULENBQWUsR0FBZixFQUFtQjtBQUNqQixPQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0Q7O0FBRUQsS0FBSyxTQUFMLENBQWUsSUFBZixHQUFzQixZQUFXO0FBQy9CLE9BQUssRUFBTCxHQUFVLGVBQVY7QUFDQSxPQUFLLEVBQUws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Q0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUdELFNBQVMsV0FBVCxDQUFxQixFQUFyQixFQUF5QixTQUF6QixFQUFvQztBQUNwQyxNQUFJLEdBQUcsU0FBUCxFQUFrQjtBQUNoQixPQUFHLFNBQUgsQ0FBYSxNQUFiLENBQW9CLFNBQXBCO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsUUFBSSxVQUFVLEdBQUcsU0FBSCxDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBZDtBQUNBLFFBQUksZ0JBQWdCLFFBQVEsT0FBUixDQUFnQixTQUFoQixDQUFwQjs7QUFFQSxRQUFJLGlCQUFpQixDQUFyQixFQUNFLFFBQVEsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBOUIsRUFERixLQUdFLFFBQVEsSUFBUixDQUFhLFNBQWI7O0FBRUYsT0FBRyxTQUFILEdBQWUsUUFBUSxJQUFSLENBQWEsR0FBYixDQUFmO0FBQ0Q7QUFDQSIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBEYXRhID0ge1xuXHRcImFib3V0X21lXCI6IGBcbiAgICAgIDxpbWcgc3R5bGU9XCJmbG9hdDpsZWZ0O3BhZGRpbmc6IDBweCAxNXB4IDE1cHggMHB4O1wiIHNyYz1cImltYWdlcy9ldS5qcGdcIiB3aWRodD1cIjEwNFwiIGhlaWdodD1cIjEwNVwiIC8+XG4gICAgICA8cD5IaSwgSSdtIGEgcHJvZmVzc2lvbmFsIHNvZnR3YXJlIGRldmVsb3BlciwgaW50ZXJlc3RlZCBpbiBhIHdpZGUgcmFuZ2Ugb2YgdG9waWNzOiB3ZWIgZGV2ZWxvcG1lbnQsIGUtY29tbWVyY2UsIGdyYXBoaWNzIHByb2dyYW1taW5nLCBhdXRvbWF0ZWQgdGVzdGluZywgYmxvY2tjaGFpbi4uLi4gWW91IGNhbiBicm93c2UgdGhyb3VnaCBteSBwcmV2aW91cyB3b3JrcyBpbiB0aGUgb3RoZXIgY29sdW1uLiAgXG4gICAgICA8L3A+XG5cdDxwPlRoaXMgd2VicGFnZSBpcyBpdHNlbGYgYSBnYW1lLiBZb3UgY2FuIGNvbnRyb2wgdGhlIG1haW4gY2hhcmFjdGVyIHRoYXQgYXBwZWFycyBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzY3JlZW4gdXNpbmcgdGhlIGN1cnNvciBrZXlzIGFuZCBpdCBzaG91bGQgYXZvaWQgY29sbGlkaW5nIHdpdGggdGhlIGJpZyBlbmVteSBiYWxscy4gTW9zdCBvZiB0aGUgdGV4dCBpcyByZW5kZXJlZCB1c2luZyBKYXZhc2NyaXB0LiBcbiAgICAgIDxwPlxuICAgICAgU29tZSB0aW1lIGFnbyBJIHN0YXJ0ZWQgdG8gY29udHJpYnV0ZSBhbmQvb3IgaGVscGVkIHRvIGluaXRpYWxpemUgYSBmZXcgT3BlbiBTb3VyY2UgcHJvamVjdHMuIFBsZWFzZSBkb24ndCBoZXNpdGF0ZSBvbiBjb250YWN0IG1lIGluIG9yZGVyIHRvIGNvbGxhYm9yYXRlIG9yIGFzayBhbnkgcXVlc3Rpb24gYWJvdXQgdGhlbS4gXG4gICAgICA8L3A+XG4gICAgICAgIDxwPllvdSBjYW4gZmluZCBtZSBvbjo8L3A+XG4gICAgICAgIDx1bCBjbGFzcz1cInNxdWFyZVwiPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3R3aXR0ZXIuY29tL2dhbGNod3luXCI+VHdpdHRlcjwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2ZhY2Vib29rLmNvbS9tYW5lbC52aWxsYXJcIj5GYWNlYm9vazwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2h0dHA6Ly9lcy5saW5rZWRpbi5jb20vaW4vbWFuZWx2aWxsYXJcIiA+TGlua2VkSW48L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9naXRodWIuY29tL21hbmVsdmZcIj5HaXRodWI8L2E+PC9saT5cblx0ICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vd3d3LnNsaWRlc2hhcmUubmV0L21hbmVsdmlsbGFyL1wiPlNsaWRlc2hhcmU8L2E+PC9saT5cbiAgICAgICAgICA8bGk+T3Igc2ltcGx5IGJ5IGVtYWlsOiA8YSBocmVmPVwibWFpbHRvOm1hbmVsdmZAZ21haWwuY29tXCIgPm1hbmVsdmZAZ21haWwuY29tPC9hPjwvbGk+XG4gICAgICAgIDwvdWw+XG5cdGAsXG5cblx0XCJsaW5rc1wiOiBgXG5cdDxwPllvdSBtaWdodCBiZSBpbnRlcmVzdGVkIGluIGNoZWNraW5nIG15IHRlY2huaWNhbCBibG9nOiA8YSBocmVmPVwiaHR0cHM6Ly9tYW5lbHZmLmdpdGh1Yi5pby9ibG9nXCI+VGhlIEZhbGxlbiBBcHBsZXM8L2E+LlxuXHQ8L3A+XG5cdDxwPlNvbWUgZXhwZXJpbWVudHM6XG4gICAgICA8dWwgY2xhc3M9XCJzcXVhcmVcIj4gPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFuZWx2Zi9UcmFuc2JvYXJkXCI+VHJhbnNib2FyZDwvYT46IENvbGxhYm9yYXRpdmUgdG9vbCBmb3IgYXBwbGljYXRpb24gZmlsZSB0cmFuc2xhdGlvbnMuIEl0J3MgZ29hbCBpdCdzIHRvIHByb3ZpZGUgYSB3YXkgdG8gb3JnYW5pemUgdHJhbnNsYXRpb24gd29yayB3aGVuIG11bHRpcGxlIHRyYW5zbGF0b3JlcyBhcmUgY29sbGFib3JhdGluZyBvbiB0aGUgc2FtZSBwcm9qZWN0LiBDdXJyZW50bHkgPGEgaHJlZj1cImh0dHA6Ly90cmFuc2JvYXJkLm1hbmVsdmYuY29tXCI+aW4gcHJvZHVjdGlvbjwvYT4uIFtSdWJ5L1NpbmF0cmFdPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFuZWx2Zi9mb3Jlc3RhbDJcIj5Gb3Jlc3RhbDwvYT46IHRoaXMgYXBwbGljYXRpb24gd2FzIGRldmVsb3BlZCBhcyBwYXJ0IG9mIGEgdGltYmVyIGRlbGl2ZXJ5IGNvbXBhbnkgY2hhaW4gb2YgdG9vbHMuIEl0J3MgbWFpbiBnb2FsIGlzIGdvb2RzIHRyYWNraW5nLiBbUHl0aG9uL0RqYW5nb10gPC9saT5cblx0XHRcdDwvdWw+XG5cbiAgICAgIDxwPk15IDxhIGhyZWY9XCJodHRwOi8vanMxay5jb21cIj5KUzFLPC9hPiBhbmQgSlMgZGVtbyBlbnRyaWVzOjwvcD5cbiAgICAgIDx1bCBjbGFzcz1cInNxdWFyZVwiPlxuICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9qczFrLmNvbS8yMDEwLWZpcnN0L2RlbW9zI2lkMzhcIj5QdWxzZTwvYT4uIEEgbGlnaHQgXCJwdWxzYXJcIiBtYWRlIGZvciB0aGUgZmlyc3QgY29tcG8gKDIwMTApPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vanMxay5jb20vMjAxMi1sb3ZlL2RlbW8vMTAyNVwiPkhpZGRlbiBMb3ZlPC9hPi4gRW50cnkgZm9yIDIwMTIgY29tcG8sIHRoZW1lZCBcIkxvdmVcIjwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL21hbmVsdmYuY29tL2Ryb25lc1wiPkJhdHRsZSBvZiB0aGUgRHJvbmVzPC9hPi4gRW50cnkgZm9yIDxhIGhyZWY9XCJodHRwOi8vbHVkdW1kYXJlLmNvbVwiPkx1ZHVtIERhcmUgMjU8L2E+PC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgICAgPHVsIGNsYXNzPVwic3F1YXJlXCI+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vaHR0cHM6Ly92aW1lby5jb20vYWxidW0vOTMyOTVcIiA+SWxpb24gVG9vbHM8L2E+OiBTb21lIHZpZGVvcyBtYWRlIGZyb20gdGhlIHRvb2xzIGRldmVsb3BlZCBvbiBJbGlvbiBBbmltYXRpb24gU3R1ZGlvcyBbRXh0SlNdICgyMDA3LTIwMDkpLjwvbGk+XG4gICAgICAgIDwvdWw+XG5cblx0YFxufVxuIiwidmFyIG5fb2ZfYmFsbHMgPSA1O1xuXG4vLyByZXR1cm4gLTEgb3IgMVxuZnVuY3Rpb24gZ2V0UmFuZG9tU2lnbigpIHtcbiAgbGV0IHYgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICBpZiAodj09MCkgXG4gICAgcmV0dXJuIC0xO1xuICBlbHNlIFxuICAgIHJldHVybiAxO1xufVxuXG5mdW5jdGlvbiBnZXRSYW5kb21XaXRoTGltaXQobWluLG1heCkge1xuICBsZXQgdjtcblxuICBkbyB7XG4gICAgLy8gc2VhcmNoIGZvciBhIG5pY2UgdmFsdWUuIElmIG5vdCBmb3VuZCwgdHJ5IGFnYWluXG4gICAgdiA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtYXgtbWluKSkgKyBtaW47XG4gIH0gd2hpbGUoICh2ID4gKG1heCAqIEFwcC5ib3JkZXJMaW1pdCkpICYmXG4gICAgKHYgPCAobWF4IC0gKG1heCAqIEFwcC5ib3JkZXJMaW1pdCkpKVxuICApO1xuXG4gIHJldHVybiB2O1xufVxuXG5mdW5jdGlvbiB6ZXJvcGFkKHYsbikge1xuICBsZXQgeiA9IG4gLSBTdHJpbmcodikubGVuZ3RoO1xuICBsZXQgcyA9IFwiXCI7XG4gIGZvciAobGV0IGMgPSAwOyBjIDwgejsgYysrKSB7XG4gICAgcyArPSBcIjBcIjtcbiAgfVxuICByZXR1cm4gcyt2O1xufVxuXG5cblxuZnVuY3Rpb24gQmFsbCAoY3R4KXtcbiAgdGhpcy5jdHggPSBjdHg7XG59XG5cbkJhbGwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5keCA9IGdldFJhbmRvbVNpZ24oKTtcbiAgdGhpcy5keSA9IGdldFJhbmRvbVNpZ24oKTtcbiAgdGhpcy54ID0gZ2V0UmFuZG9tV2l0aExpbWl0KDAsIEFwcC5hdmFpbFcpO1xuICB0aGlzLnkgPSBnZXRSYW5kb21XaXRoTGltaXQoMCwgQXBwLmF2YWlsSCk7XG4gIHRoaXMucmFkaXVzID0gNTA7XG59XG5cbkJhbGwucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGN0eCA9IEFwcC5jdHg7XG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAyNTUsIDIwNSwgMC41KVwiO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJKjIsdHJ1ZSk7XG4gIGN0eC5maWxsKCk7XG59XG5cbkJhbGwucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy54ICs9IHRoaXMuZHg7XG4gIHRoaXMueSArPSB0aGlzLmR5O1xuXG4gIGlmICgodGhpcy54ICsgdGhpcy5yYWRpdXMpID4gQXBwLmF2YWlsVylcbiAgICB0aGlzLmR4ID0gLTE7XG4gIGVsc2UgaWYgKCh0aGlzLnggLSB0aGlzLnJhZGl1cykgPCAwKSBcbiAgICB0aGlzLmR4ID0gMTtcblxuICBpZiAoKHRoaXMueSArIHRoaXMucmFkaXVzKSA+IEFwcC5hdmFpbEgpXG4gICAgdGhpcy5keSA9IC0xO1xuICBlbHNlIGlmICgodGhpcy55IC0gdGhpcy5yYWRpdXMpIDwgMCkgXG4gICAgdGhpcy5keSA9IDE7XG5cbn1cblxuXG52YXIgQXBwID0ge1xuICBiYWxsczogW10sXG4gIGtleXByZXNzZWQgOiBbXSxcbiAga2V5TGlzdGVuZXJzIDogW10sIC8vIGZ1bmN0aW9ucyB0byBsaXN0ZW4gZm9yIGtleXMgcHJlc3NlZFxuICBhdmFpbFc6IDAsXG4gIGF2YWlsSDogMCxcbiAgUEVSSU9EOiAxMDAwLzMwLCAvLyBtaWxsaXNlbmNvbmRzXG4gIGJvcmRlckxpbWl0OiAgMC4yNSAvLyBmb3IgbmV3IGJhbGxzXG59XG5cblxuZnVuY3Rpb24gSGVybygpIHtcbn1cblxuSGVyby5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBvaW50cyA9IDA7XG4gIHRoaXMueCA9IEFwcC5hdmFpbFcvMjtcbiAgdGhpcy55ID0gQXBwLmF2YWlsSC8yO1xuICB0aGlzLnJhZGl1cyA9IDQwO1xuICBpZiAodGhpcy5rZXlFdmVudClcbiAgICBkZWxldGUoQXBwLmtleUxpc3RlbmVyc1t0aGlzLmtleUV2ZW50LTFdKTtcbiAgdGhpcy5rZXlFdmVudCA9IEFwcC5rZXlMaXN0ZW5lcnMucHVzaCh0aGlzLmNoZWNrTW92ZW1lbnQoKSk7XG59XG5cbkhlcm8ucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGN0eCA9IEFwcC5jdHg7XG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAxMDAsIDEwMCwgMC41KVwiO1xuICBjdHguZmlsbFJlY3QoKHRoaXMueCkgLSAyMCwgKHRoaXMueSkgLSAyMCwgNDAsNDApO1xuXG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDEwMCwgMC41KVwiO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmModGhpcy54LHRoaXMueSwxMiwwLE1hdGguUEksZmFsc2UpOyAgIC8vIE1vdXRoIChjbG9ja3dpc2UpXG4gIGN0eC5tb3ZlVG8odGhpcy54LTEwLHRoaXMueS0xMCk7XG4gIGN0eC5hcmModGhpcy54LTEwLHRoaXMueS0xMCw1LDAsTWF0aC5QSSoyLHRydWUpOyAgLy8gTGVmdCBleWVcbiAgY3R4Lm1vdmVUbyh0aGlzLngrMTAsdGhpcy55LTEwKTtcbiAgY3R4LmFyYyh0aGlzLngrMTAsdGhpcy55LTEwLDUsMCxNYXRoLlBJKjIsdHJ1ZSk7ICAvLyBSaWdodCBleWVcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5IZXJvLnByb3RvdHlwZS5jaGVja01vdmVtZW50ID0gZnVuY3Rpb24oKSB7XG4gIGxldCB0aGF0ID0gdGhpcztcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbMzddKSB7XG4gICAgICB0aGF0LngtLTsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbMzldKSB7XG4gICAgICB0aGF0LngrKzsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbMzhdKSB7XG4gICAgICB0aGF0LnktLTsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbNDBdKSB7XG4gICAgICB0aGF0LnkrKzsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgfVxufVxuXG52YXIgaGVybyA9IG5ldyBIZXJvKCk7XG5cblxuZnVuY3Rpb24gZG9Nb3ZlbWVudHMoKSB7XG4gIGZvcih2YXIgaz0wOyBrIDwgQXBwLmtleUxpc3RlbmVycy5sZW5ndGg7IGsrKykge1xuICAgIGlmICh0eXBlb2YoQXBwLmtleUxpc3RlbmVyc1trXSkgPT0gXCJmdW5jdGlvblwiKVxuICAgICAgQXBwLmtleUxpc3RlbmVyc1trXSgpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gZHJhdygpIHtcbiAgICBsZXQgY3R4ID0gQXBwLmN0eDtcbiAgICBsZXQgYmFsbHMgPSBBcHAuYmFsbHM7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsMCxBcHAuYXZhaWxXLEFwcC5hdmFpbEgpOyAvLyBjbGVhciBjYW52YXNcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgaGVyby5kcmF3KCk7XG5cbiAgICBmb3IgKHZhciBrID0gMDsgazxiYWxscy5sZW5ndGg7IGsrKykge1xuICAgICAgbGV0IGIgPSBiYWxsc1trXTtcbiAgICAgIGIubW92ZSgpO1xuICAgICAgYi5kcmF3KCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgxMDAsIDEwMCwgMjU1LCAwLjgpXCI7XG4gICAgY3R4LmZpbGxUZXh0KHplcm9wYWQoaGVyby5wb2ludHMsOCksIEFwcC5hdmFpbFcgKiAoMi8zKSwgNDApO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAxMDAsIDI1NSwgMC42KVwiO1xuICAgIGN0eC5maWxsVGV4dChcIlVzZSB0aGUgQXJyb3cgS2V5cyB0byBTVVJWSVZFIVwiLFxuICAgICAgICBBcHAuYXZhaWxXICogKDEvMyksXG4gICAgICAgIEFwcC5hdmFpbEggKiAoMi8zKSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tQb3NpdGlvbnMoZWwxLCBlbDIpIHtcbiAgdmFyIGR4ID0gZWwxLnggLSBlbDIueDtcbiAgdmFyIGR5ID0gZWwxLnkgLSBlbDIueTtcbiAgXG4gIHZhciBkID0gTWF0aC5zcXJ0KChkeCpkeCkgKyAoZHkqZHkpKTtcbiAgdmFyIHIgPSBlbDEucmFkaXVzICsgZWwyLnJhZGl1cztcblxuICBpZiAociA+IGQpIFxuICAgIHJldHVybiB0cnVlO1xuICBlbHNlXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjaGVja01vdmVtZW50cygpIHtcbiAgbGV0IGJhbGxzID0gQXBwLmJhbGxzO1xuXG4gIGZvcihsZXQgaz0wOyBrPGJhbGxzLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKGNoZWNrUG9zaXRpb25zKGhlcm8sIGJhbGxzW2tdKSlcbiAgICAgIGhlcm8uaW5pdCgpO1xuICAgIGlmIChjaGVja1Bvc2l0aW9ucyhiYWxsc1trXSwgYmFsbHNbKGsrMSklYmFsbHMubGVuZ3RoXSkpIHtcbiAgICAgIGJhbGxzW2tdLmR4ICo9IC0xO1xuICAgICAgYmFsbHNba10uZHkgKj0gLTE7XG4gICAgICBiYWxsc1trXS54ICs9IGJhbGxzW2tdLmR4KjM7XG4gICAgICBiYWxsc1trXS55ICs9IGJhbGxzW2tdLmR5KjM7XG4gICAgICBsZXQgYiA9IGJhbGxzWyhrKzEpJWJhbGxzLmxlbmd0aF07XG4gICAgICBiLmR4ICo9IC0xO1xuICAgICAgYi5keSAqPSAtMTtcbiAgICAgIGIueCArPSBiLmR4KjI7XG4gICAgICBiLnkgKz0gYi5keSoyO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGxldCB3aW5XLCB3aW5IO1xuXG4gIGlmIChkb2N1bWVudC5ib2R5ICYmIGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGgpIHtcbiAgIHdpblcgPSBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoO1xuICAgd2luSCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuICB9XG4gIGlmIChkb2N1bWVudC5jb21wYXRNb2RlPT0nQ1NTMUNvbXBhdCcgJiZcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiZcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGggKSB7XG4gICAgd2luVyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICB3aW5IID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgfVxuICBpZiAod2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgd2luVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHdpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cblxuICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcmVlbkZyYW1lXCIpO1xuICBlbC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcInRyYW5zcGFyZW50XCI7XG4gIGVsLnN0eWxlW1wiY29sb3JcIl0gPSBcInJlZFwiO1xuICBlbC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgZWwuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgZWwuc3R5bGUud2lkdGggPSB3aW5XK1wicHhcIjtcbiAgZWwuc3R5bGUuaGVpZ2h0ID0gd2luSCtcInB4XCI7XG4gIGVsLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuXG4gIGxldCBmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJhbWVcIik7XG4gIGZyYW1lLndpZHRoID0gd2luVztcbiAgZnJhbWUuaGVpZ2h0PSB3aW5IO1xuXG4gIEFwcC5hdmFpbFcgPSB3aW5XO1xuICBBcHAuYXZhaWxIID0gd2luSDtcblxuXG4gIGlmIChmcmFtZS5nZXRDb250ZXh0KSB7XG4gICAgQXBwLmN0eCA9IGZyYW1lLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBBcHAuY3R4LmZvbnQgPSBcIjIwcHQgQXJpYWxcIjtcblxuICAgIGZvciAobGV0IGs9MDsgazxuX29mX2JhbGxzOyBrKyspIHtcbiAgICAgIGxldCBiID0gbmV3IEJhbGwoQXBwLmN0eCk7XG4gICAgICBiLmluaXQoKTtcbiAgICAgIEFwcC5iYWxscy5wdXNoKGIpO1xuICAgIH1cblxuICAgIGhlcm8uaW5pdCgpO1xuXG4gICAgd2luZG93Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIEFwcC5rZXlwcmVzc2VkW2Uud2hpY2hdID0gdHJ1ZTtcbiAgICB9XG4gICAgd2luZG93Lm9ua2V5dXA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIEFwcC5rZXlwcmVzc2VkW2Uud2hpY2hdID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyBkcmF3KGN0eCk7IH0sIDEwMDAvMzApO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgc2V0SW50ZXJ2YWwoY2hlY2tNb3ZlbWVudHMsMTAwMC8zMCk7XG4gICAgc2V0SW50ZXJ2YWwoZG9Nb3ZlbWVudHMsMTAwMC8zMCk7XG4gIH0gXG5cbn1cblxuIiwiLy8gaW5pdCBcbnJlYWR5KGZ1bmN0aW9uKCkge1xuICBleHBhbmRfanNvbigpO1xuXG4gIGluaXQoKTtcbn0pO1xuXG5mdW5jdGlvbiBpbnRpdGxlKHN0cikge1xuXHRyZXR1cm4gXCI8aDM+XCIgKyAoc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpKS5yZXBsYWNlKFwiX1wiLCBcIiBcIikgKyBcIjwvaDM+XCI7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZF9qc29uKCkge1xuXHRmb3IgKGxldCBrZXkgaW4gRGF0YSkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGtleSkuaW5uZXJIVE1MID0gaW50aXRsZShrZXkpICsgRGF0YVtrZXldO1xuXHR9XG59XG5cblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50ID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIpe1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsLCBjbGFzc05hbWUpIHtcbmlmIChlbC5jbGFzc0xpc3QpIHtcbiAgZWwuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xufSBlbHNlIHtcbiAgdmFyIGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgdmFyIGV4aXN0aW5nSW5kZXggPSBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcblxuICBpZiAoZXhpc3RpbmdJbmRleCA+PSAwKVxuICAgIGNsYXNzZXMuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpO1xuICBlbHNlXG4gICAgY2xhc3Nlcy5wdXNoKGNsYXNzTmFtZSk7XG5cbiAgZWwuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XG59XG59XG5cbiJdfQ==