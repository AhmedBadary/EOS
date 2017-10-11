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
  	if (sessionStorage.getItem("islands_terrain")) {
      terrain = sessionStorage.getItem("islands_terrain");
    }
    if (sessionStorage.getItem("islands_color_count")) {
      colorCount = JSON.parse(sessionStorage.getItem("islands_color_count"));
    }
    if (sessionStorage.getItem("islands_count")) {
      console.log(sessionStorage.getItem("islands_count"));
      radius = 10 * parseInt(sessionStorage.getItem("islands_count"));
    } else {
      console.log("hi");
      sessionStorage.setItem("islands_count", "3");
    }
  	if (mood !== null && mood !== "null") {
  	  colorCount[colors.indexOf(mood)] += 1;
  	  terrain = terrainFromMood[colors[colorCount.indexOf(Math.max.apply(Math,colorCount))]];
  	  sessionStorage.setItem("islands_terrain", terrain);
  	  sessionStorage.setItem("islands_count", (parseInt(sessionStorage.getItem("islands_count")) + 1) + '');
  	  sessionStorage.setItem("islands_color_count", JSON.stringify(colorCount));
  	  console.log(radius);
  	  console.log(colorCount);
  	  console.log(colors);
  	  console.log(terrain);
  	  console.log(colorCount.indexOf(Math.max.apply(Math,colorCount)));
  	  console.log(Math.max.apply(Math, colorCount));
  	}

  	paper.setup(canvas);
  	var group1 = new paper.Group();
  	var islands = new paper.Group();
  	
  	var path1 = "M40.9,587.5c0,0-36.8-26.6-24-70.9s22-23.2,43.2-57.3s28.2-49,28.2-49l-13-20.9c0,0-8.4-72,5.5-98.3,s71.6-41,71.6-41L178,223l27.2-1.8c0,0,14.6-15.5,47.3,7.8s2.3,36.1,75.9,27.6s50.1-10.6,50.1-10.6s54-10.8,95.8,33.6,s19.2-4.9,60.3,28.6l41.1,33.5c0,0-4.8-14.2,16.7,17s19,53.2,19,53.2L589,428c-19.1,11.1-39.5,19.8-60.8,25.8,C493.6,463.3,495,485,495,485l-30.9,5.7l-54,10.8c0,0-18.8,12.1-32.5,42s-40.7,35.3-40.7,35.3s-8.3,54.9-90.1,56.7,s-33.6,24-98.1-8s-80.4-38.2-80.4-38.2L40.9,587.5z"
    var island1 = new paper.Path(path1);
    
    var path2 = "M393.1,230.6l-27.9-9c0,0,2.5-21.9-2.3-36.1s25.6-27.1,25.6-27.1s34.8-5.9,52.1-39.7,c22-23.2,34.5,52.1,34.5,52.1s42.3-10,53.2,40c9.6,28.4,17.8,35.1,2.9,47s-42.8,2.8-42.8,2.8l-19.4,1.3,C469.3,261.9,427.9,224.7,393.1,230.6z"
    var island2 = new paper.Path(path2);

    var path3 = "M475.2,605.9c0,0-31.3-1.6-25.8-38.2s20.4-48.5,20.4-48.5l27.2-1.8c0,0,10.5-18.8,48-43.1,c22.2-19.6,38.9-2.6,38.9-2.6s25.9-23.5,44.2-42.8c8.5,10.3-12.6,48-12.6,48s14.8,49.8,4.5,72.2s-22.6,12.4-22.6,12.4,s-0.3,58-50.3,68.6C478.2,652.9,475.2,605.9,475.2,605.9z"
    var island3 = new paper.Path(path3);
    
    var path4 = "M116.5,734.8l-1.1-18.1l29.1-34.5l39.5,8.3c0,0,67.9-37.1,131.5-19.6s80.9,45.4,80.9,45.4s16.9,20.6,2,32.5,s25.1,27.3-26.6,74.3c-22.2,19.6-35,2.3-35,2.3l-33.4-34.1l-38.4,9.8c0,0-27,5.4-69.3,15.5c-15.6,1-61.2-43.1-77.9-60.1,S116.5,734.8,116.5,734.8z"
    var island4 = new paper.Path(path4);
    
    var path5 = "M235,944.5c0,0,2.6-83.6,17.7-91.8s49.8-14.2,86.2,5.2c42.3-10,73.4-12.1,73.4-12.1l11.9,2.8,c0,0-6.2,25.8,2.7,43.3s-56.7,29.1-56.7,29.1l-18.5,15.7L332.9,949l-23.3,1.5l-14.2,22.7l-23.3,1.5L235,944.5z"
    var island5 = new paper.Path(path5);
    
    islands.addChildren([island1, island2, island3, island4, island5]);
    islands.position = paper.view.center;
    
    
    
    group1.addChild(islands);
    paper.project.importSVG("/islands.svg", function(svg) {
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