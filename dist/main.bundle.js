"use strict";

var Data = {
  "about_me": "\n      <img style=\"float:left;padding: 0px 15px 15px 0px;\" src=\"images/eu.jpg\" widht=\"104\" height=\"105\" />\n      <p>Hi, I'm a professional software developer, interested in a wide range of topics: web development, e-commerce, graphics programming, automated testing, blockchain.... You can browse through my previous works in the other column.  \n      </p>\n\t<p>This webpage is itself a game. You can control the main character that appears in the middle of the screen using the cursor keys and it should avoid colliding with the big enemy balls. Most of the text is rendered using Javascript. \n      <p>\n      Some time ago I started to contribute and/or helped to initialize a few Open Source projects. Please don't hesitate on contact me in order to collaborate or ask any question about them. \n      </p>\n        <p>You can find me on:</p>\n        <ul class=\"square\">\n          <li><a href=\"http://twitter.com/galchwyn\">Twitter</a></li>\n          <li><a href=\"http://facebook.com/manel.villar\">Facebook</a></li>\n          <li><a href=\"http://http://es.linkedin.com/in/manelvillar\" >LinkedIn</a></li>\n          <li><a href=\"http://github.com/manelvf\">Github</a></li>\n\t  <li><a href=\"https://www.slideshare.net/manelvillar/\">Slideshare</a></li>\n          <li>Or simply by email: <a href=\"mailto:manelvf@gmail.com\" >manelvf@gmail.com</a></li>\n        </ul>\n\t",

  "links": "\n\t<p>You might be interested in checking my technical blog: <a href=\"https://manelvf.github.io/blog\">The Fallen Apples</a>.\n\t</p>\n\t<p>Some experiments:\n      <ul class=\"square\"> <li><a href=\"https://github.com/manelvf/Transboard\">Transboard</a>: Collaborative tool for application file translations. It's goal it's to provide a way to organize translation work when multiple translatores are collaborating on the same project. Currently <a href=\"http://transboard.manelvf.com\">in production</a>. [Ruby/Sinatra]</li>\n        <li><a href=\"https://github.com/manelvf/forestal2\">Forestal</a>: this application was developed as part of a timber delivery company chain of tools. It's main goal is goods tracking. [Python/Django] </li>\n\t\t\t</ul>\n\n      <p>My <a href=\"http://js1k.com\">JS1K</a> and JS demo entries:</p>\n      <ul class=\"square\">\n        <li><a href=\"http://js1k.com/2010-first/demos#id38\">Pulse</a>. A light \"pulsar\" made for the first compo (2010)</li>\n        <li><a href=\"http://js1k.com/2012-love/demo/1025\">Hidden Love</a>. Entry for 2012 compo, themed \"Love\"</li>\n        <li><a href=\"http://manelvf.com/drones\">Battle of the Drones</a>. Entry for <a href=\"http://ludumdare.com\">Ludum Dare 25</a></li>\n      </ul>\n\n        <ul class=\"square\">\n          <li><a href=\"http://https://vimeo.com/album/93295\" >Ilion Tools</a>: Some videos made from the tools developed on Ilion Animation Studios [ExtJS] (2007-2009).</li>\n        </ul>\n\n\t"
};
"use strict";

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

Ball.prototype.init = function (radius) {
  this.dx = getRandomSign();
  this.dy = getRandomSign();
  this.x = getRandomWithLimit(0, App.availW);
  this.y = getRandomWithLimit(0, App.availH);
  this.radius = radius || App.ball_radius || 50;
};

Ball.prototype.draw = function () {
  var ctx = App.ctx;
  ctx.fillStyle = "rgba(100, 255, 205, 0.5)";
  ctx.strokeStyle = "rgba(50, 200, 100, 0.8)";
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
};

Ball.prototype.move = function () {
  this.x += this.dx;
  this.y += this.dy;

  if (this.x + this.radius > App.availW) this.dx = -1;else if (this.x - this.radius < 0) this.dx = 1;

  if (this.y + this.radius > App.availH) this.dy = -1;else if (this.y - this.radius < 0) this.dy = 1;
};

