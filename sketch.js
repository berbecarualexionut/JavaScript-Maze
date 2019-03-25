var mic;
function setup() {
  createCanvas(200,200);
  mic = new p5.AudioIn()
  mic.start();
  var speech = new p5.Speech();
  speech.speak('Buna!Cum te cheama?');
  recording.onResult = speechRecognized;
  var recording = new p5.SpeechRec();
  recording.start();
  }
  function draw(){
    background(0);
    vol = mic.getLevel();
    console.log(vol);
    ellipse(100,100, vol*200, vol*200);
  }

function speechRecognized(){
  console.log('Found it');
}
