import { TurtleGraph } from "./ColorTurtle.js";
class JumpChess {
    constructor(VSHADER_SOURCE, FSHADER_SOURCE, CanvasId, TurnText) {
        this.TurtleGraphN = new TurtleGraph(CanvasId, VSHADER_SOURCE, FSHADER_SOURCE);
        this.initColorArray();
        const mid = 7;
        let that = this;
        const canvasN = document.getElementById(CanvasId);
        this.canvas = canvasN;
        this.gl = canvasN.getContext("webgl");
        let gl = this.gl;
        const movesingle = [[-1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [1, 0]];
        const movedouble = [[-1, 1], [1, 0], [0, 1], [0, -1], [-1, 0], [1, 1]];
        let draw = () => {
            //clear
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            this.TurtleGraphN.onceDraw=false;

            const eageLen = 1.0 / 15;
            let TurtleGraph1 = this.TurtleGraphN;
            let pi = this.pi;
            let initPage = () => {
                TurtleGraph1.init(0, 0, this.pi / 2);
                TurtleGraph1.set_color(1.0, 0.0, 0.0, 1.0);
                TurtleGraph1.forward(eageLen * 15 / 3 * Math.sqrt(3));
                TurtleGraph1.pen(true);
                TurtleGraph1.right(5 * pi / 6);
                TurtleGraph1.forward(eageLen * 15);
                TurtleGraph1.right(2 * pi / 3);
                TurtleGraph1.forward(eageLen * 15);
                TurtleGraph1.right(2 * pi / 3);
                TurtleGraph1.forward(eageLen * 15);

                TurtleGraph1.pen(false);
                TurtleGraph1.init(0, 0, this.pi * 3 / 2);
                TurtleGraph1.forward(eageLen * 15 / 3 * Math.sqrt(3));
                TurtleGraph1.pen(true);
                TurtleGraph1.right(5 * pi / 6);
                TurtleGraph1.forward(eageLen * 15);
                TurtleGraph1.right(2 * pi / 3);
                TurtleGraph1.forward(eageLen * 15);
                TurtleGraph1.right(2 * pi / 3);
                TurtleGraph1.forward(eageLen * 15);
            };
            const drawCicyle = (x, y, color) => {
                const radius = 0.03;
                const k = - 7.25;
                const rx = (y % 2 == 1) ? eageLen * (k + x) : eageLen * (k + 0.5 + x);
                const ry = (eageLen - 0.01) * (9 - y);

                const swp = 6;
                const OutSideTheta = 2 * pi / swp;
                const Len = Math.sin(OutSideTheta / 2) * radius;
                TurtleGraph1.pen(false);
                TurtleGraph1.init(rx, ry, 0);
                TurtleGraph1.set_color(...color);
                TurtleGraph1.forward(radius);
                TurtleGraph1.pen(true);
                TurtleGraph1.left(pi / 2);
                for (let i = 0; i < swp; i++) {
                    TurtleGraph1.forward(Len);
                    TurtleGraph1.left(OutSideTheta);
                }
                TurtleGraph1.pen(false);
            }
            //console.log(that.ColorBufferArray);
            const drawChess = () => {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        if (this.ColorBufferArray[i][j] > -1) {
                            if(i===this.rows-3){
                                TurtleGraph1.onceDraw=true;
                            }
                            drawCicyle(j, i, this.UseColorsArray[this.ColorBufferArray[i][j]]);
                        }
                    }
                }
            };
            initPage();
            drawChess();
        };
        let clickCallback = (event) => {
            const mx = event.clientX; // 相对于document的位置
            const my = event.clientY;
            //console.log("相对于可视document x=" + mx + ", y=" + my);


            //
            const ifInGrid = (x, y) => {
                return this.ColorBufferArray[x][y] != -1;
            }
            const findGrid = (x, y) => {
                // x=x*2;
                //y=y*2;
                const radius = 0.03;
                const vx2 = 0.15;
                const vx3 = 0.05;
                const nx = Math.round((-y - 1.63) / vx2 + 9);
                const ny1 = Math.floor((x - 0.16) / vx3 + 7);
                const ny2 = Math.floor((x - 0.16) / vx3 + 7.5);
                const ny = (nx % 2 == 1) ? ny2 : ny1;
                //console.log("ny=" + ny + "nx=" + nx, "ifInGrid=" + ifInGrid(nx, ny));
                return [nx, ny];
            };
            //player 1  player 2
            const playerStep = (nx, ny) => {
                //2 2win 1 win 0 contiue
                const playerNum = (this.playerOne) ? 1 : 2;
                let array3d = this.ColorBufferArray;
                let checkWin = () => {
                    let play2Win = true, play1Win = true;
                    let OnePlayerNum = 1;
                    let twoPlayerNum = 2;
                    for (let f = 1; f < 5; f += 1) {
                        for (let v = 0; v < Math.floor((f + 1) / 2); v++) {
                            if (array3d[f][mid + v] !== twoPlayerNum) {
                                play2Win = false;
                                break;
                            }
                        }
                        for (let t = 1; t < Math.floor((f + 2) / 2); t++) {
                            if (array3d[f][mid - t] !== twoPlayerNum) {
                                play2Win = false;
                                break;
                            }
                        }
                    }
                    if (play2Win) {
                        alert("player2Win!!");
                        return 2;
                    }
                    for (let f = 14; f < 18; f += 1) {
                        let f1 = 18 - f;
                        for (let v = 0; v < Math.floor((f1 + 1) / 2); v++) {
                            if (array3d[f][mid + v] !== OnePlayerNum) {
                                play1Win = false;
                                break;
                            }
                        }
                        for (let t = 1; t < Math.floor((f1 + 2) / 2); t++) {
                            if (array3d[f][mid - t] !== OnePlayerNum) {
                                play1Win = false;
                                break;
                            }

                        }
                    }
                    if (play1Win) {
                        alert("player1Win!");
                        return 1;
                    }
                    return 0;
                };
                //run
                if (array3d[nx][ny] === 3) {
                    array3d[nx][ny] = playerNum;
                    //clear red
                    for (let i = 0; i < 20; i++)
                        for (let j = 0; j < 15; j++) {
                            if (array3d[i][j] === 3)
                                array3d[i][j] = 0;
                        }
                    array3d[this.lastSelx][this.lastSely] = 0;
                    this.playerOne = !this.playerOne;
                    TurnText.textContent = (!this.playerOne) ? 'Blue' : 'Green';
                    draw();
                    return checkWin();
                }
                //cancel select
                const otherChaseWhileredExt = (nowx, nowy) => {
                    let rel = false;
                    for (let i = 0; i < 20; i++)
                        for (let j = 0; j < 15; j++) {
                            if (array3d[i][j] === 3)
                                rel = true;
                        }
                    if (rel && (array3d[nowx][nowy] === 2 || array3d[nowx][nowy] === 1)) {
                        rel = true;
                    }
                    return rel;
                }
                if (nx == this.lastSelx && ny == this.lastSely || otherChaseWhileredExt(nx, ny)) {
                    for (let i = 0; i < 20; i++)
                        for (let j = 0; j < 15; j++) {
                            if (array3d[i][j] === 3)
                                array3d[i][j] = 0;
                        }
                    [this.lastSelx, this.lastSely] = [-1, -1];
                    draw();
                    return 0;
                }
                if (array3d[nx][ny] !== playerNum) {
                    return 0;
                }
                this.lastSelx = nx; this.lastSely = ny;
                //start perpare to run
                const gapJump = (x, y) => {
                    //console.log(x, y);
                    if (!ifInGrid(x, y) || array3d[x][y] !== 0) {
                        return;
                    }
                    array3d[x][y] = 3;
                    const pr = (nx % 2 == 1) ? movesingle :
                        movedouble;
                    const pt = (nx % 2 == 0) ? movesingle :
                        movedouble;
                    for (let i = 0; i < 6; i++) {
                        const mx = pr[i][0] + x;
                        const my = pr[i][1] + y;
                        if (ifInGrid(mx, my) && array3d[mx][my] !== 0 && array3d[x][y] === 3) {
                            const fx = pt[i][0] + mx;
                            const fy = pt[i][1] + my;
                            gapJump(fx, fy);
                        }
                    }
                };
                //this array means 1 to 6 the mirror of ar
                const pr = (nx % 2 == 1) ? movesingle :
                    movedouble;
                const pt = (nx % 2 == 0) ? movesingle :
                    movedouble;
                for (let i = 0; i < 6; i++) {
                    const mx = pr[i][0] + nx;
                    const my = pr[i][1] + ny;
                    if (ifInGrid(mx, my)) {
                        if (array3d[mx][my] === 0) {
                            array3d[mx][my] = 3;
                        } else if (array3d[mx][my] !== 3) {
                            const fx = pt[i][0] + mx;
                            const fy = pt[i][1] + my;
                            gapJump(fx, fy);
                        }
                    }

                }
                //this.drawCheckBoard(array3d);
                draw();

            };
            const rect = event.target.getBoundingClientRect();
            const x = ((mx - rect.left) - this.canvas.width / 2) / (this.canvas.width);
            const y = (this.canvas.height / 2 - (my - rect.top)) / (this.canvas.height / 2);
            ////console.log("canvas x=" + x + ", y=" + y);
            const [nx, ny] = findGrid(x, y);
            playerStep(nx, ny);
        };
        canvasN.addEventListener("click", clickCallback);

