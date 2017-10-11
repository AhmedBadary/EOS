function initialize() {
    var options = {atmosphere: true, center: [0, 0], zoom: 0};
    var earth = new WE.map('earth_div', options);
    WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 5,
      attribution: 'NASA'
    }).addTo(earth);
}

$(document).ready(function() {
    $("#but").on("click", function(event) {  // Select the Button
        event.preventDefault();
        index = $("#form").css("z-index");
        if (parseInt(index) > 0) {
            $("#form").css("z-index", "0");
        } else {
            $("#form").css("z-index", "3");
        }
        });
        
    $("form").on("submit", function(event) {
        event.preventDefault();
        name = $(this).find("[name=firstname]").val();
        mood = $(this).find("[name=land]").val();
    });
    // var pressTimer;
    $("#earth_div").on("dblclick", function(event) {  // Select the Button
        event.preventDefault();
        $(".menu").css("left", (event.pageX-72) + "px");
        $(".menu").css("top", (event.pageY-64) + "px");
        index = $(".menu").css("z-index");
        if (parseInt(index) > 0) {
            $(".menu").css("z-index", "0");
        } else {
            $(".menu").css("z-index", "10");
        }
        // pressTimer = window.setTimeout(function() {console.log("success");}, 1000);
        // console.log("success");
        // index = $("#form").css("z-index");
        // if (parseInt(index) > 0) {
        //     $("#form").css("z-index", "0");
        // } else {
        //     $("#form").css("z-index", "3");
        // }
        });
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
});