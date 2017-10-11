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
  	if (sessionStorage.getItem("head_terrain")) {
      terrain = sessionStorage.getItem("head_terrain");
    }
    if (sessionStorage.getItem("head_color_count")) {
      colorCount = JSON.parse(sessionStorage.getItem("head_color_count"));
    }
    if (sessionStorage.getItem("head_count")) {
      console.log(sessionStorage.getItem("head_count"));
      radius = 10 * parseInt(sessionStorage.getItem("head_count"));
    } else {
      console.log("hi");
      sessionStorage.setItem("head_count", "3");
    }
  	if (mood !== null && mood !== "null") {
  	  colorCount[colors.indexOf(mood)] += 1;
  	  terrain = terrainFromMood[colors[colorCount.indexOf(Math.max.apply(Math,colorCount))]];
  	  sessionStorage.setItem("head_terrain", terrain);
  	  sessionStorage.setItem("head_count", (parseInt(sessionStorage.getItem("head_count")) + 1) + '');
  	  sessionStorage.setItem("head_color_count", JSON.stringify(colorCount));
  	  console.log(radius);
  	  console.log(colorCount);
  	  console.log(colors);
  	  console.log(terrain);
  	  console.log(colorCount.indexOf(Math.max.apply(Math,colorCount)));
  	  console.log(Math.max.apply(Math, colorCount));
  	}

  	paper.setup(canvas);
  	var group1 = new paper.Group();
    var path = "M121.76,228.95s11.51-8.44,19.18-36.68c0,0,15.34,8.57,21.09,0s-13.42,5.9,28.76,18.34,111.22,2.6,130.4,18.34,38.35,41.31,71,45.25S465,293.86,465,293.86s33.17,33.44,63.57,45.25S553.22,408,553.22,423.7s-13.42,84.59-13.42,84.59l13.86,45.25s-13.86,21.64-11.94,47.21-3.26,53.11-13.14,62.95,1.63,64.92,9.3,70.82.57,47.21-9.3,66.88-1.34,49.18,25.08,62.95S582,905.66,582,905.66L605,947s-51.21-68.85-76.42-45.25S489.94,947,489.94,947s-23-23.61-80.54-23.61S353.79,895.82,350,874.18s15.34-61-32.6-88.52-99.72-25.57-111.22-51.15-13.42-44.15-23-56.5-11.51-32-3.84-49.73-76.71-39.34-76.71-39.34S70,561.4,54.64,557.47s1.92-55.08,0-70.82,4.44-43.28-6.41-64.92-23.67-33.44,0-64.92,56.27-64.92,56.27-80.65S121.76,228.95,121.76,228.95Z"
    var head = new paper.Path(path);
    // head.fillColor = 'red';
    head.position = paper.view.center;
    group1.addChild(head);
    paper.project.importSVG("/head.svg", function(svg) {
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