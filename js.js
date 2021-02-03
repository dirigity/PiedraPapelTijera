var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys = [];
var ratony = 0;
var ratonx = 0;
var maxDistance = 15;
var minDistance = Math.floor((maxDistance - 1) / 2);
var islands = [];
var mem = []
var ticks = 0;
var InteractionDistance = 30;

var startTime = 0;

var precision = 1;

var sparseMap = new Array(Math.ceil(canvas.height / InteractionDistance) * Math.ceil(canvas.width / InteractionDistance))

var cols = 3

function ResetSparseMap() {
    sparseMap = new Array(Math.ceil(canvas.height / InteractionDistance) * Math.ceil(canvas.width / InteractionDistance))
}

function GetHabitantsAt(x, y) {
    return sparseMap[GetCuadrantCode(x, y)];
}

function GetCuadrantCode(x, y) {
    return (Math.floor(x / InteractionDistance) * Math.ceil(canvas.width / InteractionDistance)) + Math.floor(y / InteractionDistance)
}

function getRules(n) {
    let ret = [];
    let done = false

    let ofset = 1;
    while (!done) {
        for (let i = 0; i < n; i++) {
            ret.push([i, (i + ofset) % n])
        }

        console.log(ret);

        done = true;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                done = done && related(ret, i, j)
            }
        }
    }

    return ret

}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function related(ret, i, j) {
    for (let n = 0; n < ret.length; n++) {
        const elm = ret[n];
        if (arrayEquals(elm, [i, j]) || arrayEquals(elm, [j, i])) {
            return true;
        }
    }
    return false;
}


var rules = getRules(cols)

function AWinsB(a, b) {
    if (a == b) return false;

    for (let n = 0; n < rules.length; n++) {
        const elm = rules[n];
        if (arrayEquals(elm, [a, b])) {
            return true;
        }
    }
    return false;
}

function crack() {
    return krak
}


