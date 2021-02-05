var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys = [];
var ratony = 0;
var ratonx = 0;
var maxDistance = 15;
var minDistance = Math.floor((maxDistance - 1) / 2);
var islands = [];
var mem = [];
var InteractionDistance = 30;

var startTime = 0;

var precision = 1;

var colors = [rgb(255, 255, 255), rgb(0, 0, 255), rgb(255, 0, 0), rgb(0, 255, 0)];

canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;

var side = 10;
var H = Math.floor(canvas.height / side);
var W = Math.floor(canvas.width / side);
var wasmReady = false
var CGuy = new Worker('CGuy.js');
CGuy.onmessage = (e) => {
    if (e.data[0] == "ready") {
        wasmReady = true;
        console.log("Wasm ready mesage recieved", H, W)
        CGuy.postMessage(["Start", [H, W]]);
        CGuy.postMessage(["Next"]);

    }

    if (e.data[0] == "Redraw") {
        for (let i = 0; i < e.data[1].length; i++) {
            const elm = e.data[1][i];
            drawXYrect(elm[0] * side, elm[1] * side, side, colors[elm[2]]);
        }
        setTimeout(() => {
            CGuy.postMessage(["Next"]);

        }, 10);
    }
}


// ----------
// OTHER SUFF
// ----------


window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }
function drawXYrect(x, y, grosor, color) {
    //console.log("fufo?")
    if (color)
        ctx.fillStyle = color;
    else
        ctx.fillStyle = "#555555";
    ctx.fillRect(x, y, grosor, grosor);
}
function rgb(r, g, b) {
    var r_ = check(decToHex(r));
    var g_ = check(decToHex(g));
    var b_ = check(decToHex(b));
    return "#" + r_ + g_ + b_;
}

function decToHex(n) {
    if (n < 0) {
        n = 0xFFFFFFFF + n + 1;
    }
    return Math.round(n).toString(16).toUpperCase();
}

function check(n) {
    //console.log(n)
    if (n.length > 2) {
        return "FF";
    } else if (n.length < 2) {
        return "0" + n;

    } else return n
}

canvas.addEventListener('mousemove', function onMouseover(e) {
    ratonx = e.clientX;
    ratony = e.clientY;
});

let v = 1;

canvas.addEventListener('click', () => {
    if (wasmReady) {
        let x = Math.floor(ratonx / side);
        let y = Math.floor(ratony / side);
        v = (v + 1) % 3
        CGuy.postMessage(["Set", [x, y, v + 1]])
    }

});

window.addEventListener('DOMMouseScroll', mouseWheelEvent);
window.addEventListener("wheel", mouseWheelEvent);
function mouseWheelEvent(e) {
    console.log(e.wheelDelta ? e.wheelDelta : -e.detail);
    var movement = (e.wheelDelta ? e.wheelDelta : -e.detail) / 120;
    if (movement < 0) {
        ScrollUp();
    } else {
        ScrollDown();
    }
}

function ScrollUp() {

}
function ScrollDown() {

}

