
importScripts("a.out.js");

function next() {

}

let board = [];

onmessage = (e) => {
    //console.log(e.data)
    if (e.data[0] == "Set"){
        console.log("seting: ", e.data[1])
        Module.__Z8setXYVJSiii(e.data[1][0], e.data[1][1], e.data[1][2])
    }
    if (e.data[0] == "Start") {
        let H = e.data[1][0];
        let W = e.data[1][1];
        for (let y = 0; y < H; y++) {
            let row = []
            for (let x = 0; x < W; x++) { 
                row.push(0);
            }
            board.push(row);
        }
        Module.__Z6initJSii(H, W)
    }
    if (e.data[0] == "Next") {
        Module.__Z6stepJSv();
        Module.__Z18startTransmisionJSv();
        let H = Module.__Z10transmitJSv();
        let W = Module.__Z10transmitJSv();

        let ret = [];

        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                let d = Module.__Z10transmitJSv()
                if (board[y][x] != d) {
                    board[y][x] = d;
                    ret.push([x, y, NewBoard[y][x]])
                }
            }
        }
        postMessage(["Redraw", ret]);
    }
}

Module.onRuntimeInitialized = (_) => {
    console.log("Wasm ready")
    postMessage(["ready"]);
    //__Z6initJSii
    //__Z8setXYVJSiii
    //__Z6stepJSv
    //__Z18startTransmisionJSv
    //__Z10transmitJSv
}