        draw();
    }

    initColorArray() {
        let rows = this.rows, cols = this.cols;
        this.ColorBufferArray = new Array(rows);
        let i, j, k;

        for (i = 0; i < rows; i++) {
            this.ColorBufferArray[i] = new Array(cols);

            for (j = 0; j < cols; j++) {
                this.ColorBufferArray[i][j] = -1;
            }
        }
        let st = 1, ed = cols - 1;
        for (let i = 5; i < 14; i++) {
            if (i > 9) {
                if (i % 2 == 0) { st -= 1; } else { ed += 1 };
            }
            for (let j = st; j < ed; j++) {
                this.ColorBufferArray[i][j] = 0;
            }
            if (i <= 8) {
                if (i % 2 == 0) { st += 1; } else { ed -= 1 };
            }
        }
        let mid = 7;
        let OnePlayerNum = 1;
        for (let f = 1; f < 5; f += 1) {
            this.ColorBufferArray[f][mid] = OnePlayerNum;
            for (let v = 1; v < Math.floor((f + 1) / 2); v++) {
                this.ColorBufferArray[f][mid + v] = OnePlayerNum;
            }
            for (let t = 1; t < Math.floor((f + 2) / 2); t++) {
                this.ColorBufferArray[f][mid - t] = OnePlayerNum;
            }
        }
        let twoPlayerNum = 2;
        for (let f = 14; f < 18; f += 1) {
            this.ColorBufferArray[f][mid] = twoPlayerNum;
            let f1 = 18 - f;
            for (let v = 1; v < Math.floor((f1 + 1) / 2); v++) {
                this.ColorBufferArray[f][mid + v] = twoPlayerNum;
            }
            for (let t = 1; t < Math.floor((f1 + 2) / 2); t++) {
                this.ColorBufferArray[f][mid - t] = twoPlayerNum;
            }
        }
    }

    TurtleGraphN;
    ColorBufferArray;
    //0 etmpty  1 player One 2 player Two 3 pick Chess
    UseColorsArray = [[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0], [1.0, 0.0, 1.0, 1.0]];
    pi = Math.PI;
    rows = 20;
    cols = 15;
    playerOne = true;
    canvas;
};

export { JumpChess };