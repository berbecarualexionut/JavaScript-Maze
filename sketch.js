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
let frequencies = [];
let prevFrame;
let threshold = 50;
let pixelsDiffer = [];



function setup() {
    //video
    createCanvas(320, 240);

    audio = new AudioContext();
    // noCanvas();
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(320, 240);
    features = ml5.featureExtractor('MobileNet', modelReady);
    knn = ml5.KNNClassifier();
    labelP = createP('need training data');
    labelP.style('font-size', '32pt');
    x = width / 2;
    y = height / 2;
    prevFrame = createImage(320, 240, RGB);


    //get volume of microphone

    // setInterval(function(){
    //   volumeDetection.push(mic.getLevel());
    // }, 500);

    // var speech = new p5.Speech();
    // //text to speech
    // speech.speak('What is your name?');

}

function draw(){
    image(prevFrame, 0, 0);
    background(0);
    // fill(255);
    video.loadPixels();
    prevFrame.loadPixels();
    loadPixels();

    // ellipse(x, y, 24);

    for (var x = 0; x < video.width; x++) {
        for (var y = 0; y < video.height; y++) {

            // Step 1, what is the location into the array
            var loc = (x + y * video.width) * 4;
            // Step 2, what is the previous color
            var r1 = prevFrame.pixels[loc   ];
            var g1 = prevFrame.pixels[loc + 1];
            var b1 = prevFrame.pixels[loc + 2];

            // Step 3, what is the current color
            var r2 = video.pixels[loc   ];
            var g2 = video.pixels[loc + 1];
            var b2 = video.pixels[loc + 2];

            // Step 4, compare colors (previous vs. current)
            var diff = dist(r1, g1, b1, r2, g2, b2);

            // Step 5, How different are the colors?
            // If the color at that pixel has changed, then there is motion at that pixel.
            if (diff < threshold) {
                pixels[loc+3] = 255;
            } else {
                // If not, display white
                pixels[loc] = 255;
                pixels[loc+1] = 255;
                pixels[loc+2] = 255;
                pixels[loc+3] = 255;
            }
        }
    }
    updatePixels();

    // Save frame for the next cycle
    //if (video.canvas) {
    prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
    //}

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
            if(frequency !== 'undefined' && frequency !== null ) {
                frequencies.push(frequency);
            }
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
    if(speechRec.resultValue){
        createP(speechRec.resultString);
    }
    console.log(speechRec.resultString);
}