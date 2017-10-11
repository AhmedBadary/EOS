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
  	if (sessionStorage.getItem("blob_terrain")) {
      terrain = sessionStorage.getItem("blob_terrain");
    }
    if (sessionStorage.getItem("blob_color_count")) {
      colorCount = JSON.parse(sessionStorage.getItem("blob_color_count"));
    }
    if (sessionStorage.getItem("blob_count")) {
      console.log(sessionStorage.getItem("blob_count"));
      radius = 10 * parseInt(sessionStorage.getItem("blob_count"));
    } else {
      console.log("hi");
      sessionStorage.setItem("blob_count", "3");
    }
  	if (mood !== null && mood !== "null") {
  	  colorCount[colors.indexOf(mood)] += 1;
  	  terrain = terrainFromMood[colors[colorCount.indexOf(Math.max.apply(Math,colorCount))]];
  	  sessionStorage.setItem("blob_terrain", terrain);
  	  sessionStorage.setItem("blob_count", (parseInt(sessionStorage.getItem("blob_count")) + 1) + '');
  	  sessionStorage.setItem("blob_color_count", JSON.stringify(colorCount));
  	  console.log(radius);
  	  console.log(colorCount);
  	  console.log(colors);
  	  console.log(terrain);
  	  console.log(colorCount.indexOf(Math.max.apply(Math,colorCount)));
  	  console.log(Math.max.apply(Math, colorCount));
  	}

  	paper.setup(canvas);
  	var group1 = new paper.Group();
    var path = "M144.64,749.55s0-40.6-17.32-53.29S58.06,658.2,58.06,658.2L40.74,620.13,18.48,584.61s0-27.91,12.37-35.53S70.43,478,68,467.88s14.84-38.06,14.84-38.06,0-43.14,7.42-45.68,34.63-22.84,47-30.45,7.42-7.61,7.42-7.61l22.26-27.91s4.95-35.53,14.84-35.53,19.79,5.08,42.05-35.53S263.37,237,263.37,237l19.79-10.15s22.26,15.23,24.74,33,34.63,22.84,34.63,22.84,47,43.14,56.89,40.6,54.42,0,54.42,0l14.84,5.08,42.05-10.15,44.53,7.61s22.26,33,39.58,38.06S627,401.9,627,401.9L617.11,440l2.47,22.84a98.86,98.86,0,0,0-12.37,25.38c-4.95,15.23,4.95,38.06,4.95,38.06l-14.84,25.38L580,592.22l-2.47,25.38s9.89,25.38-7.42,33-61.84,78.66-61.84,78.66l-9.89,73.59s-47,30.45-56.89,43.14S345,835.83,345,835.83,317.79,790.15,303,790.15s-64.32-27.91-64.32-27.91Z"
    var blob = new paper.Path(path);
    blob.position = paper.view.center;
    group1.addChild(blob);
    paper.project.importSVG("/blob.svg", function(svg) {
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

        if (newX < 250) { newX = 250 }
        if (newX > maxX - 300) { newX = maxX - 300 }
        if (newY < 50 ) { newY = 50 }
        if (newY > maxY - 150) { newY = maxY - 150 }

        pointer.style.top = newX + "px";
        pointer.style.left = newY + "px";
        console.log(pointer.attributes);

        oldX = newX;
        oldY = newY;
        
        remove(Math.floor(newY + 35), Math.floor(newX + 35));
    }

    window.addEventListener('deviceorientation', handleOrientation)
};