var App = {
  balls: [],
  ball_radius: 35,
  n_of_balls: 7,
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
  ctx.strokeStyle = "rgba(155, 50, 50, 0.8)";
  ctx.strokeRect(this.x - 20, this.y - 20, 40, 40);

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
  ctx.fillText("Use the Arrow Keys to SURVIVE!", App.availW * (3 / 7), App.availH * (2 / 3));

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
    if (checkPositions(hero, balls[k])) {
      hero.init();
    }
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
  App.frame = frame;

  if (frame.getContext) {
    App.ctx = frame.getContext("2d");
    App.ctx.font = "20pt Arial";

    var i = 0;

    var _loop = function _loop() {
      var b = new Ball(App.ctx);
      b.init();

      var collisions = App.balls.filter(function (ball) {
        return checkPositions(b, ball);
      });
      if (collisions.length) {
        return "continue";
      }

      App.balls.push(b);
      i++;
    };

    while (i < App.n_of_balls) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }

    hero.init();

    window.onkeydown = function (e) {
      App.keypressed[e.which] = true;
    };
    window.onkeyup = function (e) {
      App.keypressed[e.which] = false;
    };

    App.frame.addEventListener("touchstart", handleTouchStart, false);
    App.frame.addEventListener("touchend", handleTouchEnd, false);

    window.requestAnimationFrame(draw);
    setInterval(checkMovements, 1000 / 30);
    setInterval(doMovements, 1000 / 30);
  }

  function handleTouchStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      console.log("touchstart:" + i + "..." + touches[i]);
      console.log("touchstart:" + i + ".");
    }
  }

  function handleTouchEnd(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      console.log(touches[i]);
    }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzL2RhdGEuanMiLCIuLi9qcy9nYW1lLmpzIiwiLi4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTztBQUNWLHc0Q0FEVTs7QUFvQlY7QUFwQlUsQ0FBWDs7O0FDQ0E7QUFDQSxTQUFTLGFBQVQsR0FBeUI7QUFDdkIsTUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxFQUFYLENBQVI7QUFDQSxNQUFJLEtBQUcsQ0FBUCxFQUNFLE9BQU8sQ0FBQyxDQUFSLENBREYsS0FHRSxPQUFPLENBQVA7QUFDSDs7QUFFRCxTQUFTLGtCQUFULENBQTRCLEdBQTVCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLE1BQUksVUFBSjs7QUFFQSxLQUFHO0FBQ0Q7QUFDQSxRQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxNQUFpQixNQUFJLEdBQXJCLENBQVgsSUFBd0MsR0FBNUM7QUFDRCxHQUhELFFBR1UsSUFBSyxNQUFNLElBQUksV0FBaEIsSUFDTixJQUFLLE1BQU8sTUFBTSxJQUFJLFdBSnpCOztBQU9BLFNBQU8sQ0FBUDtBQUNEOztBQUVELFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUFzQjtBQUNwQixNQUFJLElBQUksSUFBSSxPQUFPLENBQVAsRUFBVSxNQUF0QjtBQUNBLE1BQUksSUFBSSxFQUFSO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLFNBQUssR0FBTDtBQUNEO0FBQ0QsU0FBTyxJQUFFLENBQVQ7QUFDRDs7QUFJRCxTQUFTLElBQVQsQ0FBZSxHQUFmLEVBQW1CO0FBQ2pCLE9BQUssR0FBTCxHQUFXLEdBQVg7QUFDRDs7QUFFRCxLQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLFVBQVMsTUFBVCxFQUFpQjtBQUNyQyxPQUFLLEVBQUwsR0FBVSxlQUFWO0FBQ0EsT0FBSyxFQUFMLEdBQVUsZUFBVjtB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LEVBQWYsRUFBbUI7QUFDakIsTUFBSSxTQUFTLFdBQVQsR0FBdUIsU0FBUyxVQUFULEtBQXdCLFVBQS9DLEdBQTRELFNBQVMsVUFBVCxLQUF3QixTQUF4RixFQUFrRztBQUNoRztBQUNELEdBRkQsTUFFTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7QUFHRCxTQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsU0FBekIsRUFBb0M7QUFDaEMsTUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDaEIsT0FBRyxTQUFILENBQWEsTUFBYixDQUFvQixTQUFwQjtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUksVUFBVSxHQUFHLFNBQUgsQ0FBYSxLQUFiLENBQW1CLEdBQW5CLENBQWQ7QUFDQSxRQUFJLGdCQUFnQixRQUFRLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBcEI7O0FBRUEsUUFBSSxpQkFBaUIsQ0FBckIsRUFDRSxRQUFRLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENBQTlCLEVBREYsS0FHRSxRQUFRLElBQVIsQ0FBYSxTQUFiOztBQUVGLE9BQUcsU0FBSCxHQUFlLFFBQVEsSUFBUixDQUFhLEdBQWIsQ0FBZjtBQUNEO0FBQ0oiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRGF0YSA9IHtcblx0XCJhYm91dF9tZVwiOiBgXG4gICAgICA8aW1nIHN0eWxlPVwiZmxvYXQ6bGVmdDtwYWRkaW5nOiAwcHggMTVweCAxNXB4IDBweDtcIiBzcmM9XCJpbWFnZXMvZXUuanBnXCIgd2lkaHQ9XCIxMDRcIiBoZWlnaHQ9XCIxMDVcIiAvPlxuICAgICAgPHA+SGksIEknbSBhIHByb2Zlc3Npb25hbCBzb2Z0d2FyZSBkZXZlbG9wZXIsIGludGVyZXN0ZWQgaW4gYSB3aWRlIHJhbmdlIG9mIHRvcGljczogd2ViIGRldmVsb3BtZW50LCBlLWNvbW1lcmNlLCBncmFwaGljcyBwcm9ncmFtbWluZywgYXV0b21hdGVkIHRlc3RpbmcsIGJsb2NrY2hhaW4uLi4uIFlvdSBjYW4gYnJvd3NlIHRocm91Z2ggbXkgcHJldmlvdXMgd29ya3MgaW4gdGhlIG90aGVyIGNvbHVtbi4gIFxuICAgICAgPC9wPlxuXHQ8cD5UaGlzIHdlYnBhZ2UgaXMgaXRzZWxmIGEgZ2FtZS4gWW91IGNhbiBjb250cm9sIHRoZSBtYWluIGNoYXJhY3RlciB0aGF0IGFwcGVhcnMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuIHVzaW5nIHRoZSBjdXJzb3Iga2V5cyBhbmQgaXQgc2hvdWxkIGF2b2lkIGNvbGxpZGluZyB3aXRoIHRoZSBiaWcgZW5lbXkgYmFsbHMuIE1vc3Qgb2YgdGhlIHRleHQgaXMgcmVuZGVyZWQgdXNpbmcgSmF2YXNjcmlwdC4gXG4gICAgICA8cD5cbiAgICAgIFNvbWUgdGltZSBhZ28gSSBzdGFydGVkIHRvIGNvbnRyaWJ1dGUgYW5kL29yIGhlbHBlZCB0byBpbml0aWFsaXplIGEgZmV3IE9wZW4gU291cmNlIHByb2plY3RzLiBQbGVhc2UgZG9uJ3QgaGVzaXRhdGUgb24gY29udGFjdCBtZSBpbiBvcmRlciB0byBjb2xsYWJvcmF0ZSBvciBhc2sgYW55IHF1ZXN0aW9uIGFib3V0IHRoZW0uIFxuICAgICAgPC9wPlxuICAgICAgICA8cD5Zb3UgY2FuIGZpbmQgbWUgb246PC9wPlxuICAgICAgICA8dWwgY2xhc3M9XCJzcXVhcmVcIj5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS9nYWxjaHd5blwiPlR3aXR0ZXI8L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9mYWNlYm9vay5jb20vbWFuZWwudmlsbGFyXCI+RmFjZWJvb2s8L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9odHRwOi8vZXMubGlua2VkaW4uY29tL2luL21hbmVsdmlsbGFyXCIgPkxpbmtlZEluPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0aHViLmNvbS9tYW5lbHZmXCI+R2l0aHViPC9hPjwvbGk+XG5cdCAgPGxpPjxhIGhyZWY9XCJodHRwczovL3d3dy5zbGlkZXNoYXJlLm5ldC9tYW5lbHZpbGxhci9cIj5TbGlkZXNoYXJlPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPk9yIHNpbXBseSBieSBlbWFpbDogPGEgaHJlZj1cIm1haWx0bzptYW5lbHZmQGdtYWlsLmNvbVwiID5tYW5lbHZmQGdtYWlsLmNvbTwvYT48L2xpPlxuICAgICAgICA8L3VsPlxuXHRgLFxuXG5cdFwibGlua3NcIjogYFxuXHQ8cD5Zb3UgbWlnaHQgYmUgaW50ZXJlc3RlZCBpbiBjaGVja2luZyBteSB0ZWNobmljYWwgYmxvZzogPGEgaHJlZj1cImh0dHBzOi8vbWFuZWx2Zi5naXRodWIuaW8vYmxvZ1wiPlRoZSBGYWxsZW4gQXBwbGVzPC9hPi5cblx0PC9wPlxuXHQ8cD5Tb21lIGV4cGVyaW1lbnRzOlxuICAgICAgPHVsIGNsYXNzPVwic3F1YXJlXCI+IDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hbmVsdmYvVHJhbnNib2FyZFwiPlRyYW5zYm9hcmQ8L2E+OiBDb2xsYWJvcmF0aXZlIHRvb2wgZm9yIGFwcGxpY2F0aW9uIGZpbGUgdHJhbnNsYXRpb25zLiBJdCdzIGdvYWwgaXQncyB0byBwcm92aWRlIGEgd2F5IHRvIG9yZ2FuaXplIHRyYW5zbGF0aW9uIHdvcmsgd2hlbiBtdWx0aXBsZSB0cmFuc2xhdG9yZXMgYXJlIGNvbGxhYm9yYXRpbmcgb24gdGhlIHNhbWUgcHJvamVjdC4gQ3VycmVudGx5IDxhIGhyZWY9XCJodHRwOi8vdHJhbnNib2FyZC5tYW5lbHZmLmNvbVwiPmluIHByb2R1Y3Rpb248L2E+LiBbUnVieS9TaW5hdHJhXTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hbmVsdmYvZm9yZXN0YWwyXCI+Rm9yZXN0YWw8L2E+OiB0aGlzIGFwcGxpY2F0aW9uIHdhcyBkZXZlbG9wZWQgYXMgcGFydCBvZiBhIHRpbWJlciBkZWxpdmVyeSBjb21wYW55IGNoYWluIG9mIHRvb2xzLiBJdCdzIG1haW4gZ29hbCBpcyBnb29kcyB0cmFja2luZy4gW1B5dGhvbi9EamFuZ29dIDwvbGk+XG5cdFx0XHQ8L3VsPlxuXG4gICAgICA8cD5NeSA8YSBocmVmPVwiaHR0cDovL2pzMWsuY29tXCI+SlMxSzwvYT4gYW5kIEpTIGRlbW8gZW50cmllczo8L3A+XG4gICAgICA8dWwgY2xhc3M9XCJzcXVhcmVcIj5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vanMxay5jb20vMjAxMC1maXJzdC9kZW1vcyNpZDM4XCI+UHVsc2U8L2E+LiBBIGxpZ2h0IFwicHVsc2FyXCIgbWFkZSBmb3IgdGhlIGZpcnN0IGNvbXBvICgyMDEwKTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2pzMWsuY29tLzIwMTItbG92ZS9kZW1vLzEwMjVcIj5IaWRkZW4gTG92ZTwvYT4uIEVudHJ5IGZvciAyMDEyIGNvbXBvLCB0aGVtZWQgXCJMb3ZlXCI8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tYW5lbHZmLmNvbS9kcm9uZXNcIj5CYXR0bGUgb2YgdGhlIERyb25lczwvYT4uIEVudHJ5IGZvciA8YSBocmVmPVwiaHR0cDovL2x1ZHVtZGFyZS5jb21cIj5MdWR1bSBEYXJlIDI1PC9hPjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICAgIDx1bCBjbGFzcz1cInNxdWFyZVwiPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2h0dHBzOi8vdmltZW8uY29tL2FsYnVtLzkzMjk1XCIgPklsaW9uIFRvb2xzPC9hPjogU29tZSB2aWRlb3MgbWFkZSBmcm9tIHRoZSB0b29scyBkZXZlbG9wZWQgb24gSWxpb24gQW5pbWF0aW9uIFN0dWRpb3MgW0V4dEpTXSAoMjAwNy0yMDA5KS48L2xpPlxuICAgICAgICA8L3VsPlxuXG5cdGBcbn1cbiIsIlxuLy8gcmV0dXJuIC0xIG9yIDFcbmZ1bmN0aW9uIGdldFJhbmRvbVNpZ24oKSB7XG4gIGxldCB2ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgaWYgKHY9PTApIFxuICAgIHJldHVybiAtMTtcbiAgZWxzZSBcbiAgICByZXR1cm4gMTtcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tV2l0aExpbWl0KG1pbixtYXgpIHtcbiAgbGV0IHY7XG5cbiAgZG8ge1xuICAgIC8vIHNlYXJjaCBmb3IgYSBuaWNlIHZhbHVlLiBJZiBub3QgZm91bmQsIHRyeSBhZ2FpblxuICAgIHYgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAobWF4LW1pbikpICsgbWluO1xuICB9IHdoaWxlKCAodiA+IChtYXggKiBBcHAuYm9yZGVyTGltaXQpKSAmJlxuICAgICh2IDwgKG1heCAtIChtYXggKiBBcHAuYm9yZGVyTGltaXQpKSlcbiAgKTtcblxuICByZXR1cm4gdjtcbn1cblxuZnVuY3Rpb24gemVyb3BhZCh2LG4pIHtcbiAgbGV0IHogPSBuIC0gU3RyaW5nKHYpLmxlbmd0aDtcbiAgbGV0IHMgPSBcIlwiO1xuICBmb3IgKGxldCBjID0gMDsgYyA8IHo7IGMrKykge1xuICAgIHMgKz0gXCIwXCI7XG4gIH1cbiAgcmV0dXJuIHMrdjtcbn1cblxuXG5cbmZ1bmN0aW9uIEJhbGwgKGN0eCl7XG4gIHRoaXMuY3R4ID0gY3R4O1xufVxuXG5CYWxsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ocmFkaXVzKSB7XG4gIHRoaXMuZHggPSBnZXRSYW5kb21TaWduKCk7XG4gIHRoaXMuZHkgPSBnZXRSYW5kb21TaWduKCk7XG4gIHRoaXMueCA9IGdldFJhbmRvbVdpdGhMaW1pdCgwLCBBcHAuYXZhaWxXKTtcbiAgdGhpcy55ID0gZ2V0UmFuZG9tV2l0aExpbWl0KDAsIEFwcC5hdmFpbEgpO1xuICB0aGlzLnJhZGl1cyA9IHJhZGl1cyB8fCBBcHAuYmFsbF9yYWRpdXMgfHwgNTA7XG59XG5cbkJhbGwucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGN0eCA9IEFwcC5jdHg7XG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAyNTUsIDIwNSwgMC41KVwiO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoNTAsIDIwMCwgMTAwLCAwLjgpXCI7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkqMix0cnVlKTtcbiAgY3R4LmZpbGwoKTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5CYWxsLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMueCArPSB0aGlzLmR4O1xuICB0aGlzLnkgKz0gdGhpcy5keTtcblxuICBpZiAoKHRoaXMueCArIHRoaXMucmFkaXVzKSA+IEFwcC5hdmFpbFcpXG4gICAgdGhpcy5keCA9IC0xO1xuICBlbHNlIGlmICgodGhpcy54IC0gdGhpcy5yYWRpdXMpIDwgMCkgXG4gICAgdGhpcy5keCA9IDE7XG5cbiAgaWYgKCh0aGlzLnkgKyB0aGlzLnJhZGl1cykgPiBBcHAuYXZhaWxIKVxuICAgIHRoaXMuZHkgPSAtMTtcbiAgZWxzZSBpZiAoKHRoaXMueSAtIHRoaXMucmFkaXVzKSA8IDApIFxuICAgIHRoaXMuZHkgPSAxO1xuXG59XG5cblxudmFyIEFwcCA9IHtcbiAgYmFsbHM6IFtdLFxuICBiYWxsX3JhZGl1czogMzUsXG4gIG5fb2ZfYmFsbHM6IDcsXG4gIGtleXByZXNzZWQgOiBbXSxcbiAga2V5TGlzdGVuZXJzIDogW10sIC8vIGZ1bmN0aW9ucyB0byBsaXN0ZW4gZm9yIGtleXMgcHJlc3NlZFxuICBhdmFpbFc6IDAsXG4gIGF2YWlsSDogMCxcbiAgUEVSSU9EOiAxMDAwLzMwLCAvLyBtaWxsaXNlbmNvbmRzXG4gIGJvcmRlckxpbWl0OiAgMC4yNSAvLyBmb3IgbmV3IGJhbGxzXG59XG5cblxuZnVuY3Rpb24gSGVybygpIHtcbn1cblxuSGVyby5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBvaW50cyA9IDA7XG4gIHRoaXMueCA9IEFwcC5hdmFpbFcvMjtcbiAgdGhpcy55ID0gQXBwLmF2YWlsSC8yO1xuICB0aGlzLnJhZGl1cyA9IDQwO1xuICBpZiAodGhpcy5rZXlFdmVudClcbiAgICBkZWxldGUoQXBwLmtleUxpc3RlbmVyc1t0aGlzLmtleUV2ZW50LTFdKTtcbiAgdGhpcy5rZXlFdmVudCA9IEFwcC5rZXlMaXN0ZW5lcnMucHVzaCh0aGlzLmNoZWNrTW92ZW1lbnQoKSk7XG59XG5cbkhlcm8ucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgbGV0IGN0eCA9IEFwcC5jdHg7XG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAxMDAsIDEwMCwgMC41KVwiO1xuICBjdHguZmlsbFJlY3QoKHRoaXMueCkgLSAyMCwgKHRoaXMueSkgLSAyMCwgNDAsNDApO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMTU1LCA1MCwgNTAsIDAuOClcIjtcbiAgY3R4LnN0cm9rZVJlY3QoKHRoaXMueCkgLSAyMCwgKHRoaXMueSkgLSAyMCwgNDAsNDApO1xuXG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDEwMCwgMC41KVwiO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmModGhpcy54LHRoaXMueSwxMiwwLE1hdGguUEksZmFsc2UpOyAgIC8vIE1vdXRoIChjbG9ja3dpc2UpXG4gIGN0eC5tb3ZlVG8odGhpcy54LTEwLHRoaXMueS0xMCk7XG4gIGN0eC5hcmModGhpcy54LTEwLHRoaXMueS0xMCw1LDAsTWF0aC5QSSoyLHRydWUpOyAgLy8gTGVmdCBleWVcbiAgY3R4Lm1vdmVUbyh0aGlzLngrMTAsdGhpcy55LTEwKTtcbiAgY3R4LmFyYyh0aGlzLngrMTAsdGhpcy55LTEwLDUsMCxNYXRoLlBJKjIsdHJ1ZSk7ICAvLyBSaWdodCBleWVcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5IZXJvLnByb3RvdHlwZS5jaGVja01vdmVtZW50ID0gZnVuY3Rpb24oKSB7XG4gIGxldCB0aGF0ID0gdGhpcztcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbMzddKSB7XG4gICAgICB0aGF0LngtLTsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbMzldKSB7XG4gICAgICB0aGF0LngrKzsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbMzhdKSB7XG4gICAgICB0aGF0LnktLTsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgICBpZiAoQXBwLmtleXByZXNzZWRbNDBdKSB7XG4gICAgICB0aGF0LnkrKzsgXG4gICAgICB0aGF0LnBvaW50cysrO1xuICAgIH1cbiAgfVxufVxuXG52YXIgaGVybyA9IG5ldyBIZXJvKCk7XG5cblxuZnVuY3Rpb24gZG9Nb3ZlbWVudHMoKSB7XG4gIGZvcih2YXIgaz0wOyBrIDwgQXBwLmtleUxpc3RlbmVycy5sZW5ndGg7IGsrKykge1xuICAgIGlmICh0eXBlb2YoQXBwLmtleUxpc3RlbmVyc1trXSkgPT0gXCJmdW5jdGlvblwiKVxuICAgICAgQXBwLmtleUxpc3RlbmVyc1trXSgpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gZHJhdygpIHtcbiAgICBsZXQgY3R4ID0gQXBwLmN0eDtcbiAgICBsZXQgYmFsbHMgPSBBcHAuYmFsbHM7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsMCxBcHAuYXZhaWxXLEFwcC5hdmFpbEgpOyAvLyBjbGVhciBjYW52YXNcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgaGVyby5kcmF3KCk7XG5cbiAgICBmb3IgKHZhciBrID0gMDsgazxiYWxscy5sZW5ndGg7IGsrKykge1xuICAgICAgbGV0IGIgPSBiYWxsc1trXTtcbiAgICAgIGIubW92ZSgpO1xuICAgICAgYi5kcmF3KCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgxMDAsIDEwMCwgMjU1LCAwLjgpXCI7XG4gICAgY3R4LmZpbGxUZXh0KHplcm9wYWQoaGVyby5wb2ludHMsOCksIEFwcC5hdmFpbFcgKiAoMi8zKSwgNDApO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMTAwLCAxMDAsIDI1NSwgMC42KVwiO1xuICAgIGN0eC5maWxsVGV4dChcIlVzZSB0aGUgQXJyb3cgS2V5cyB0byBTVVJWSVZFIVwiLFxuICAgICAgICBBcHAuYXZhaWxXICogKDMvNyksXG4gICAgICAgIEFwcC5hdmFpbEggKiAoMi8zKSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tQb3NpdGlvbnMoZWwxLCBlbDIpIHtcbiAgdmFyIGR4ID0gZWwxLnggLSBlbDIueDtcbiAgdmFyIGR5ID0gZWwxLnkgLSBlbDIueTtcbiAgXG4gIHZhciBkID0gTWF0aC5zcXJ0KChkeCpkeCkgKyAoZHkqZHkpKTtcbiAgdmFyIHIgPSBlbDEucmFkaXVzICsgZWwyLnJhZGl1cztcblxuICBpZiAociA+IGQpIFxuICAgIHJldHVybiB0cnVlO1xuICBlbHNlXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjaGVja01vdmVtZW50cygpIHtcbiAgbGV0IGJhbGxzID0gQXBwLmJhbGxzO1xuXG4gIGZvcihsZXQgaz0wOyBrPGJhbGxzLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKGNoZWNrUG9zaXRpb25zKGhlcm8sIGJhbGxzW2tdKSkge1xuICAgICAgaGVyby5pbml0KCk7XG4gICAgfVxuICAgIGlmIChjaGVja1Bvc2l0aW9ucyhiYWxsc1trXSwgYmFsbHNbKGsrMSklYmFsbHMubGVuZ3RoXSkpIHtcbiAgICAgIGJhbGxzW2tdLmR4ICo9IC0xO1xuICAgICAgYmFsbHNba10uZHkgKj0gLTE7XG4gICAgICBiYWxsc1trXS54ICs9IGJhbGxzW2tdLmR4KjM7XG4gICAgICBiYWxsc1trXS55ICs9IGJhbGxzW2tdLmR5KjM7XG4gICAgICBsZXQgYiA9IGJhbGxzWyhrKzEpJWJhbGxzLmxlbmd0aF07XG4gICAgICBiLmR4ICo9IC0xO1xuICAgICAgYi5keSAqPSAtMTtcbiAgICAgIGIueCArPSBiLmR4KjI7XG4gICAgICBiLnkgKz0gYi5keSoyO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGxldCB3aW5XLCB3aW5IO1xuXG4gIGlmIChkb2N1bWVudC5ib2R5ICYmIGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGgpIHtcbiAgIHdpblcgPSBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoO1xuICAgd2luSCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuICB9XG4gIGlmIChkb2N1bWVudC5jb21wYXRNb2RlPT0nQ1NTMUNvbXBhdCcgJiZcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiZcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGggKSB7XG4gICAgd2luVyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICB3aW5IID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgfVxuICBpZiAod2luZG93LmlubmVyV2lkdGggJiYgd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgd2luVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHdpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cblxuICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcmVlbkZyYW1lXCIpO1xuICBlbC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcInRyYW5zcGFyZW50XCI7XG4gIGVsLnN0eWxlW1wiY29sb3JcIl0gPSBcInJlZFwiO1xuICBlbC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgZWwuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgZWwuc3R5bGUud2lkdGggPSB3aW5XK1wicHhcIjtcbiAgZWwuc3R5bGUuaGVpZ2h0ID0gd2luSCtcInB4XCI7XG4gIGVsLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuXG4gIGxldCBmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJhbWVcIik7XG4gIGZyYW1lLndpZHRoID0gd2luVztcbiAgZnJhbWUuaGVpZ2h0PSB3aW5IO1xuXG4gIEFwcC5hdmFpbFcgPSB3aW5XO1xuICBBcHAuYXZhaWxIID0gd2luSDtcbiAgQXBwLmZyYW1lID0gZnJhbWU7XG5cblxuICBpZiAoZnJhbWUuZ2V0Q29udGV4dCkge1xuICAgIEFwcC5jdHggPSBmcmFtZS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgQXBwLmN0eC5mb250ID0gXCIyMHB0IEFyaWFsXCI7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUoaSA8IEFwcC5uX29mX2JhbGxzKSB7XG4gICAgICBsZXQgYiA9IG5ldyBCYWxsKEFwcC5jdHgpO1xuICAgICAgYi5pbml0KCk7XG5cbiAgICAgIGxldCBjb2xsaXNpb25zID0gQXBwLmJhbGxzLmZpbHRlcigoYmFsbCkgPT4gY2hlY2tQb3NpdGlvbnMoYiwgYmFsbCkpXG4gICAgICBpZiAoY29sbGlzaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgQXBwLmJhbGxzLnB1c2goYik7XG4gICAgICBpKytcbiAgICB9XG5cbiAgICBoZXJvLmluaXQoKTtcblxuICAgIHdpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgICBBcHAua2V5cHJlc3NlZFtlLndoaWNoXSA9IHRydWU7XG4gICAgfVxuICAgIHdpbmRvdy5vbmtleXVwPSBmdW5jdGlvbihlKSB7XG4gICAgICBBcHAua2V5cHJlc3NlZFtlLndoaWNoXSA9IGZhbHNlO1xuICAgIH1cblxuICAgIEFwcC5mcmFtZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVUb3VjaFN0YXJ0LCBmYWxzZSlcbiAgICBBcHAuZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZVRvdWNoRW5kLCBmYWxzZSlcblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgc2V0SW50ZXJ2YWwoY2hlY2tNb3ZlbWVudHMsMTAwMC8zMCk7XG4gICAgc2V0SW50ZXJ2YWwoZG9Nb3ZlbWVudHMsMTAwMC8zMCk7XG4gIH0gXG5cbiAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydChldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZyhcInRvdWNoc3RhcnQuXCIpO1xuICAgIHZhciB0b3VjaGVzID0gZXZ0LmNoYW5nZWRUb3VjaGVzO1xuICAgICAgICAgIFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc29sZS5sb2coXCJ0b3VjaHN0YXJ0OlwiICsgaSArIFwiLi4uXCIgKyB0b3VjaGVzW2ldKTtcbiAgICAgIGNvbnNvbGUubG9nKFwidG91Y2hzdGFydDpcIiArIGkgKyBcIi5cIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlVG91Y2hFbmQoZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHRvdWNoZXMgPSBldnQuY2hhbmdlZFRvdWNoZXM7XG4gIFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc29sZS5sb2codG91Y2hlc1tpXSlcbiAgICB9XG4gIH1cblxufVxuXG4iLCIvLyBpbml0IFxucmVhZHkoZnVuY3Rpb24oKSB7XG4gIGV4cGFuZF9qc29uKCk7XG5cbiAgaW5pdCgpO1xufSk7XG5cbmZ1bmN0aW9uIGludGl0bGUoc3RyKSB7XG5cdHJldHVybiBcIjxoMz5cIiArIChzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkpLnJlcGxhY2UoXCJfXCIsIFwiIFwiKSArIFwiPC9oMz5cIjtcbn1cblxuZnVuY3Rpb24gZXhwYW5kX2pzb24oKSB7XG5cdGZvciAobGV0IGtleSBpbiBEYXRhKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KS5pbm5lckhUTUwgPSBpbnRpdGxlKGtleSkgKyBEYXRhW2tleV07XG5cdH1cbn1cblxuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQuYXR0YWNoRXZlbnQgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgOiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIil7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgIHZhciBleGlzdGluZ0luZGV4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG5cbiAgICAgIGlmIChleGlzdGluZ0luZGV4ID49IDApXG4gICAgICAgIGNsYXNzZXMuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpO1xuICAgICAgZWxzZVxuICAgICAgICBjbGFzc2VzLnB1c2goY2xhc3NOYW1lKTtcblxuICAgICAgZWwuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgfVxufVxuXG4iXX0=