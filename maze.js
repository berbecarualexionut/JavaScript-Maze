$(document).ready(function(){
var boundaries = document.querySelectorAll(".boundary");
var start = document.getElementById("start");
var end = document.querySelector("#end");
var status = document.querySelector("#status");
var win = true;
var audio = new Audio('BikeHorn-SoundBible.com-602544869.mp3');
var sounds = '';


  start.addEventListener("mouseover", function(event) {
    sounds = playSounds();
    document.getElementById("status").innerHTML = "Move your mouse over the S to begin";
    for (var i = 0; i < boundaries.length; i++) {
      boundaries[i].addEventListener("mouseover", function() {
        win = false;
        this.style.background = "red";
        clearInterval(sounds);
        alert("YOU LOSE! START OVER!");
        this.style.background = "#eeeeee";
        document.getElementById("status").innerHTML = "YOU LOSE!";
        event.stopPropagation();
      });
    }

  });

function playSounds(){
  setInterval(function(){
    audio.play();
  },4000);
}



end.addEventListener("mouseover", function() {
  if (win == true) {
    document.getElementById("status").innerHTML = "YOU WIN!";
    alert("CONGRATULATIONS! YOU WIN!");
  }
  win = true;
});
});
