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
  	if (sessionStorage.getItem("moon_terrain")) {
      terrain = sessionStorage.getItem("moon_terrain");
    }
    if (sessionStorage.getItem("moon_color_count")) {
      colorCount = JSON.parse(sessionStorage.getItem("moon_color_count"));
    }
    if (sessionStorage.getItem("moon_count")) {
      console.log(sessionStorage.getItem("moon_count"));
      radius = 10 * parseInt(sessionStorage.getItem("moon_count"));
    } else {
      console.log("hi");
      sessionStorage.setItem("moon_count", "3");
    }
  	if (mood !== null && mood !== "null") {
  	  colorCount[colors.indexOf(mood)] += 1;
  	  terrain = terrainFromMood[colors[colorCount.indexOf(Math.max.apply(Math,colorCount))]];
  	  sessionStorage.setItem("moon_terrain", terrain);
  	  sessionStorage.setItem("moon_count", (parseInt(sessionStorage.getItem("moon_count")) + 1) + '');
  	  sessionStorage.setItem("moon_color_count", JSON.stringify(colorCount));
  	  console.log(radius);
  	  console.log(colorCount);
  	  console.log(colors);
  	  console.log(terrain);
  	  console.log(colorCount.indexOf(Math.max.apply(Math,colorCount)));
  	  console.log(Math.max.apply(Math, colorCount));
  	}

  	paper.setup(canvas);
  	var group1 = new paper.Group();
    var path = "M66.44,572.49l-25.31-8.79s2.77-8.49-4.07-29.3S34.57,483,34.57,483s26.68-58.79,36.21-62.1,23.59,2.53,32-8.74S126.14,372,131.19,371s28.08.3,38.15-7.54,52.62-34.65,64.3-59c0,0,46-8.59,57.75-18.69s4.39-22.11,25.16-22.45,75.27,5.36,75.27,5.36,19.61-8.31,33.68-2.48,29.91,32.13,48.5,44.26,82.11,27.59,88.36,43-.95,37.48,12.62,56.38,21,50.79,31.69,52.6c0,0-9.28,57.27-13.19,60.64s2.37,27.29,2.37,27.29L573,583.07,541.7,624.2s-24.13,2-26.28,23,5.31,55.73-5.82,75.49-29.54,47.4-29.54,47.4-26.35,8.8-37.08-4.38c0,0-3.32,10.19-19.06,6.61s-48.31-4.5-60.63,1.62-47.18-2.21-47.18-2.21-12.88,7.81-20.76,3.18-8.49-14.29-25.32-11.63c0,0,26.3-20.17,30.2-26.37s27.51-.84,29.13-14.46l51.43-48.3s26.66-61.63,22.66-78.15-14.18-31.4-14.18-31.4L386.91,543s-11.31-17.16-41-12.37a193.34,193.34,0,0,1-53.9,1.12s-13.39,18-17.91,11.74S259.38,528,245.91,529l-8.54-25.66-21.42-17.84L194.58,479s-20.83-11-32.56,1.92c0,0-14.06-5.83-20.19,4.33s-35.21,36-39.65,46.72c0,0-12.36-2.41-16.82,5.5S61.32,559.37,66.44,572.49Z"
    var moon = new paper.Path(path);
    // moon.fillColor = 'red';
    moon.position = paper.view.center;
    group1.addChild(moon);
    paper.project.importSVG("/moon.svg", function(svg) {
      svg.clipMask = true;
    });
    var texture = new paper.Raster("http://final-project-zeegeeko.c9users.io/environments/" + terrain + Math.round(1 + Math.random())+ ".png");
    texture.position = paper.view.center;
    group1.addChild(texture);
    group1.clipped = true;
    
    // var fCanvas = document.getElementById('fogCanvas');
    // paper.setup(fCanvas);
    
    var group2 = new paper.Group();
    // var fog = new paper.Raster("http://final-project-zeegeeko.c9users.io/land_fog.png");
    // fog.position = paper.view.center;
    
    // var img = new Image();
    // img.src = 'http://final-project-zeegeeko.c9users.io/land_fog.png';
    // img.onload = function() {
    //   draw(this);
    // };
    
    var ctx = document.getElementById('fogCanvas').getContext('2d');
    var fogImage = document.getElementById('fogImg');
    var fog = ctx.drawImage(fogImage, -280, 0);
    
    var pointlight = new paper.Path.Circle(new paper.Point(50, 70), radius);
    pointlight.strokeColor = 'black';
    pointlight.position = paper.view.center;

    group2.addChild(fog);
    group2.addChild(pointlight);
    group2.clipped = true;
    console.log(pointlight);
    
    // ctx.beginPath();
    // ctx.arc(50, 70, 30, 0, Math.PI * 2, true);
    // ctx.closePath();
    // ctx.globalCompositeOperation='destination-out';
    // ctx.fill();
    // ctx.globalCompositeOperation='source-over';
    var imageData = ctx.getImageData(0, 0, fogCanvas.width, fogCanvas.height);
    var data = imageData.data.slice();
    var r = radius * radius;
    var remove = function(xVal, yVal) {
      // for (var i = 0; i < data.length; i += 4) {
      //   imageData.data[i + 2] = 255;
      // }
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
      //ctx.drawImage(fogCanvas, 500, 500);
    };
    //setTimeout(function() {remove(360, 550);}, 1000);
    // setTimeout(function() {remove(560, 550);}, 2000);

    
    var pointer = document.querySelector('.pointer');
    var maxX = 1136//window.innerHeight - pointer.clientWidth;
    var maxY = 640//window.innerWidth - pointer.clientHeight;
    var oldX = maxX / 2;
    var oldY = maxY / 2;

    function handleOrientation(event) {
        var x = event.beta;
        var y = event.gamma;
        var newX = (oldX + x / 3); // change denominator to modify speed
        var newY = (oldY + y / 3); //change denominator to modify speed

        if (newX < 0 + 300) { newX = 300 }
        if (newX > maxX - 300) { newX = maxX - 300 }
        if (newY < 50 ) { newY = 50 }
        if (newY > maxY - 150) { newY = maxY - 150 }

        pointer.style.top = newX + "px";
        pointer.style.left = newY + "px";

        oldX = newX;
        oldY = newY;
        // console.log("here: ", newX, newY);
        remove(Math.floor(newY + 35), Math.floor(newX + 35));
        
        // setTimeout(function(){remove(newY + 35, newX + 35);},1000);
    }

    window.addEventListener('deviceorientation', handleOrientation)
};