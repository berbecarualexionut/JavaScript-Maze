var video;
function setup() {
    createCanvas(320, 240);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(320, 240);
}

function draw() {
    background(51);
    loadPixels();
    video.loadPixels();
    for (var y = 0; y < video.height; y++) {
        for (var x = 0; x < video.width; x++) {
            var index = (x + y * width) * 4;
            var r = video.pixels[index];
            var g = video.pixels[index + 1];
            var b = video.pixels[index + 2];
            pixels[index] = r;
            pixels[index + 1] = g;
            pixels[index + 2] = b;
            pixels[index + 3] = 255;

        }
    }
    updatePixels();
}