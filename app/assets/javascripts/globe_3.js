function initialize() {
    var options = {atmosphere: true, center: [0, 0], zoom: 0};
    var earth = new WE.map('earth_div', options);
    WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 5,
      attribution: 'NASA'
    }).addTo(earth);
}

var terrainFromMood = { orange: "desert_1", orange: "desert_2", orange: "desert_3",
                        yellow: "grass_env1", yellow: "grass_env2", yellow: "grass_env3",
                        green: "forest_1", green: "forest_2",
                        blue: "tundra_env1", blue: "tundra_env2",
                        purple: "swamp_1", purple: "swamp_2",
                        red: "lava_env1", red: "lava_env2" }

window.landSelected = false;

function rMenuSelect(val){
    window.moods[window.locSelect] = val;
    document.querySelector('.menu').style.zIndex = "-1";
    console.log(window.moods);

}

$(document).ready(function() {
    $(".slice").click(function(){
        console.log($(this).attr('id'))
        window.moods[window.locSelect] = $(this).attr('id');
        document.querySelector(".menu").style.zIndex = "-1";
    })
    // $("#but").on("click", function(event) {  // Select the Button
    //     event.preventDefault();
    //     var controls = new THREE.TrackballControls(camera);
    //     index = $("#form").attr("z-index");
    //     if (parseInt(index) > 0) {
    //         $("#form").attr("z-index", "-1");
    //         $("#form").css("z-index", "-1");
    //     } else {
    //         $("#form").attr("z-index", "3");
    //         $("#form").css("z-index", "3");
    //     }
    //     });
        
    function labelPath(pathObj, text, textattr) {
        if (textattr == undefined)
            textattr = { 'font-size': 30, fill: '#b5ff66', stroke: 'none', 'font-family': 'cursive', 'font-weight': 400 };
        var bbox = pathObj.getBBox();
        console.log(bbox)
        if (text.includes("Will") || text.includes("Ariel")) {
            var textObj = pathObj.paper.text(bbox.x + bbox.width / 2 + 16, bbox.y + bbox.height / 2 - 5, text).attr(textattr);
        }
        else if (text.includes("Emanuel")) {
            textattr["fill"] = '#0dc955';
            var textObj = pathObj.paper.text(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2 + 5, text).attr(textattr);
        }
        else {
            var textObj = pathObj.paper.text(bbox.x + bbox.width / 2 + 2, bbox.y + bbox.height / 2, text).attr(textattr);
        }
        return textObj;
    }
    
    // pth1 = W.path("M343.1,74.5c0,0,4.4-3.1,7.3-13.6c0,0,5.8,3.2,8,0c2.2-3.2-5.1,2.2,10.9,6.8c16,4.6,42.1,1,49.4,6.8        c7.3,5.8,14.5,15.3,26.9,16.7c12.3,1.5,27.6,7.3,27.6,7.3s12.6,12.4,24.1,16.7c11.5,4.4,9.3,25.5,9.3,31.3s-5.1,31.3-5.1,31.3        l5.2,16.7c0,0-5.2,8-4.5,17.5c0.7,9.5-1.2,19.6-5,23.3c-3.7,3.6,0.6,24,3.5,26.2c2.9,2.2,0.2,17.5-3.5,24.7        c-3.7,7.3-0.5,18.2,9.5,23.3c10,5.1,10.7,15.3,10.7,15.3L526,340c0,0-19.4-25.5-28.9-16.7c-9.5,8.7-14.6,16.7-14.6,16.7        s-8.7-8.7-30.5-8.7s-21.1-10.2-22.5-18.2s5.8-22.5-12.3-32.7c-18.1-10.2-37.8-9.5-42.1-18.9s-5.1-16.3-8.7-20.9        c-3.6-4.6-4.4-11.8-1.5-18.4c2.9-6.5-29-14.5-29-14.5s-12.3-10.2-18.1-11.6c-5.8-1.5,0.7-20.4,0-26.2c-0.7-5.8,1.7-16-2.4-24        c-4.1-8-9-12.4,0-24c9-11.6,21.3-24,21.3-29.8S343.1,74.5,343.1,74.5z")
    // pth2 = W.path("M892.8,153.4l-11.2-11.2c0,0,3.7-3.7,5.6-16.4s12.3-27.5,12.3-27.5s29.8-23.8,35.7-23.1c6,0.7,11.9,7.4,19.3,3.7 c7.4-3.7,23.1-14.9,26-14.1c3,0.7,14.9,7.4,22.3,6s37.2-4.5,49.9-14.1c0,0,26.8,7.4,35.7,5.2s8.2-10.4,19.3-5.2 s38.7,22.3,38.7,22.3s12.6,0.7,18.6,7.4s7.4,24.6,14.1,35.7c6.7,11.2,36.5,35.7,35.7,45.4c-0.7,9.7-10.4,19.3-8.2,32.7 s-2.2,32,3,35.7c0,0-20.1,27.5-23.1,28.3c-3,0.7-6,14.9-6,14.9l-20.8,11.2l-27.5,13.4c0,0-13.4-5.2-20.1,5.2s-11.9,30.5-23.1,37.9 c-11.2,7.4-28.3,17.1-28.3,17.1s-16.4-2.2-18.6-11.9c0,0-4.5,4.5-11.9-1.5c-7.4-6-24.6-14.9-32.7-14.9c-8.2,0-24.6-13.4-24.6-13.4 s-8.9,0.7-11.9-3.7c-3-4.5-0.7-9.7-10.4-12.6c0,0,19.3-3.7,23.1-6c3.7-2.2,14.9,6.7,19.3,0l40.2-11.9c0,0,30.5-25.3,32.7-35 c2.2-9.7,0.7-20.1,0.7-20.1l4.5-11.9c0,0-1.5-11.9-18.6-17.1c-17.1-5.2-29-13.4-29-13.4s-11.9,6-12.6,1.5 c-0.7-4.5-3.7-11.9-11.2-14.9l2.2-15.6l-6.7-14.9l-9.7-8.9c0,0-8.2-11.2-17.9-7.4c0,0-6-6.7-11.9-3c-6,3.7-28.3,9.7-33.5,14.1 c0,0-6-4.5-10.4-1.5S893.6,145.2,892.8,153.4z");
    // pth3 = W.path("M1106.5,593.8c0,0-2.6,5.9-5.9,13.2c-3.3,7.2-9.2,19.1-11.8,19.7c-2.6,0.7-16.5,0-16.5,0s-6.6-8.6-11.2-8.6 c-4.6,0-9.9-6.6-20.4-10.5c-10.5-3.9-12.5-12.5-3.9-19.1c8.6-6.6,19.7-17.1,19.7-17.1l12.5-7.9l13.9,4.6c0,0,17.1-1.3,18.4-4.6 c1.3-3.3,9.9-17.1,19.1-23.7c9.2-6.6,28.3-14.5,28.3-14.5l13.2-9.9c0,0,12.5-3.9,16.5-6.6s11.8-12.5,11.2-16.5 c-0.7-3.9-6.6-21.1-3.3-26.3c0,0-9.2-18.4-13.2-21.1s-4.6-9.2-18.4-17.8l2-31.6c0,0,0.7-16.5,3.3-25c2.6-8.6,5.3-15.1,14.5-19.7 c0,0,11.8,0.7,19.1,5.3s14.5,1.3,19.7,5.3c5.3,3.9,6.6,15.8,12.5,16.5c5.9,0.7,17.1,3.9,18.4,7.9c1.3,3.9,8.6,11.8,13.8,15.1 s11.2,7.9,21.1,1.3c9.9-6.6,13.2-12.5,14.5-24.3c1.3-11.8,21.7-15.1,21.7-15.1l23.7,20.4c0,0,19.1,7.2,23,13.2 c3.9,5.9,2.6,17.1,15.8,35.5l5.3,19.1l14.5,20.4c0,0,3.9,5.9,0,13.8c-3.9,7.9-5.3,17.1-19.1,23c-13.8,5.9-29,27-29,27l-10.5,34.9 c0,0-7.2,15.8-9.9,19.1c-2.6,3.3-9.9,7.9-9.9,15.8c0,7.9,0,7.9,0,7.9l-13.2,3.9c0,0-2.6-8.6-26.3-11.2c-23.7-2.6-27,2-27,2 s-20.4,4.6-32.9,1.3c-12.5-3.3-31.6,4.6-31.6,4.6s-7.9-2.6-19.1,2.6c0,0-2.6-5.3-13.2-4.6c-10.5,0.7-10.5,0.7-10.5,0.7 s-9.2-10.5-16.5-13.2c-7.2-2.6-9.2-0.7-15.1-4.6C1107.8,590.5,1106.5,593.8,1106.5,593.8z")
    // pth4 = W.path("M562.3,376.9v-11.6l13.7-17.4c0,0,15.2-5.1,21-10.9c0,0,10.9-5.1,15.9,0l13-8.7c0,0,2.9,10.9,13,3.6 c10.1-7.2,29.7-26.8,37.6-24.6c8,2.2,18.1-17.4,18.1-17.4l30.4-8c0,0,30.2,8,39,3.6c8.8-4.3,43.5-13.3,43.5-13.3 s18.1-23.6,34.7-14.2c0,0-7.2,2.2-9.4,8c-2.2,5.8-9.4,14.5-13.7,17.4s-10.9,5.8-13,13.7c-2.2,8,0,15.2,0,15.2s-8,3.6-2.9,10.1 c0,0-1.4,3.6,7.2,10.1s11.6,15.9,11.6,15.9s5.8,10.9,10.1,12.3c4.3,1.4,6.5,20.3,6.5,20.3s-10.1,16.6-8.7,22.4s-1.4,20.5-1.4,20.5 l-18.1,36c0,0-13,8-16.6,13.7c-3.6,5.8-11.6,18.8-21.7,18.1c-10.1-0.7-21-17.4-30.4-18.1c-9.4-0.7-16.6,18.1-16.6,18.1 s-4.3,10.1-8,10.8c-3.6,0.7-12.1,18.1-10.7,20.3c1.3,2.2-16,30.4-16,30.4l-44.1,3.6c0,0-15.9-5.1-23.2-5.8 c-7.2-0.7-60.8-17.4-60.8-17.4s5.1-3.6,0-12.3c-5.1-8.7,1.4-15.9,3.6-26c2.2-10.1,11.6-7.2-46.3-51.4c0,0,5.1-4.3,0-17.4v-11.6 c0,0,14.5-1.5,16.6-8.7s5.8-20.2,10.1-23.1S558,374.7,562.3,376.9z")
    // pth5 = W.path("M225.5,665.5c0,0,19-2,28-9s24,0,24,0s17-15,30-14s29-7,47-6s48-14,65-9s46-1,46-1s9-10,16-10s55-2,64,8 s11,26,11,26s10,10,24,1s24-2,24-2s13-15,25-15s25-21,40-18s36,7,42,12s25,25,30,24s24-20,24-20l30-16c0,0,36-2,54,5s36,9,36,9 s13-4,13-9s34-18,43-14s36,18,44,18s52,11,61,11s45,3,53,0s35-10,63-8s52,23,52,23l7,7c0,0,15-1,24-9s42-15,48-13s32,22,45,22 s44,7,44,7h17v26h-1174h-226v-28c0,0,17-34,25-27s8,13,8,13l13,9l22-9c0,0,6-11,14,0s21,19,25,19s26-9,31-5s35,0,35,0l25,4 L225.5,665.5z"); 
    // pth6_1 = W.path("M53,212c0,0-12.4-9.1-8.1-24.2c4.3-15.1,7.3-7.9,14.4-19.4c7.1-11.6,9.4-16.7,9.4-16.7l-4.4-7.1 c0,0-2.9-24.5,1.8-33.4s24-13.9,24-13.9l8.6-9.2l9.1-0.6c0,0,4.9-5.3,15.9,2.7s0.8,12.3,25.5,9.5c24.7-2.8,16.8-3.6,16.8-3.6 s18.1-3.6,32.2,11.5c14.1,15.1,6.4-1.6,20.3,9.8c13.8,11.5,13.8,11.5,13.8,11.5s-1.6-4.8,5.6,5.8s6.4,18.1,6.4,18.1l-7.5,5.             c0,0-8.8,5.5-20.4,8.7c-11.6,3.2-11.1,10.6-11.1,10.6l-10.3,1.9l-18.1,3.6c0,0-6.3,4.1-10.9,14.3c-4.6,10.2-13.6,12-13.6,12 19.2s-11.3,8.1-32.9-2.8s-27-13.1-27-13.1L53,212z");
    // pth6_2 = W.path("M170.9,90.9l-9.4-3.1c0,0,0.8-7.5-0.8-12.3c-1.6-4.8,8.6-9.2,8.6-9.2s11.6-2,17.5-13.5             c7.3-7.9,11.6,17.8,11.6,17.8s14.2-3.4,17.9,13.7c3.2,9.7,6,12,1,16s-14.3,0.9-14.3,0.9l-6.5,0.4 C196.4,101.6,182.5,88.9,170.9,90.9z");
    // pth6_3 = W.path("M198.7,218.7c0,0-10.5-0.6-8.7-13s6.8-16.5,6.8-16.5l9.1-0.6c0,0,3.5-6.4,16.1-14.6c7.4-6.7,13-0.8,13-0.8 s8.6-8,14.8-14.5c2.8,3.5-4.2,16.3-4.2,16.3s5,17,1.6,24.6c-3.4,7.6-7.6,4.2-7.6,4.2s0,19.8-16.8,23.3 C199.8,234.7,198.7,218.7,198.7,218.7z");
    // pth6_4 = W.path("M78.5,262.2l-0.4-6.1l9.7-11.7l13.3,2.8c0,0,22.7-12.6,44.1-6.5s27.2,15.5,27.2,15.5s5.7,7,0.7,11.1 c-5,4,8.5,9.3-8.8,25.3c-7.4,6.7-11.7,0.8-11.7,0.8l-11.2-11.6l-12.9,3.3c0,0-9,1.8-23.2,5.2c-5.2,0.3-20.6-14.7-26.2-20.5 C73.4,263.8,78.5,262.2,78.5,262.2z");
    // pth6_5 = W.path("M118.5,333.7c0,0,0.8-28.4,5.8-31.2c5.1-2.8,16.7-4.8,28.9,1.8c14.2-3.4,24.6-4.1,24.6-4.1l4,1 c0,0-2.1,8.8,1,14.8c3,6-19,9.9-19,9.9l-6.2,5.3l-6.3,4.1l-7.8,0.5l-4.7,7.7l-7.8,0.5L118.5,333.7z");
    
    // $("form").on("submit", function(event) {
    //     event.preventDefault();
    //     name = $(this).find("[name=firstname]").val();
    //     mood = $(this).find("[name=land]").val();
    //     console.log(name, mood)
    //     labelPath(pth1, name)
    // });
    
//     var pressTimer;
//     $("#webgl").on("dblclick", function(event) {  // Select the Button
//         event.preventDefault();
//         $(".menu").css("left", (event.pageX-72) + "px");
//         $(".menu").css("top", (event.pageY-64) + "px");
//         index = $(".menu").css("z-index");
//         if (parseInt(index) > 0) {
//             $(".menu").css("z-index", "-1");
//         } else {
//             $(".menu").css("z-index", "10");
//         }
//         pressTimer = window.setTimeout(function() {console.log("success");}, 1000);
//         console.log("success");
//         index = $("#form").css("z-index");
//         if (parseInt(index) > 0) {
//             $("#form").css("z-index", "0");
//         } else {
//             $("#form").css("z-index", "3");
//         }
//         });
//      //Radial menu code   
//   $( "#webgl" ).bind( "taphold", tapholdHandler );
 
//   function tapholdHandler( event ){
//       console.log("yes", holdCords);
//         $(".menu").css("left", (holdCords.holdX - 72) + "px");
//         $(".menu").css("top", (holdCords.holdY - 64) + "px");
//         index = $(".menu").css("z-index");
//         if (parseInt(index) > 0) {
//             $(".menu").css("z-index", "-1");
//         } else {
//             $(".menu").css("z-index", "10");
//         }
//     };
$(document).on('vmousedown', function(event){
    holdCords.holdX = event.pageX;
    holdCords.holdY = event.pageY;
});
var holdCords = {
    holdX : 0,
    holdY : 0
}
        
    // $("#webgl").on("dblclick", function(event) {  // Select the Button
    //     event.preventDefault();
        
    //     index = $(".menu").css("z-index");
    //     if (parseInt(index) > 0) {
    //         $(".menu").css("z-index", "-1");
    //     } else {
    //         $(".menu").css("z-index", "10");
    //     }
    //     });
    // var pressTimer;
    
    // $("a").mouseup(function(){
    //   clearTimeout(pressTimer);
    //   // Clear timeout
    //   return false;
    // }).mousedown(function(){
    //   // Set timeout
    //   pressTimer = window.setTimeout(function() {},1000);
    //   return false; 
    // }); 
    // var pointer = document.querySelector('.pointer');
    // var maxX = window.innerHeight - pointer.clientWidth;
    // var maxY = window.innerWidth - pointer.clientHeight;
    // var oldX = maxX / 2;
    // var oldY = maxY / 2;

    // function handleOrientation(event) {
    //     var x = event.beta;
    //     var y = event.gamma;
    //     var newX = (oldX + x / 3); // change denominator to modify speed
    //     var newY = (oldY + y / 3); //change denominator to modify speed

    //     if (newX < 0) { newX = 0 }
    //     if (newX > maxX) { newX = maxX }
    //     if (newY < 0) { newY = 0 }
    //     if (newY > maxY) { newY = maxY }

    //     pointer.style.top = newX + "px";
    //     pointer.style.left = newY + "px";

    //     oldX = newX;
    //     oldY = newY;
    // }

    // window.addEventListener('deviceorientation', handleOrientation)
});

