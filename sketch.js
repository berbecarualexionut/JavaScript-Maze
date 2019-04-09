let mic;
let video;
let features;
let knn;
let labelP;
let ready = false;
let x;
let y;
let label = 'nothing';
let volumeDetection = [];
let audio;
let pitchClassifier;
let speechRec;



function setup() {
  //video
  audio = new AudioContext();
  noCanvas();
  video = createCapture(VIDEO);
  video.size(320, 240);
  features = ml5.featureExtractor('MobileNet', modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP('need training data');
  labelP.style('font-size', '32pt');
  x = width / 2;
  y = height / 2;


  //get volume of microphone

  // setInterval(function(){
  //   volumeDetection.push(mic.getLevel());
  // }, 500);

  // var speech = new p5.Speech();
  // //text to speech
  // speech.speak('What is your name?');

  //see if there is a speech recognition



  }

  function draw(){
    background(0);
    fill(255);
    // ellipse(x, y, 24);

  if (label == 'left') {
    x--;
  } else if (label == 'right') {
    x++;
  } else if (label == 'up') {
    y--;
  } else if (label == 'down') {
    y++;
  }

  function goClassify() {
    const logits = features.infer(video);
    knn.classify(logits, function(error, result) {
      if (error) {
        console.error(error);
      } else {
        label = result.label;
        labelP.html(result.label);
        goClassify();
      }
    });
  }

  //image(video, 0, 0);
  if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
  }

  const save = (knn, name) => {
    const dataset = knn.knnClassifier.getClassifierDataset();
    if (knn.mapStringToIndex.length > 0) {
      Object.keys(dataset).forEach(key => {
        if (knn.mapStringToIndex[key]) {
          dataset[key].label = knn.mapStringToIndex[key];
        }
      });
    }
    const tensors = Object.keys(dataset).map(key => {
      const t = dataset[key];
      if (t) {
        return t.dataSync();
      }
      return null;
    });
    let fileName = 'myKNN.json';
    if (name) {
      fileName = name.endsWith('.json') ? name : '${name}.json';
    }
    saveFile(fileName, JSON.stringify({ dataset, tensors }));
  };



  const saveFile = (name, data) => {
    const downloadElt = document.createElement('a');
    const blob = new Blob([data], { type: 'octet/stream' });
    const url = URL.createObjectURL(blob);
    downloadElt.setAttribute('href', url);
    downloadElt.setAttribute('download', name);
    downloadElt.style.display = 'none';
    document.body.appendChild(downloadElt);
    downloadElt.click();
    document.body.removeChild(downloadElt);
    URL.revokeObjectURL(url);
  };


function keyPressed() {
  const logits = features.infer(video);
  if (key == 'l') {
    knn.addExample(logits, 'left');
    console.log('left');
  } else if (key == 'r') {
    knn.addExample(logits, 'right');
    console.log('right');
  } else if (key == 'u') {
    knn.addExample(logits, 'up');
    console.log('up');
  } else if (key == 'd') {
    knn.addExample(logits, 'down');
    console.log('down');
  } else if (key == 's') {
    save(knn, 'model.json');
    //knn.save('model.json');
  }
}


function modelReady() {
  console.log('model ready!');
  // Comment back in to load your own model!
  // knn.load('model.json', function() {
  //   console.log('knn loaded');
  // });
}

function micReady() {
  console.log('Mic is ready');
  pitchClassifier = ml5.pitchDetection('./model/', audio , mic.stream, modelDone);
}

function modelDone() {
  console.log('Pitch model ready');
  detectPitch();

}

function startMicrophone() {
  console.log('Resuming..');
  audio.resume().then(() => {
    setSpeechRecognition();
    console.log('Playback resumed successfully');
    mic = new p5.AudioIn();
    mic.start(micReady);

  });
}

function detectPitch() {
  setInterval(function () {
    pitchClassifier.getPitch(function(err, frequency){
      console.log(frequency)
    });
  },100);
}

function setSpeechRecognition() {
  speechRec = new p5.SpeechRec('en-US');
  speechRec.continuous = true;
  speechRec.interimResults = false  ;
  speechRec.onResult = gotSpeech;
  speechRec.start();
}

function gotSpeech() {
  console.log('Pending for speech');
  if(speechRec.resultValue){
    createP(speechRec.resultString);
  }
  console.log(speechRec.resultString);
}