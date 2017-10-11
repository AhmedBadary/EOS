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
  	if (sessionStorage.getItem("bird_terrain")) {
      terrain = sessionStorage.getItem("bird_terrain");
    }
    if (sessionStorage.getItem("bird_color_count")) {
      colorCount = JSON.parse(sessionStorage.getItem("bird_color_count"));
    }
    if (sessionStorage.getItem("bird_count")) {
      console.log(sessionStorage.getItem("bird_count"));
      radius = 10 * parseInt(sessionStorage.getItem("bird_count"));
    } else {
      console.log("hi");
      sessionStorage.setItem("bird_count", "3");
    }
  	if (mood !== null && mood !== "null") {
  	  colorCount[colors.indexOf(mood)] += 1;
  	  terrain = terrainFromMood[colors[colorCount.indexOf(Math.max.apply(Math,colorCount))]];
  	  sessionStorage.setItem("bird_terrain", terrain);
  	  sessionStorage.setItem("bird_count", (parseInt(sessionStorage.getItem("bird_count")) + 1) + '');
  	  sessionStorage.setItem("bird_color_count", JSON.stringify(colorCount));
  	  console.log(radius);
  	  console.log(colorCount);
  	  console.log(colors);
  	  console.log(terrain);
  	  console.log(colorCount.indexOf(Math.max.apply(Math,colorCount)));
  	  console.log(Math.max.apply(Math, colorCount));
  	}

  	paper.setup(canvas);
  	var group1 = new paper.Group();
    var path = "M234,869.05s2.59,13.55,5.64,30.2,7.1,44.52,3.36,48.77-28.33,19.3-28.33,19.3-21.63-7.39-29.56-2-24.92,0-47.8,5.33-36.58-7.42-29.77-29.08,13.41-53.39,13.41-53.39l12-28.57,29.42-8.13s27.88-22.4,26.19-29.75-3.59-41.81,4.36-64.24,31.31-58.77,31.31-58.77l10.79-32.88s16.78-21.64,20.41-30.93,5.35-36-.53-42.19-36.67-29.48-37.34-42.65c0,0-38-21.75-48-21.76s-19-10.87-53.12-9.78L81.74,460.43s-18.66-29.84-24.43-48-9.15-32.92,1.18-51.86c0,0,21.19-12.73,39.2-13.09s26.52-14.66,40.34-13.86,30.34,20.18,41.33,14.4,34.22-13.1,41.24-7.66,29,10.89,42,10.53,28.77.83,37.85-22.38,7.62-37.53-4.37-60,19.19-52.22,19.19-52.22l65.35,8.25s41.58-9.6,55.51-3.77,25.12,27.14,70,44.25l32,27.54,49.48,19.06s13.93,5.83,16.63,24.42,11.52,36.4-5.15,63.08-17.4,81.63-17.4,81.63l23.84,74s6.54,36.39,6,45.3-7.5,25.53,2,39.48l9.5,14-17.92,22.42s-14.83-12-58.8,11.11-44.09,35.14-44.09,35.14S472.62,754.16,447.12,763s-48.86,45.19-48.86,45.19-16.77,4.61-29.7,27c0,0-10.87-6.21-28.21,7.3L323,856.06s-28.54-7.79-44.17-4-16.66,9.65-31.61,9.62S234,869.05,234,869.05Z"
    var bird = new paper.Path(path);
    bird.position = paper.view.center;
    group1.addChild(bird);
    paper.project.importSVG("/bird.svg", function(svg) {
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
            newData[i * 4 + 3] = Math.min(255 * z / (r), newData[i * 4 + 3]);
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

        if (newX < 200) { newX = 200 }
        if (newX > maxX - 300) { newX = maxX - 300 }
        if (newY < 50 ) { newY = 50 }
        if (newY > maxY - 150) { newY = maxY - 150 }

        pointer.style.top = newX + "px";
        pointer.style.left = newY + "px";

        oldX = newX;
        oldY = newY;
        
        remove(Math.floor(newY + 35), Math.floor(newX + 35));
    }

    window.addEventListener('deviceorientation', handleOrientation)
};