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
    document.getElementById("status").innerHTML = "Trebuie sa ajungi la E pentru a castiga";
    for (var i = 0; i < boundaries.length; i++) {
      boundaries[i].addEventListener("mouseover", function checkCollision() {
        win = false;
        this.style.background = "red";
        clearInterval(sounds);
        alert("AI PIERDUT!MAI INCEARCA");
        this.style.background = "#eeeeee";
        document.getElementById("status").innerHTML = "AI PIERDUT";
        event.stopPropagation();
        this.removeEventListener("mouseover", checkCollision);
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
    alert("BRAVO! AI CASTIGAT!");
  }
  win = true;
});
});
