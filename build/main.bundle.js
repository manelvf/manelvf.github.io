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
  n_of_balls: 5,
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

    for (var k = 0; k < App.n_of_balls; k++) {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzL2RhdGEuanMiLCIuLi9qcy9nYW1lLmpzIiwiLi4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTztBQUNWLHc0Q0FEVTs7QUFvQlY7QUFwQlUsQ0FBWDs7O0FDQ0E7QUFDQSxTQUFTLGFBQVQsR0FBeUI7QUFDdkIsTUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxFQUFYLENBQVI7QUFDQSxNQUFJLEtBQUcsQ0FBUCxFQUNFLE9BQU8sQ0FBQyxDQUFSLENBREYsS0FHRSxPQUFPLENBQVA7QUFDSDs7QUFFRCxTQUFTLGtCQUFULENBQTRCLEdBQTVCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLE1BQUksVUFBSjs7QUFFQSxLQUFHO0FBQ0Q7QUFDQSxRQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxNQUFpQixNQUFJLEdBQXJCLENBQVgsSUFBd0MsR0FBNUM7QUFDRCxHQUhELFFBR1UsSUFBSyxNQUFNLElBQUksV0FBaEIsSUFDTixJQUFLLE1BQU8sTUFBTSxJQUFJLFdBSnpCOztBQU9BLFNBQU8sQ0FBUDtBQUNEOztBQUVELFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUFzQjtBQUNwQixNQUFJLElBQUksSUFBSSxPQUFPLENBQVAsRUFBVSxNQUF0QjtBQUNBLE1BQUksSUFBSSxFQUFSO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLFNBQUssR0FBTDtBQUNEO0FBQ0QsU0FBTyxJQUFFLENBQVQ7QUFDRDs7QUFJRCxTQUFTLElBQVQsQ0FBZSxHQUFmLEVBQW1CO0FBQ2pCLE9BQUssR0FBTCxHQUFXLEdBQVg7QUFDRDs7QUFFRCxLQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLFlBQVc7QUFDL0IsT0FBSyxFQUFMLEdBQVUsZUFBVjtBQUNBLE9BQUssRUFBTCxHQUFVLGVBQVY7QUFDQSxPQUFLLENBQUwsR0FBUyxtQkFBbUIsQ0FBbkIsRUFBc0IsSUFBSSxNQUExQixDQUFUO0FBQ0EsT0FBSyxDQUFMLEdBQVMsbUJBQW1CLENBQW5CLEVBQXNCLElBQUksTUFBMUIsQ0FBVDtBQUNBLE9BQUssTUFBTCxHQUFjLEVBQWQ7QUFDRCxDQU5EOztBQVFBLEtBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsWUFBVztBQUMvQixNQUFJLE1BQU0sSUFBSSxHQUFkO0FBQ0EsTUFBSSxTQUFKLEdBQWdCLDBCQUFoQjtBQUNBLE1BQUksV0FBSixHQUFrQix5QkFBbEI7QUFDQSxNQUFJLFNBQUo7QUFDQSxNQUFJLEdBQUosQ0FBUSxLQUFLLENBQWIsRUFBZ0IsS0FBSyxDQUFyQixFQUF3QixLQUFLLE1BQTdCLEVBQXFDLENBQXJDLEVBQXdDLEtBQUssRUFBTCxHQUFRLENBQWhELEVBQWtELElBQWxEO0FBQ0EsTUFBSSxJQUFKO0FBQ0EsTUFBSSxNQUFKO0FBQ0QsQ0FSRDs7QUFVQSxLQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLFlBQVc7QUFDL0IsT0FBSyxDQUFMLElBQVUsS0FBSyxFQUFmO0FBQ0EsT0FBSyxDQUFMLElBQVUsS0FBSyxFQUFmOztBQUVBLE1BQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxNQUFmLEdBQXlCLElBQUksTUFBakMsRUFDRSxLQUFLLEVBQUwsR0FBVSxDQUFDLENBQVgsQ0FERixLQUVLLElBQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxNQUFmLEdBQXlCLENBQTdCLEVBQ0gsS0FBSyxFQUFMLEdBQVUsQ0FBVjs7QUFFRixNQUFLLEtBQUssQ0FBTCxHQUFTLEtBQUssTUFBZixHQUF5QixJQUFJLE1BQWpDLEVBQ0UsS0FBSyxFQUFMLEdBQVUsQ0FBQyxDQUFYLENBREYsS0FFSyxJQUFLLEtBQUssQ0FBTCxHQUFTLEtBQUssTUFBZixHQUF5QixDQUE3QixFQUNILEtBQUssRUFBTCxHQUFVLENBQVY7QUFFSCxDQWREOztBQWlCQSxJQUFJLE1BQU07QUFDUixTQUFPLEVBREM7QUFFUixjQUFZLENBRko7QUFHUixjQUFhLEVBSEw7QUFJUixnQkFBZSxFQUpQLEVBSVc7QUFDbkIsVUFBUSxDQUxBO0FBTVIsVUFBUSxDQU5BO0FBT1IsVUFBUSxPQUFLLEVBUEwsRUFPUztBQUNqQixlQUFjLElBUk4sQ0FRVztBQVJYLENBQVY7O0FBWUEsU0FBUyxJQUFULEdBQWdCLENBQ2Y7O0FBRUQsS0FBSyxTQUFMLENBQWUsSUFBZixHQUFzQixZQUFXO0FBQy9CLE9BQUssTUFBTCxHQUFjLENBQWQ7QUFDQSxPQUFLLENBQUwsR0FBUyxJQUFJLE1BQUosR0FBVyxDQUFwQjtBQUNBLE9BQUssQ0FBTCxHQUFTLElBQUksTUFBSixHQUFXLENBQXBCO0FBQ0EsT0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLE1BQUksS0FBSyxRQUFULEVBQ0UsT0FBTyxJQUFJLFlBQUosQ0FBaUIsS0FBSyxRQUFMLEdBQWMsQ0FBL0IsQ0FBUDtBQUNGLE9BQUssUUFBTCxHQUFnQixJQUFJLFlBQUosQ0FBaUIsSUFBakIsQ0FBc0IsS0FBSyxhQUFMLEVBQXRCLENBQWhCO0FBQ0QsQ0FSRDs7QUFVQSxLQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLFlBQVc7QUFDL0IsTUFBSSxNQUFNLElBQUksR0FBZDtBQUNBLE1BQUksU0FBSixHQUFnQiwwQkFBaEI7QUFDQSxNQUFJLFFBQUosQ0FBYyxLQUFLLENBQU4sR0FBVyxFQUF4QixFQUE2QixLQUFLLENBQU4sR0FBVyxFQUF2QyxFQUEyQyxFQUEzQyxFQUE4QyxFQUE5QztBQUNBLE1BQUksV0FBSixHQUFrQix3QkFBbEI7QUFDQSxNQUFJLFVBQUosQ0FBZ0IsS0FBSyxDQUFOLEdBQVcsRUFBMUIsRUFBK0IsS0FBSyxDQUFOLEdBQVcsRUFBekMsRUFBNkMsRUFBN0MsRUFBZ0QsRUFBaEQ7O0FBRUEsTUFBSSxTQUFKLEdBQWdCLDBCQUFoQjtBQUNBLE1BQUksU0FBSjtBQUNBLE1BQUksR0FBSixDQUFRLEtBQUssQ0FBYixFQUFlLEtBQUssQ0FBcEIsRUFBc0IsRUFBdEIsRUFBeUIsQ0FBekIsRUFBMkIsS0FBSyxFQUFoQyxFQUFtQyxLQUFuQyxFQVQrQixDQVNjO0FBQzdDLE1BQUksTUFBSixDQUFXLEtBQUssQ0FBTCxHQUFPLEVBQWxCLEVBQXFCLEtBQUssQ0FBTCxHQUFPLEVBQTVCO0FBQ0EsTUFBSSxHQUFKLENBQVEsS0FBSyxDQUFMLEdBQU8sRUFBZixFQUFrQixLQUFLLENBQUwsR0FBTyxFQUF6QixFQUE0QixDQUE1QixFQUE4QixDQUE5QixFQUFnQyxLQUFLLEVBQUwsR0FBUSxDQUF4QyxFQUEwQyxJQUExQyxFQVgrQixDQVdtQjtBQUNsRCxNQUFJLE1BQUosQ0FBVyxLQUFLLENBQUwsR0FBTyxFQUFsQixFQUFxQixLQUFLLENBQUwsR0FBTyxFQUE1QjtBQUNBLE1BQUksR0FBSixDQUFRLEtBQUssQ0FBTCxHQUFPLEVBQWYsRUFBa0IsS0FBSyxDQUFMLEdBQU8sRUFBekIsRUFBNEIsQ0FBNUIsRUFBOEIsQ0FBOUIsRUFBZ0MsS0FBSyxFQUFMLEdBQVEsQ0FBeEMsRUFBMEMsSUFBMUMsRUFiK0IsQ0FhbUI7QUFDbEQsTUFBSSxNQUFKO0FBQ0QsQ0FmRDs7QUFpQkEsS0FBSyxTQUFMLENBQWUsYUFBZixHQUErQixZQUFXO0FBQ3hDLE1BQUksT0FBTyxJQUFYOztBQUVBLFNBQU8sWUFBVzs7QUFFaEIsUUFBSSxJQUFJLFVBQUosQ0FBZSxFQUFmLENBQUosRUFBd0I7QUFDdEIsV0FBSyxDQUFMO0FBQ0EsV0FBSyxNQUFMO0FBQ0Q7QUFDRCxRQUFJLElBQUksVUFBSixDQUFlLEVBQWYsQ0FBSixFQUF3QjtBQUN0QixXQUFLLENBQUw7QUFDQSxXQUFLLE1BQUw7QUFDRDtBQUNELFFBQUksSUFBSSxVQUFKLENBQWUsRUFBZixDQUFKLEVBQXdCO0FBQ3RCLFdBQUssQ0FBTDtBQUNBLFdBQUssTUFBTDtBQUNEO0FBQ0QsUUFBSSxJQUFJLFVBQUosQ0FBZSxFQUFmLENBQUosRUFBd0I7QUFDdEIsV0FBSyxDQUFMO0FBQ0EsV0FBSyxNQUFMO0FBQ0Q7QUFDRixHQWxCRDtBQW1CRCxDQXRCRDs7QUF3QkEsSUFBSSxPQUFPLElBQUksSUFBSixFQUFYOztBQUdBLFNBQVMsV0FBVCxHQUF1QjtBQUNyQixPQUFJLElBQUksSUFBRSxDQUFWLEVBQWEsSUFBSSxJQUFJLFlBQUosQ0FBaUIsTUFBbEMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsUUFBSSxPQUFPLElBQUksWUFBSixDQUFpQixDQUFqQixDQUFQLElBQStCLFVBQW5DLEVBQ0UsSUFBSSxZQUFKLENBQWlCLENBQWpCO0FBQ0g7QUFDRjs7QUFHRCxTQUFTLElBQVQsR0FBZ0I7QUFDWixNQUFJLE1BQU0sSUFBSSxHQUFkO0FBQ0EsTUFBSSxRQUFRLElBQUksS0FBaEI7O0FBRUEsTUFBSSxTQUFKLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQixJQUFJLE1BQXRCLEVBQTZCLElBQUksTUFBakMsRUFKWSxDQUk4QjtBQUMxQyxNQUFJLElBQUo7O0FBRUEsT0FBSyxJQUFMOztBQUVBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBRSxNQUFNLE1BQXhCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLFFBQUksSUFBSSxNQUFNLENBQU4sQ0FBUjtBQUNBLE1BQUUsSUFBRjtBQUNBLE1BQUUsSUFBRjtBQUNEOztBQUVELE1BQUksU0FBSixHQUFnQiwwQkFBaEI7QUFDQSxNQUFJLFFBQUosQ0FBYSxRQUFRLEtBQUssTUFBYixFQUFvQixDQUFwQixDQUFiLEVBQXFDLElBQUksTUFBSixJQUFjLElBQUUsQ0FBaEIsQ0FBckMsRUFBeUQsRUFBekQ7QUFDQSxNQUFJLFNBQUosR0FBZ0IsMEJBQWhCO0FBQ0EsTUFBSSxRQUFKLENBQWEsZ0NBQWIsRUFDSSxJQUFJLE1BQUosSUFBYyxJQUFFLENBQWhCLENBREosRUFFSSxJQUFJLE1BQUosSUFBYyxJQUFFLENBQWhCLENBRko7O0FBSUEsTUFBSSxPQUFKOztBQUVBLFNBQU8scUJBQVAsQ0FBNkIsSUFBN0I7QUFDSDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkIsR0FBN0IsRUFBa0M7QUFDaEMsTUFBSSxLQUFLLElBQUksQ0FBSixHQUFRLElBQUksQ0FBckI7QUFDQSxNQUFJLEtBQUssSUFBSSxDQUFKLEdBQVEsSUFBSSxDQUFyQjs7QUFFQSxNQUFJLElBQUksS0FBSyxJQUFMLENBQVcsS0FBRyxFQUFKLEdBQVcsS0FBRyxFQUF4QixDQUFSO0FBQ0EsTUFBSSxJQUFJLElBQUksTUFBSixHQUFhLElBQUksTUFBekI7O0FBRUEsTUFBSSxJQUFJLENBQVIsRUFDRSxPQUFPLElBQVAsQ0FERixLQUdFLE9BQU8sS0FBUDtBQUNIOztBQUVELFNBQVMsY0FBVCxHQUEwQjtBQUN4QixNQUFJLFFBQVEsSUFBSSxLQUFoQjs7QUFFQSxPQUFJLElBQUksSUFBRSxDQUFWLEVBQWEsSUFBRSxNQUFNLE1BQXJCLEVBQTZCLEdBQTdCLEVBQWtDO0FBQ2hDLFFBQUksZUFBZSxJQUFmLEVBQXFCLE1BQU0sQ0FBTixDQUFyQixDQUFKLEVBQ0UsS0FBSyxJQUFMO0FBQ0YsUUFBSSxlQUFlLE1BQU0sQ0FBTixDQUFmLEVBQXlCLE1BQU0sQ0FBQyxJQUFFLENBQUgsSUFBTSxNQUFNLE1BQWxCLENBQXpCLENBQUosRUFBeUQ7QUFDdkQsWUFBTSxDQUFOLEVBQVMsRUFBVCxJQUFlLENBQUMsQ0FBaEI7QUFDQSxZQUFNLENBQU4sRUFBUyxFQUFULElBQWUsQ0FBQyxDQUFoQjtBQUNBLFlBQU0sQ0FBTixFQUFTLENBQVQsSUFBYyxNQUFNLENBQU4sRUFBUyxFQUFULEdBQVksQ0FBMUI7QUFDQSxZQUFNLENBQU4sRUFBUyxDQUFULElBQWMsTUFBTSxDQUFOLEVBQVMsRUFBVCxHQUFZLENBQTFCO0FBQ0EsVUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFFLENBQUgsSUFBTSxNQUFNLE1BQWxCLENBQVI7QUFDQSxRQUFFLEVBQUYsSUFBUSxDQUFDLENBQVQ7QUFDQSxRQUFFLEVBQUYsSUFBUSxDQUFDLENBQVQ7QUFDQSxRQUFFLENBQUYsSUFBTyxFQUFFLEVBQUYsR0FBSyxDQUFaO0FBQ0EsUUFBRSxDQUFGLElBQU8sRUFBRSxFQUFGLEdBQUssQ0FBWjtBQUNEO0FBQ0Y7QUFDRjs7QUFHRCxTQUFTLElBQVQsR0FBZ0I7QUFDZCxNQUFJLGFBQUo7QUFBQSxNQUFVLGFBQVY7O0FBRUEsTUFBSSxTQUFTLElBQVQsSUFBaUIsU0FBUyxJQUFULENBQWMsV0FBbkMsRUFBZ0Q7QUFDL0MsV0FBTyxTQUFTLElBQVQsQ0FBYyxXQUFyQjtBQUNBLFdBQU8sU0FBUyxJQUFULENBQWMsWUFBckI7QUFDQTtBQUNELE1BQUksU0FBUyxVQUFULElBQXFCLFlBQXJCLElBQ0YsU0FBUyxlQURQLElBRUYsU0FBUyxlQUFULENBQXlCLFdBRjNCLEVBRXlDO0FBQ3ZDLFdBQU8sU0FBUyxlQUFULENBQXlCLFdBQWhDO0FBQ0EsV0FBTyxTQUFTLGVBQVQsQ0FBeUIsWUFBaEM7QUFDRDtBQUNELE1BQUksT0FBTyxVQUFQLElBQXFCLE9BQU8sV0FBaEMsRUFBNkM7QUFDM0MsV0FBTyxPQUFPLFVBQWQ7QUFDQSxXQUFPLE9BQU8sV0FBZDtBQUNEOztBQUVELE1BQUksS0FBSyxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBVDtBQUNBLEtBQUcsS0FBSCxDQUFTLGtCQUFULElBQStCLGFBQS9CO0FBQ0EsS0FBRyxLQUFILENBQVMsT0FBVCxJQUFvQixLQUFwQjtBQUNBLEtBQUcsS0FBSCxDQUFTLElBQVQsR0FBZ0IsS0FBaEI7QUFDQSxLQUFHLEtBQUgsQ0FBUyxHQUFULEdBQWUsS0FBZjtBQUNBLEtBQUcsS0FBSCxDQUFTLEtBQVQsR0FBaUIsT0FBSyxJQUF0QjtBQUNBLEtBQUcsS0FBSCxDQUFTLE1BQVQsR0FBa0IsT0FBSyxJQUF2QjtBQUNBLEtBQUcsS0FBSCxDQUFTLE9BQVQsR0FBaUIsT0FBakI7O0FBRUEsTUFBSSxRQUFRLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFaO0FBQ0EsUUFBTSxLQUFOLEdBQWMsSUFBZDtBQUNBLFFBQU0sTUFBTixHQUFjLElBQWQ7O0FBRUEsTUFBSSxNQUFKLEdBQWEsSUFBYjtBQUNBLE1BQUksTUFBSixHQUFhLElBQWI7O0FBR0EsTUFBSSxNQUFNLFVBQVYsRUFBc0I7QUFDcEIsUUFBSSxHQUFKLEdBQVUsTUFBTSxVQUFOLENBQWlCLElBQWpCLENBQVY7QUFDQSxRQUFJLEdBQUosQ0FBUSxJQUFSLEdBQWUsWUFBZjs7QUFFQSxTQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBRSxJQUFJLFVBQXBCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLFVBQUksSUFBSSxJQUFJLElBQUosQ0FBUyxJQUFJLEdBQWIsQ0FBUjtBQUNBLFFBQUUsSUFBRjtBQUNBLFVBQUksS0FBSixDQUFVLElBQVYsQ0FBZSxDQUFmO0FBQ0Q7O0FBRUQsU0FBSyxJQUFMOztBQUVBLFdBQU8sU0FBUCxHQUFtQixVQUFTLENBQVQsRUFBWTtBQUM3QixVQUFJLFVBQUosQ0FBZSxFQUFFLEtBQWpCLElBQTBCLElBQTFCO0FBQ0QsS0FGRDtBQUdBLFdBQU8sT0FBUCxHQUFnQixVQUFTLENBQVQsRUFBWTtBQUMxQixVQUFJLFVBQUosQ0FBZSxFQUFFLEtBQWpCLElBQTBCLEtBQTFCO0FBQ0QsS0FGRDtBQUdBO0FBQ0EsV0FBTyxxQkFBUCxDQUE2QixJQUE3QjtBQUNBLGdCQUFZLGNBQVosRUFBMkIsT0FBSyxFQUFoQztBQUNBLGdCQUFZLFdBQVosRUFBd0IsT0FBSyxFQUE3QjtBQUNEO0FBRUY7OztBQzlRRDtBQUNBLE1BQU0sWUFBVztBQUNmOztBQUVBO0FBQ0QsQ0FKRDs7QUFNQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0I7QUFDckIsU0FBTyxTQUFTLENBQUMsSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFjLFdBQWQsS0FBOEIsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUEvQixFQUE2QyxPQUE3QyxDQUFxRCxHQUFyRCxFQUEwRCxHQUExRCxDQUFULEdBQTBFLE9BQWpGO0FBQ0E7O0FBRUQsU0FBUyxXQUFULEdBQXVCO0FBQ3RCLE9BQUssSUFBSSxHQUFULElBQWdCLElBQWhCLEVBQXNCO0FBQ3JCLGFBQVMsY0FBVCxDQUF3QixHQUF4QixFQUE2QixTQUE3QixHQUF5QyxRQUFRLEdBQVIsSUFBZSxLQUFLLEdBQUwsQ0FBeEQ7QUFDQTtBQUNEOztBQUdELFNBQVMsS0FBVCxDQUFlLEVBQWYsRUFBbUI7QUFDakIsTUFBSSxTQUFTLFdBQVQsR0FBdUIsU0FBUyxVQUFULEtBQXdCLFVBQS9DLEdBQTRELFNBQVMsVUFBVCxLQUF3QixTQUF4RixFQUFrRztBQUNoRztBQUNELEdBRkQsTUFFTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7QUFHRCxTQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsU0FBekIsRUFBb0M7QUFDcEMsTUFBSSxHQUFHLFNBQVAsRUFBa0I7QUFDaEIsT0FBRyxTQUFILENBQWEsTUFBYixDQUFvQixTQUFwQjtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUksVUFBVSxHQUFHLFNBQUgsQ0FBYSxLQUFiLENBQW1CLEdBQW5CLENBQWQ7QUFDQSxRQUFJLGdCQUFnQixRQUFRLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBcEI7O0FBRUEsUUFBSSxpQkFBaUIsQ0FBckIsRUFDRSxRQUFRLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENBQTlCLEVBREYsS0FHRSxRQUFRLElBQVIsQ0FBYSxTQUFiOztBQUVGLE9BQUcsU0FBSCxHQUFlLFFBQVEsSUFBUixDQUFhLEdBQWIsQ0FBZjtBQUNEO0FBQ0EiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRGF0YSA9IHtcblx0XCJhYm91dF9tZVwiOiBgXG4gICAgICA8aW1nIHN0eWxlPVwiZmxvYXQ6bGVmdDtwYWRkaW5nOiAwcHggMTVweCAxNXB4IDBweDtcIiBzcmM9XCJpbWFnZXMvZXUuanBnXCIgd2lkaHQ9XCIxMDRcIiBoZWlnaHQ9XCIxMDVcIiAvPlxuICAgICAgPHA+SGksIEknbSBhIHByb2Zlc3Npb25hbCBzb2Z0d2FyZSBkZXZlbG9wZXIsIGludGVyZXN0ZWQgaW4gYSB3aWRlIHJhbmdlIG9mIHRvcGljczogd2ViIGRldmVsb3BtZW50LCBlLWNvbW1lcmNlLCBncmFwaGljcyBwcm9ncmFtbWluZywgYXV0b21hdGVkIHRlc3RpbmcsIGJsb2NrY2hhaW4uLi4uIFlvdSBjYW4gYnJvd3NlIHRocm91Z2ggbXkgcHJldmlvdXMgd29ya3MgaW4gdGhlIG90aGVyIGNvbHVtbi4gIFxuICAgICAgPC9wPlxuXHQ8cD5UaGlzIHdlYnBhZ2UgaXMgaXRzZWxmIGEgZ2FtZS4gWW91IGNhbiBjb250cm9sIHRoZSBtYWluIGNoYXJhY3RlciB0aGF0IGFwcGVhcnMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2NyZWVuIHVzaW5nIHRoZSBjdXJzb3Iga2V5cyBhbmQgaXQgc2hvdWxkIGF2b2lkIGNvbGxpZGluZyB3aXRoIHRoZSBiaWcgZW5lbXkgYmFsbHMuIE1vc3Qgb2YgdGhlIHRleHQgaXMgcmVuZGVyZWQgdXNpbmcgSmF2YXNjcmlwdC4gXG4gICAgICA8cD5cbiAgICAgIFNvbWUgdGltZSBhZ28gSSBzdGFydGVkIHRvIGNvbnRyaWJ1dGUgYW5kL29yIGhlbHBlZCB0byBpbml0aWFsaXplIGEgZmV3IE9wZW4gU291cmNlIHByb2plY3RzLiBQbGVhc2UgZG9uJ3QgaGVzaXRhdGUgb24gY29udGFjdCBtZSBpbiBvcmRlciB0byBjb2xsYWJvcmF0ZSBvciBhc2sgYW55IHF1ZXN0aW9uIGFib3V0IHRoZW0uIFxuICAgICAgPC9wPlxuICAgICAgICA8cD5Zb3UgY2FuIGZpbmQgbWUgb246PC9wPlxuICAgICAgICA8dWwgY2xhc3M9XCJzcXVhcmVcIj5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS9nYWxjaHd5blwiPlR3aXR0ZXI8L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9mYWNlYm9vay5jb20vbWFuZWwudmlsbGFyXCI+RmFjZWJvb2s8L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9odHRwOi8vZXMubGlua2VkaW4uY29tL2luL21hbmVsdmlsbGFyXCIgPkxpbmtlZEluPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0aHViLmNvbS9tYW5lbHZmXCI+R2l0aHViPC9hPjwvbGk+XG5cdCAgPGxpPjxhIGhyZWY9XCJodHRwczovL3d3dy5zbGlkZXNoYXJlLm5ldC9tYW5lbHZpbGxhci9cIj5TbGlkZXNoYXJlPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPk9yIHNpbXBseSBieSBlbWFpbDogPGEgaHJlZj1cIm1haWx0bzptYW5lbHZmQGdtYWlsLmNvbVwiID5tYW5lbHZmQGdtYWlsLmNvbTwvYT48L2xpPlxuICAgICAgICA8L3VsPlxuXHRgLFxuXG5cdFwibGlua3NcIjogYFxuXHQ8cD5Zb3UgbWlnaHQgYmUgaW50ZXJlc3RlZCBpbiBjaGVja2luZyBteSB0ZWNobmljYWwgYmxvZzogPGEgaHJlZj1cImh0dHBzOi8vbWFuZWx2Zi5naXRodWIuaW8vYmxvZ1wiPlRoZSBGYWxsZW4gQXBwbGVzPC9hPi5cblx0PC9wPlxuXHQ8cD5Tb21lIGV4cGVyaW1lbnRzOlxuICAgICAgPHVsIGNsYXNzPVwic3F1YXJlXCI+IDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hbmVsdmYvVHJhbnNib2FyZFwiPlRyYW5zYm9hcmQ8L2E+OiBDb2xsYWJvcmF0aXZlIHRvb2wgZm9yIGFwcGxpY2F0aW9uIGZpbGUgdHJhbnNsYXRpb25zLiBJdCdzIGdvYWwgaXQncyB0byBwcm92aWRlIGEgd2F5IHRvIG9yZ2FuaXplIHRyYW5zbGF0aW9uIHdvcmsgd2hlbiBtdWx0aXBsZSB0cmFuc2xhdG9yZXMgYXJlIGNvbGxhYm9yYXRpbmcgb24gdGhlIHNhbWUgcHJvamVjdC4gQ3VycmVudGx5IDxhIGhyZWY9XCJodHRwOi8vdHJhbnNib2FyZC5tYW5lbHZmLmNvbVwiPmluIHByb2R1Y3Rpb248L2E+LiBbUnVieS9TaW5hdHJhXTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hbmVsdmYvZm9yZXN0YWwyXCI+Rm9yZXN0YWw8L2E+OiB0aGlzIGFwcGxpY2F0aW9uIHdhcyBkZXZlbG9wZWQgYXMgcGFydCBvZiBhIHRpbWJlciBkZWxpdmVyeSBjb21wYW55IGNoYWluIG9mIHRvb2xzLiBJdCdzIG1haW4gZ29hbCBpcyBnb29kcyB0cmFja2luZy4gW1B5dGhvbi9EamFuZ29dIDwvbGk+XG5cdFx0XHQ8L3VsPlxuXG4gICAgICA8cD5NeSA8YSBocmVmPVwiaHR0cDovL2pzMWsuY29tXCI+SlMxSzwvYT4gYW5kIEpTIGRlbW8gZW50cmllczo8L3A+XG4gICAgICA8dWwgY2xhc3M9XCJzcXVhcmVcIj5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vanMxay5jb20vMjAxMC1maXJzdC9kZW1vcyNpZDM4XCI+UHVsc2U8L2E+LiBBIGxpZ2h0IFwicHVsc2FyXCIgbWFkZSBmb3IgdGhlIGZpcnN0IGNvbXBvICgyMDEwKTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2pzMWsuY29tLzIwMTItbG92ZS9kZW1vLzEwMjVcIj5IaWRkZW4gTG92ZTwvYT4uIEVudHJ5IGZvciAyMDEyIGNvbXBvLCB0aGVtZWQgXCJMb3ZlXCI8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tYW5lbHZmLmNvbS9kcm9uZXNcIj5CYXR0bGUgb2YgdGhlIERyb25lczwvYT4uIEVudHJ5IGZvciA8YSBocmVmPVwiaHR0cDovL2x1ZHVtZGFyZS5jb21cIj5MdWR1bSBEYXJlIDI1PC9hPjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICAgIDx1bCBjbGFzcz1cInNxdWFyZVwiPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2h0dHBzOi8vdmltZW8uY29tL2FsYnVtLzkzMjk1XCIgPklsaW9uIFRvb2xzPC9hPjogU29tZSB2aWRlb3MgbWFkZSBmcm9tIHRoZSB0b29scyBkZXZlbG9wZWQgb24gSWxpb24gQW5pbWF0aW9uIFN0dWRpb3MgW0V4dEpTXSAoMjAwNy0yMDA5KS48L2xpPlxuICAgICAgICA8L3VsPlxuXG5cdGBcbn1cbiIsIlxuLy8gcmV0dXJuIC0xIG9yIDFcbmZ1bmN0aW9uIGdldFJhbmRvbVNpZ24oKSB7XG4gIGxldCB2ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgaWYgKHY9PTApIFxuICAgIHJldHVybiAtMTtcbiAgZWxzZSBcbiAgICByZXR1cm4gMTtcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tV2l0aExpbWl0KG1pbixtYXgpIHtcbiAgbGV0IHY7XG5cbiAgZG8ge1xuICAgIC8vIHNlYXJjaCBmb3IgYSBuaWNlIHZhbHVlLiBJZiBub3QgZm91bmQsIHRyeSBhZ2FpblxuICAgIHYgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAobWF4LW1pbikpICsgbWluO1xuICB9IHdoaWxlKCAodiA+IChtYXggKiBBcHAuYm9yZGVyTGltaXQpKSAmJlxuICAgICh2IDwgKG1heCAtIChtYXggKiBBcHAuYm9yZGVyTGltaXQpKSlcbiAgKTtcblxuICByZXR1cm4gdjtcbn1cblxuZnVuY3Rpb24gemVyb3BhZCh2LG4pIHtcbiAgbGV0IHogPSBuIC0gU3RyaW5nKHYpLmxlbmd0aDtcbiAgbGV0IHMgPSBcIlwiO1xuICBmb3IgKGxldCBjID0gMDsgYyA8IHo7IGMrKykge1xuICAgIHMgKz0gXCIwXCI7XG4gIH1cbiAgcmV0dXJuIHMrdjtcbn1cblxuXG5cbmZ1bmN0aW9uIEJhbGwgKGN0eCl7XG4gIHRoaXMuY3R4ID0gY3R4O1xufVxuXG5CYWxsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZHggPSBnZXRSYW5kb21TaWduKCk7XG4gIHRoaXMuZHkgPSBnZXRSYW5kb21TaWduKCk7XG4gIHRoaXMueCA9IGdldFJhbmRvbVdpdGhMaW1pdCgwLCBBcHAuYXZhaWxXKTtcbiAgdGhpcy55ID0gZ2V0UmFuZG9tV2l0aExpbWl0KDAsIEFwcC5hdmFpbEgpO1xuICB0aGlzLnJhZGl1cyA9IDUwO1xufVxuXG5CYWxsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gIGxldCBjdHggPSBBcHAuY3R4O1xuICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDEwMCwgMjU1LCAyMDUsIDAuNSlcIjtcbiAgY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDUwLCAyMDAsIDEwMCwgMC44KVwiO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJKjIsdHJ1ZSk7XG4gIGN0eC5maWxsKCk7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuQmFsbC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnggKz0gdGhpcy5keDtcbiAgdGhpcy55ICs9IHRoaXMuZHk7XG5cbiAgaWYgKCh0aGlzLnggKyB0aGlzLnJhZGl1cykgPiBBcHAuYXZhaWxXKVxuICAgIHRoaXMuZHggPSAtMTtcbiAgZWxzZSBpZiAoKHRoaXMueCAtIHRoaXMucmFkaXVzKSA8IDApIFxuICAgIHRoaXMuZHggPSAxO1xuXG4gIGlmICgodGhpcy55ICsgdGhpcy5yYWRpdXMpID4gQXBwLmF2YWlsSClcbiAgICB0aGlzLmR5ID0gLTE7XG4gIGVsc2UgaWYgKCh0aGlzLnkgLSB0aGlzLnJhZGl1cykgPCAwKSBcbiAgICB0aGlzLmR5ID0gMTtcblxufVxuXG5cbnZhciBBcHAgPSB7XG4gIGJhbGxzOiBbXSxcbiAgbl9vZl9iYWxsczogNSxcbiAga2V5cHJlc3NlZCA6IFtdLFxuICBrZXlMaXN0ZW5lcnMgOiBbXSwgLy8gZnVuY3Rpb25zIHRvIGxpc3RlbiBmb3Iga2V5cyBwcmVzc2VkXG4gIGF2YWlsVzogMCxcbiAgYXZhaWxIOiAwLFxuICBQRVJJT0Q6IDEwMDAvMzAsIC8vIG1pbGxpc2VuY29uZHNcbiAgYm9yZGVyTGltaXQ6ICAwLjI1IC8vIGZvciBuZXcgYmFsbHNcbn1cblxuXG5mdW5jdGlvbiBIZXJvKCkge1xufVxuXG5IZXJvLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucG9pbnRzID0gMDtcbiAgdGhpcy54ID0gQXBwLmF2YWlsVy8yO1xuICB0aGlzLnkgPSBBcHAuYXZhaWxILzI7XG4gIHRoaXMucmFkaXVzID0gNDA7XG4gIGlmICh0aGlzLmtleUV2ZW50KVxuICAgIGRlbGV0ZShBcHAua2V5TGlzdGVuZXJzW3RoaXMua2V5RXZlbnQtMV0pO1xuICB0aGlzLmtleUV2ZW50ID0gQXBwLmtleUxpc3RlbmVycy5wdXNoKHRoaXMuY2hlY2tNb3ZlbWVudCgpKTtcbn1cblxuSGVyby5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICBsZXQgY3R4ID0gQXBwLmN0eDtcbiAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDEwMCwgMTAwLCAwLjUpXCI7XG4gIGN0eC5maWxsUmVjdCgodGhpcy54KSAtIDIwLCAodGhpcy55KSAtIDIwLCA0MCw0MCk7XG4gIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgxNTUsIDUwLCA1MCwgMC44KVwiO1xuICBjdHguc3Ryb2tlUmVjdCgodGhpcy54KSAtIDIwLCAodGhpcy55KSAtIDIwLCA0MCw0MCk7XG5cbiAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMTAwLCAwLjUpXCI7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYyh0aGlzLngsdGhpcy55LDEyLDAsTWF0aC5QSSxmYWxzZSk7ICAgLy8gTW91dGggKGNsb2Nrd2lzZSlcbiAgY3R4Lm1vdmVUbyh0aGlzLngtMTAsdGhpcy55LTEwKTtcbiAgY3R4LmFyYyh0aGlzLngtMTAsdGhpcy55LTEwLDUsMCxNYXRoLlBJKjIsdHJ1ZSk7ICAvLyBMZWZ0IGV5ZVxuICBjdHgubW92ZVRvKHRoaXMueCsxMCx0aGlzLnktMTApO1xuICBjdHguYXJjKHRoaXMueCsxMCx0aGlzLnktMTAsNSwwLE1hdGguUEkqMix0cnVlKTsgIC8vIFJpZ2h0IGV5ZVxuICBjdHguc3Ryb2tlKCk7XG59XG5cbkhlcm8ucHJvdG90eXBlLmNoZWNrTW92ZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcblxuICAgIGlmIChBcHAua2V5cHJlc3NlZFszN10pIHtcbiAgICAgIHRoYXQueC0tOyBcbiAgICAgIHRoYXQucG9pbnRzKys7XG4gICAgfVxuICAgIGlmIChBcHAua2V5cHJlc3NlZFszOV0pIHtcbiAgICAgIHRoYXQueCsrOyBcbiAgICAgIHRoYXQucG9pbnRzKys7XG4gICAgfVxuICAgIGlmIChBcHAua2V5cHJlc3NlZFszOF0pIHtcbiAgICAgIHRoYXQueS0tOyBcbiAgICAgIHRoYXQucG9pbnRzKys7XG4gICAgfVxuICAgIGlmIChBcHAua2V5cHJlc3NlZFs0MF0pIHtcbiAgICAgIHRoYXQueSsrOyBcbiAgICAgIHRoYXQucG9pbnRzKys7XG4gICAgfVxuICB9XG59XG5cbnZhciBoZXJvID0gbmV3IEhlcm8oKTtcblxuXG5mdW5jdGlvbiBkb01vdmVtZW50cygpIHtcbiAgZm9yKHZhciBrPTA7IGsgPCBBcHAua2V5TGlzdGVuZXJzLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKHR5cGVvZihBcHAua2V5TGlzdGVuZXJzW2tdKSA9PSBcImZ1bmN0aW9uXCIpXG4gICAgICBBcHAua2V5TGlzdGVuZXJzW2tdKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBkcmF3KCkge1xuICAgIGxldCBjdHggPSBBcHAuY3R4O1xuICAgIGxldCBiYWxscyA9IEFwcC5iYWxscztcblxuICAgIGN0eC5jbGVhclJlY3QoMCwwLEFwcC5hdmFpbFcsQXBwLmF2YWlsSCk7IC8vIGNsZWFyIGNhbnZhc1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBoZXJvLmRyYXcoKTtcblxuICAgIGZvciAodmFyIGsgPSAwOyBrPGJhbGxzLmxlbmd0aDsgaysrKSB7XG4gICAgICBsZXQgYiA9IGJhbGxzW2tdO1xuICAgICAgYi5tb3ZlKCk7XG4gICAgICBiLmRyYXcoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDEwMCwgMTAwLCAyNTUsIDAuOClcIjtcbiAgICBjdHguZmlsbFRleHQoemVyb3BhZChoZXJvLnBvaW50cyw4KSwgQXBwLmF2YWlsVyAqICgyLzMpLCA0MCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgxMDAsIDEwMCwgMjU1LCAwLjYpXCI7XG4gICAgY3R4LmZpbGxUZXh0KFwiVXNlIHRoZSBBcnJvdyBLZXlzIHRvIFNVUlZJVkUhXCIsXG4gICAgICAgIEFwcC5hdmFpbFcgKiAoMS8zKSxcbiAgICAgICAgQXBwLmF2YWlsSCAqICgyLzMpKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG5mdW5jdGlvbiBjaGVja1Bvc2l0aW9ucyhlbDEsIGVsMikge1xuICB2YXIgZHggPSBlbDEueCAtIGVsMi54O1xuICB2YXIgZHkgPSBlbDEueSAtIGVsMi55O1xuICBcbiAgdmFyIGQgPSBNYXRoLnNxcnQoKGR4KmR4KSArIChkeSpkeSkpO1xuICB2YXIgciA9IGVsMS5yYWRpdXMgKyBlbDIucmFkaXVzO1xuXG4gIGlmIChyID4gZCkgXG4gICAgcmV0dXJuIHRydWU7XG4gIGVsc2VcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTW92ZW1lbnRzKCkge1xuICBsZXQgYmFsbHMgPSBBcHAuYmFsbHM7XG5cbiAgZm9yKGxldCBrPTA7IGs8YmFsbHMubGVuZ3RoOyBrKyspIHtcbiAgICBpZiAoY2hlY2tQb3NpdGlvbnMoaGVybywgYmFsbHNba10pKVxuICAgICAgaGVyby5pbml0KCk7XG4gICAgaWYgKGNoZWNrUG9zaXRpb25zKGJhbGxzW2tdLCBiYWxsc1soaysxKSViYWxscy5sZW5ndGhdKSkge1xuICAgICAgYmFsbHNba10uZHggKj0gLTE7XG4gICAgICBiYWxsc1trXS5keSAqPSAtMTtcbiAgICAgIGJhbGxzW2tdLnggKz0gYmFsbHNba10uZHgqMztcbiAgICAgIGJhbGxzW2tdLnkgKz0gYmFsbHNba10uZHkqMztcbiAgICAgIGxldCBiID0gYmFsbHNbKGsrMSklYmFsbHMubGVuZ3RoXTtcbiAgICAgIGIuZHggKj0gLTE7XG4gICAgICBiLmR5ICo9IC0xO1xuICAgICAgYi54ICs9IGIuZHgqMjtcbiAgICAgIGIueSArPSBiLmR5KjI7XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgbGV0IHdpblcsIHdpbkg7XG5cbiAgaWYgKGRvY3VtZW50LmJvZHkgJiYgZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCkge1xuICAgd2luVyA9IGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGg7XG4gICB3aW5IID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XG4gIH1cbiAgaWYgKGRvY3VtZW50LmNvbXBhdE1vZGU9PSdDU1MxQ29tcGF0JyAmJlxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJlxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aCApIHtcbiAgICB3aW5XID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIHdpbkggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICB9XG4gIGlmICh3aW5kb3cuaW5uZXJXaWR0aCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICB3aW5XID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgd2luSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfVxuXG4gIGxldCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NyZWVuRnJhbWVcIik7XG4gIGVsLnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXSA9IFwidHJhbnNwYXJlbnRcIjtcbiAgZWwuc3R5bGVbXCJjb2xvclwiXSA9IFwicmVkXCI7XG4gIGVsLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICBlbC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICBlbC5zdHlsZS53aWR0aCA9IHdpblcrXCJweFwiO1xuICBlbC5zdHlsZS5oZWlnaHQgPSB3aW5IK1wicHhcIjtcbiAgZWwuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG5cbiAgbGV0IGZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcmFtZVwiKTtcbiAgZnJhbWUud2lkdGggPSB3aW5XO1xuICBmcmFtZS5oZWlnaHQ9IHdpbkg7XG5cbiAgQXBwLmF2YWlsVyA9IHdpblc7XG4gIEFwcC5hdmFpbEggPSB3aW5IO1xuXG5cbiAgaWYgKGZyYW1lLmdldENvbnRleHQpIHtcbiAgICBBcHAuY3R4ID0gZnJhbWUuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIEFwcC5jdHguZm9udCA9IFwiMjBwdCBBcmlhbFwiO1xuXG4gICAgZm9yIChsZXQgaz0wOyBrPEFwcC5uX29mX2JhbGxzOyBrKyspIHtcbiAgICAgIGxldCBiID0gbmV3IEJhbGwoQXBwLmN0eCk7XG4gICAgICBiLmluaXQoKTtcbiAgICAgIEFwcC5iYWxscy5wdXNoKGIpO1xuICAgIH1cblxuICAgIGhlcm8uaW5pdCgpO1xuXG4gICAgd2luZG93Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIEFwcC5rZXlwcmVzc2VkW2Uud2hpY2hdID0gdHJ1ZTtcbiAgICB9XG4gICAgd2luZG93Lm9ua2V5dXA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIEFwcC5rZXlwcmVzc2VkW2Uud2hpY2hdID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyBkcmF3KGN0eCk7IH0sIDEwMDAvMzApO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgc2V0SW50ZXJ2YWwoY2hlY2tNb3ZlbWVudHMsMTAwMC8zMCk7XG4gICAgc2V0SW50ZXJ2YWwoZG9Nb3ZlbWVudHMsMTAwMC8zMCk7XG4gIH0gXG5cbn1cblxuIiwiLy8gaW5pdCBcbnJlYWR5KGZ1bmN0aW9uKCkge1xuICBleHBhbmRfanNvbigpO1xuXG4gIGluaXQoKTtcbn0pO1xuXG5mdW5jdGlvbiBpbnRpdGxlKHN0cikge1xuXHRyZXR1cm4gXCI8aDM+XCIgKyAoc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpKS5yZXBsYWNlKFwiX1wiLCBcIiBcIikgKyBcIjwvaDM+XCI7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZF9qc29uKCkge1xuXHRmb3IgKGxldCBrZXkgaW4gRGF0YSkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGtleSkuaW5uZXJIVE1MID0gaW50aXRsZShrZXkpICsgRGF0YVtrZXldO1xuXHR9XG59XG5cblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50ID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIpe1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsLCBjbGFzc05hbWUpIHtcbmlmIChlbC5jbGFzc0xpc3QpIHtcbiAgZWwuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xufSBlbHNlIHtcbiAgdmFyIGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgdmFyIGV4aXN0aW5nSW5kZXggPSBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcblxuICBpZiAoZXhpc3RpbmdJbmRleCA+PSAwKVxuICAgIGNsYXNzZXMuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpO1xuICBlbHNlXG4gICAgY2xhc3Nlcy5wdXNoKGNsYXNzTmFtZSk7XG5cbiAgZWwuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XG59XG59XG5cbiJdfQ==