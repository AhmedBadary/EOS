//Read query string
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}



var terrainFromMood = { orange: "desert_",
                        yellow: "grass_env",
                        green: "forest_",
                        blue: "tundra_env",
                        purple: "swamp_",
                        red: "lava_env" }
var terrain = null;
var colors = ["orange", "yellow", "green", "blue", "purple", "red"];
var colorCount = [0, 0, 0, 0, 0, 0];

window.onload = function(){
    // Using paper.js to make the landmass
    
  	var canvas = document.getElementById('myCanvas');
  	var mood = getParameterByName('mood');
    var radius = 30;
  	terrain = "forest_";
  	if (sessionStorage.getItem("midguard_terrain")) {
      terrain = sessionStorage.getItem("midguard_terrain");
    }
    if (sessionStorage.getItem("midguard_color_count")) {
      colorCount = JSON.parse(sessionStorage.getItem("midguard_color_count"));
    }
    if (sessionStorage.getItem("midguard_count")) {
      console.log(sessionStorage.getItem("midguard_count"));
      radius = 10 * parseInt(sessionStorage.getItem("midguard_count"));
    } else {
      console.log("hi");
      sessionStorage.setItem("midguard_count", "3");
    }
  	if (mood !== null && mood !== "null") {
  	  colorCount[colors.indexOf(mood)] += 1;
  	  terrain = terrainFromMood[colors[colorCount.indexOf(Math.max.apply(Math,colorCount))]];
  	  sessionStorage.setItem("midguard_terrain", terrain);
  	  sessionStorage.setItem("midguard_count", (parseInt(sessionStorage.getItem("midguard_count")) + 1) + '');
  	  sessionStorage.setItem("midguard_color_count", JSON.stringify(colorCount));
  	  console.log(radius);
  	  console.log(colorCount);
  	  console.log(colors);
  	  console.log(terrain);
  	  console.log(colorCount.indexOf(Math.max.apply(Math,colorCount)));
  	  console.log(Math.max.apply(Math, colorCount));
  	}

  paper.setup(canvas);
  var group1 = new paper.Group();
  var path = "M113.56,517.2l-.32-21.37,24.26-32.41s27.2-9.75,37.45-20.59c0,0,19.39-9.64,28.64-.42L226.78,426s5.5,20,23.53,6.33,52.64-50.2,67-46.4,32.07-32.53,32.07-32.53l54.45-15.5s54.54,13.89,70.21,5.64S552,317.8,552,317.8s31.9-44,62.09-27c0,0-13,4.2-16.7,14.94s-16.53,27-24.26,32.41-19.37,11-23.06,25.72a57.76,57.76,0,0,0,.41,28s-14.22,6.89-4.93,18.77c0,0-2.5,6.72,13.29,18.5s21.26,29.07,21.26,29.07,10.71,19.88,18.56,22.43,12.27,37.22,12.27,37.22-17.77,31-15,41.63-2,37.8-2,37.8l-31.56,66.88s-23.21,15-29.56,25.81-20.31,35-38.56,34S456,692.45,439,691.36s-29.44,33.88-29.44,33.88-7.53,18.76-14,20.19-21.25,33.7-18.78,37.67-28,56.51-28,56.51l-79.3,7.85s-28.78-8.92-41.81-10.07S117.84,807,117.84,807s9-6.81-.34-22.7,2.17-29.42,5.8-48.17,20.63-13.66-84.71-93.58c0,0,9-8.15-.47-32l-.32-21.37s26-3.14,29.7-16.51,9.86-37.5,17.59-43S105.69,513.31,113.56,517.2Z"
  var midguard = new paper.Path(path);
  midguard.position = paper.view.center;
  group1.addChild(midguard);
  paper.project.importSVG("/midguard.svg", function(svg) {
    svg.clipMask = true;
  });
    var texture = new paper.Raster("http://final-project-zeegeeko.c9users.io/environments/" + terrain + Math.round(1 + Math.random())+ ".png");
  texture.position = paper.view.center;
  group1.addChild(texture);
  group1.clipped = true;

  var group2 = new paper.Group();
  var ctx = document.getElementById('fogCanvas').getContext('2d');
  var fogImage = document.getElementById('fogImg');
  var fog = ctx.drawImage(fogImage, -280, 0);
  var r = radius * radius;

  group2.addChild(fog);
  group2.clipped = true;

  var imageData = ctx.getImageData(0, 0, fogCanvas.width, fogCanvas.height);
  var data = imageData.data.slice();
  var remove = function(xVal, yVal) {
    var newData = data.slice();

    for (var m = xVal - radius; m < xVal + radius; m++) {
      x = (m - xVal) * (m - xVal);
      for (var n = yVal - radius; n < yVal + radius; n++) {
        y = n - yVal;
        z = x + y * y;
        if (z < r) {
          i = m + fogCanvas.width * n;
          newData[i * 4 + 3] = 0; //255 * z / (r);
        }
      }
    }
    ctx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
    imageData.data = newData.slice();
    var newImageData = new ImageData(newData, imageData.width, imageData.height);
    ctx.putImageData(newImageData, 0, 0, 0, 0, fogCanvas.width, fogCanvas.height);
  };

  var pointer = document.querySelector('.pointer');
  var maxX = 1136;
  var maxY = 640;
  var oldX = maxX / 2;
  var oldY = maxY / 2;


  function handleOrientation(event) {
    var x = event.beta;
    var y = event.gamma;
    var newX = (oldX + x / 3); // change denominator to modify speed
    var newY = (oldY + y / 3); //change denominator to modify speed

    if (newX < 300) { newX = 300 }
    if (newX > maxX - 350) { newX = maxX - 350 }
    if (newY < 50) { newY = 50 }
    if (newY > maxY - 150) { newY = maxY - 150 }

    pointer.style.top = newX + "px";
    pointer.style.left = newY + "px";

    oldX = newX;
    oldY = newY;

    remove(Math.floor(newY + 35), Math.floor(newX + 35));
  }

  window.addEventListener('deviceorientation', handleOrientation)

  var onlongtouch;
  var timer, lockTimer;
  var touchduration = 800; //length of time we want the user to touch before we do something

  function touchstart(e) {
    e.preventDefault();
    if (lockTimer) {
      return;
    }
    timer = setTimeout(onlongtouch, touchduration);
    lockTimer = true;
  }

  function touchend() {
    //stops short touches from firing the event
    if (timer) {
      clearTimeout(timer); // clearTimeout, not cleartimeout..
      lockTimer = false;
    }
  }

  onlongtouch = function() {
    navigator.vibrate(1000);
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    window.addEventListener("touchstart", touchstart, false);
    window.addEventListener("touchend", touchend, false);
  });

};
