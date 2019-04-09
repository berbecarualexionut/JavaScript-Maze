$(document).ready(function(){
var boundaries = '';
var start = document.getElementById("start");
var end = document.querySelector("#end");
var status = document.querySelector("#status");
var win = true;
var audio = new Audio('BikeHorn-SoundBible.com-602544869.mp3');
var sounds = '';


  $( document.body ).click(function() {
      audio.play();
  });


  start.addEventListener("mouseover", function(event) {
    // sounds = playSounds();
    boundaries = document.querySelectorAll(".boundary");
    document.getElementById("status").innerHTML = "Trebuie sa ajungi la E pentru a castiga";
    for (var i = 0; i < boundaries.length; i++) {
      boundaries[i].addEventListener("mouseover", function checkCollision() {
        win = false;
        this.style.background = "red";
        clearInterval(sounds);
        alert("AI PIERDUT!MAI INCEARCA");
        this.style.background = "#eeeeee";
        document.getElementById("status").innerHTML = "AI PIERDUT";
        // event.stopPropagation(checkCollision);
        gameOver();
      });
    }

  });

function playSounds(){
  setInterval(function(){
    audio.play();
  },4000);
}

function gameOver(){
  for (var i = 0; i <boundaries.length; i++){
    var oldElement = boundaries[i];
    var newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }
}

end.addEventListener("mouseover", function() {
  if (win == true) {
    document.getElementById("status").innerHTML = "YOU WIN!";
    alert("BRAVO! AI CASTIGAT!");
  }
  win = true;
});
});