function tick() {


    ctx.fillRect(0, 0, canvas.height, canvas.width);
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;

    ticks++;
    clean();

    //expand

    for (let i = 0; i < mem.length; i++) {
        if (mem[i] == "None") continue;


        let closestEnemy = -1;
        let closestEnemyDist = InteractionDistance;

        let ofsets = [[0, 0], [0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
        let companions = [];

        for (let n = 0; n < ofsets.length; n++) {
            let amiguis = GetHabitantsAt(mem[i][0][0] + (ofsets[n][0] * InteractionDistance * 0.9), mem[i][0][1] + (ofsets[n][1] * InteractionDistance * 0.9))
            //console.log("amiguis",amiguis) 
            if (amiguis)
                companions = companions.concat(amiguis)

        }
        for (let n = 0; n < ofsets.length; n++) {
            let amiguis = GetHabitantsAt(mem[i][0][0] + (ofsets[n][0] * InteractionDistance * 1.1), mem[i][0][1] + (ofsets[n][1] * InteractionDistance * 1.1))
            //console.log("amiguis",amiguis) 
            if (amiguis)
                companions = companions.concat(amiguis)

        }
        //console.log(companions)
        //for (let j = 0; j < mem.length; j++) {

        for (let k = 0; k < companions.length; k++) {
            j = companions[k];
            if (mem[j] == "None") continue;
            //console.log(j)
            if (AWinsB(mem[j][4], mem[i][4])) {

                if (d(mem[i], mem[j]) < closestEnemyDist) {
                    closestEnemy = j
                }
            }
        }

        if (closestEnemy != -1) {

            //let force = [-mem[closestEnemy][0][0] + mem[i][0][0], - mem[closestEnemy][0][1] + mem[i][0][1]]

            //mem[i][0][0] += force[0] * 1/pointDist([0,0],force);
            //mem[i][0][1] += force[1] * 100 / (pointDist([0, 0], force) * pointDist([0, 0], force));
            if (closestEnemyDist > InteractionDistance / 2) {
                let m = Math.pow(InteractionDistance / closestEnemyDist, 4)
                mem[i][0][0] += mem[closestEnemy][1][0] * m;
                mem[i][0][1] += mem[closestEnemy][1][1] * m;
            } else {
                let force = [-mem[closestEnemy][0][0] + mem[i][0][0], - mem[closestEnemy][0][1] + mem[i][0][1]]

                mem[i][0][0] += force[0] * 10000 / pointDist([0, 0], force);
                mem[i][0][1] += force[1] * 10000 / (pointDist([0, 0], force) * pointDist([0, 0], force));
            }

        } else {
            mem[i][0][0] += mem[i][1][0];
            mem[i][0][1] += mem[i][1][1];
        }

        if (Number.isNaN(mem[i][0][0]) || Number.isNaN(mem[i][0][1])) {
            console.log(closestEnemy, mem[i])
            crack();
        }

    }

    //draw

    //console.log(islands);
    //console.log(mem);

    let colors = [rgb(255, 0, 0), rgb(0, 0, 255), rgb(0, 255, 0)]

    for (let i = 0; i < islands.length; i++) {
        const start = islands[i];

        ctx.beginPath();

        //ctx.strokeStyle = colors[mem[start][4]]
        ctx.fillStyle = colors[mem[start][4]]

        //ctx.lineWidth = InteractionDistance
        let current = mem[start]
        ctx.moveTo(current[0][0], current[0][1]);

        do {
            //console.log(current);
            current = mem[current[3]];
            ctx.lineTo(current[0][0], current[0][1]);
        } while (current[3] != start);
        //current = mem[start]
        //ctx.lineTo(current[0][0], current[0][1]);

        //ctx.stroke();

        ctx.closePath();
        ctx.fill();


    }

    if (false) {

        ctx.beginPath();

        for (let y = 0; y < canvas.height / InteractionDistance; y++) {
            ctx.moveTo(0, y * InteractionDistance);
            ctx.lineTo(canvas.width, y * InteractionDistance)
        }

        for (let x = 0; x < canvas.width / InteractionDistance; x++) {
            ctx.moveTo(x * InteractionDistance, 0);
            ctx.lineTo(x * InteractionDistance, canvas.height)
        }

        ctx.stroke();

    }
    setTimeout(() => {
        if (ticks < 200) {
            tick();
            //console.log(ticks);

        } else {
            let d = new Date();

            console.log("performance: ", d.getTime() - startTime, mem.length / (d.getTime() - startTime));

            startTime = d.getTime()

            ticks = 0;
            tick();
        }
    }, 1);
}

function createBlob(x, y, c) { // [[pos],[vec],pre,pos,col]
    let displace = [[minDistance, 0], [0, minDistance], [-minDistance, 0], [0, -minDistance]];
    let conectDelta = [[3, 1], [0, 2], [1, 3], [2, 0]]

    let I = mem.length;
    for (let i = 0; i < displace.length; i++) {
        let D = displace[i];
        mem.push([[D[0] + x, D[1] + y], D, I + conectDelta[i][0], I + conectDelta[i][1], c])
    }
    //console.log(mem)
    islands.push(I);
}

function copy(a) {
    if (typeof a == typeof []) {
        let ret = [];
        for (let i = 0; i < a.length; i++) {
            let b = a[i];
            ret.push(copy(b))
        }
        return ret
    }
    return a
}

function clean() {
    ResetSparseMap();

    // create colapse
    for (let i = 0; i < mem.length; i++) {
        let wip = mem[i];
        if (wip == "None") continue;

        let pos = next(wip)
        //console.log(wip, pos)
        let dist = d(wip, pos)
        if (dist < minDistance) {
            //console.log("poping " + i)
            //console.log("before extraction ", copy(mem))
            //let beforeExtr = copy(mem)

            drawShortcut = islands.indexOf(wip[3])

            if (drawShortcut != -1) {
                islands[drawShortcut] = i
            }

            let NNode = merge(wip, pos)
            NNode[2] = wip[2]
            NNode[3] = pos[3]

            mem[NNode[2]][3] = i
            mem[NNode[3]][2] = i

            mem[mem[i][3]] = "None"
            mem[i] = NNode;
            //console.log([beforeExtr], [mem])
            //let a;
            //let b = a[7][8]
        } else if (dist > maxDistance) {
            mem.push(merge(wip, pos));

            pos[2] = mem.length - 1;
            wip[3] = mem.length - 1;
        }

        let pre = prev(wip)

        if (d(pre, pos) < minDistance) {

            drawShortcut = islands.indexOf(i)

            if (drawShortcut != -1) {
                islands[drawShortcut] = mem[i][3]
            }

            mem[mem[i][2]][3] = mem[i][3];
            mem[mem[i][3]][2] = mem[i][2];

            mem[i] = "None"
        }


    }
    //normal reconfiguration

    //if(false)
    for (let i = 0; i < mem.length; i++) {
        if (mem[i] == "None") continue;

        let wip = mem[i];

        let cuadrant = GetCuadrantCode(wip[0][0], wip[0][1])
        if (!sparseMap[cuadrant]) {
            sparseMap[cuadrant] = []
        }
        sparseMap[cuadrant].push(i);

        let a = prev(wip);
        let b = next(wip);
        let newNomrmal = [a[0][1] - b[0][1], -(a[0][0] - b[0][0])];
        let MinusnewNomrmal = [-newNomrmal[0], -newNomrmal[1]]
        if (pointDist(newNomrmal, wip[1]) > pointDist(MinusnewNomrmal, wip[1])) {
            newNomrmal = MinusnewNomrmal
        }
        //console.log(wip[1], normalize(newNomrmal, 1))
        wip[1] = normalize(newNomrmal, precision);
    }
    //console.log(sparseMap)
}

function merge(a, b) {
    //console.log(a,b)
    let ret = [];
    let pos = [];

    let tangA = tang(a);
    let tangB = tang(b);

    let ABmean = mean(a, b);

    ret.push(ABmean)
    ret.push(normalize([a[1][0] + b[1][0], a[1][1] + b[1][1]], precision))
    ret.push(b[2])
    ret.push(a[3])
    ret.push(a[4])

    //console.log("the new node is: ")
    //console.log(ret)

    return ret;
}

function pointDist(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

function mean(a, b) {
    return [(a[0][0] + b[0][0]) / 2, (a[0][1] + b[0][1]) / 2];
}

function normalize(vec, a) {
    let d = pointDist([0, 0], vec) / a;
    return [vec[0] / d, vec[1] / d];
}

function tang(a) { // [pto,vec]
    return [a[0], [a[1][1], -a[1][0]]]
}

function next(a) {
    return mem[a[3]]
}

function prev(a) {
    return mem[a[2]]
}

function d(a, b) {
    return Math.sqrt(Math.pow(a[0][0] - b[0][0], 2) + Math.pow(a[0][1] - b[0][1], 2))
}


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


tick();


createBlob(canvas.width / 2 - 400, canvas.height / 2, 0)
createBlob(canvas.width / 2, canvas.height / 2 - 200, 2)
createBlob(canvas.width / 2 +400, canvas.height / 2, 0)
createBlob(canvas.width / 2, canvas.height / 2, 1)



