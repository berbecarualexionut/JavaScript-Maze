$(document).ready(function(){
var boundaries = document.querySelectorAll(".boundary");
var start = document.getElementById("start");
var end = document.querySelector("#end");
var status = document.querySelector("#status");
var win = true;

  start.addEventListener("mouseover", function() {
    document.getElementById("status").innerHTML = "Move your mouse over the S to begin";
    for (var i = 0; i < boundaries.length; i++) {
      boundaries[i].addEventListener("mouseover", function() {
        win = false;
        this.style.background = "red";
        alert("YOU LOSE! START OVER!");
        this.style.background = "#eeeeee";
        document.getElementById("status").innerHTML = "YOU LOSE!";
        stopPropagation();
      });
    }

  });

end.addEventListener("mouseover", function() {
  if (win == true) {
    document.getElementById("status").innerHTML = "YOU WIN!";
    alert("CONGRATULATIONS! YOU WIN!");
  }
  win = true;
});
});
