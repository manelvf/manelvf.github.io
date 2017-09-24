// init 
ready(function() {
  expand_json();

  init();
});

function intitle(str) {
	return "<h3>" + (str.charAt(0).toUpperCase() + str.slice(1)).replace("_", " ") + "</h3>";
}

function expand_json() {
	for (let key in Data) {
		document.getElementById(key).innerHTML = intitle(key) + Data[key];
	}
}


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

