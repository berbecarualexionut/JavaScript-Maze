var mic;
function setup() {
  createCanvas(200,200);
  mic = new p5.AudioIn()
  mic.start();
  var speech = new P5.Speech();
  speech.speack('Buna!Cum te cheama?');
  var recording = new P5.SpeechRec();
  recording.start();
  }
  function draw(){
    background(0);
    vol = mic.getLevel();
    console.log(vol);
    ellipse(100,100, vol*200, vol*200);
  }
