class TurtleGraph {
    constructor(CanvasId, VSHADER_SOURCE, FSHADER_SOURCE, TurnText) {
        const canvasN = document.getElementById(CanvasId);
        this.canvas = canvasN;
        this.clickCallback = (event) => {
            const mx = event.clientX; // 相对于document的位置
            const my = event.clientY;
            console.log("相对于可视document x=" + mx + ", y=" + my);


            //
            const ifInGrid = (x, y) => {
                if (x < 1 || x >= 18 || y < 1 || y > 13) {
                    return false;
                }
                const mid = 7;
                if ((x > 4 && x < 9) || x >= 14) {
                    x = 18 - x;
                }
                const lefty = mid - Math.floor((x + 2) / 2) + 1;
                const righty = mid + Math.floor((x + 1) / 2) - 1;
                if (y < lefty || y > righty) {
                    return false;
                }
                return true;
            }
            const findGrid = (x, y) => {
                // x=x*2;
                //y=y*2;
                const radius = 0.03;
                const vx2 = 0.15;
                const vx3 = 0.05;
                const nx = Math.round((-y - 1.63) / vx2 + 9);
                const ny1 = Math.floor((x - 0.16) / vx3 + 7.25);
                const ny2 = Math.floor((x - 0.16) / vx3 + 7.5);
                const ny = (nx % 2 == 1) ? ny2 : ny1;
                console.log("ny=" + ny + "nx=" + nx, "ifInGrid=" + ifInGrid(nx, ny));
                return [nx, ny];
            };
            //player 1  player 2
            const playerStep = (nx, ny) => {
                //2 2win 1 win 0 contiue
                const playerNum = (this.playerOne) ? 1 : 2;
                let array3d = this.arr2d;
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
                    this.drawCheckBoard(array3d);
                    return checkWin();
                }
                //cancel select
                if (nx == this.lastSelx && ny == this.lastSely) {
                    for (let i = 0; i < 20; i++)
                        for (let j = 0; j < 15; j++) {
                            if (array3d[i][j] === 3)
                                array3d[i][j] = 0;
                        }
                    [this.lastSelx, this.lastSely] = [-1, -1];
                    this.drawCheckBoard(array3d);
                    return 0;
                }
                if (array3d[nx][ny] !== playerNum) {
                    return 0;
                }
                this.lastSelx = nx; this.lastSely = ny;
                //start perpare to run
                const gapJump = (x, y) => {
                    console.log(x, y);
                    if (!ifInGrid(x, y) || array3d[x][y] !== 0) {
                        return;
                    }
                    array3d[x][y] = 3;
                    const pr = (nx % 2 == 1) ? [[-1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [1, 0]] :
                        [[-1, -1], [1, 0], [0, 1], [0, -1], [-1, 0], [1, 1]];
                    const pt = (nx % 2 == 0) ? [[-1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [1, 0]] :
                        [[-1, -1], [1, 0], [0, 1], [0, -1], [-1, 0], [1, 1]];
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
                const pr = (nx % 2 == 1) ? [[-1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [1, 0]] :
                    [[-1, 1], [1, 0], [0, 1], [0, -1], [-1, 0], [1, 1]];
                const pt = (nx % 2 == 0) ? [[-1, 0], [1, -1], [0, 1], [0, -1], [-1, -1], [1, 0]] :
                    [[-1, 1], [1, 0], [0, 1], [0, -1], [-1, 0], [1, 1]];
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
                const striteArray = [].concat.apply([], this.arr2d);
                const location = gl.getUniformLocation(gl.program, "u_BoxColor");
                gl.uniform1iv(location, striteArray);
                gl.drawArrays(gl.LINES,0,this.data.length/2);

            };
            const rect = event.target.getBoundingClientRect();
            const x = ((mx - rect.left) - this.canvas.width / 2) / (this.canvas.width);
            const y = (this.canvas.height / 2 - (my - rect.top)) / (this.canvas.height / 2);
            //console.log("canvas x=" + x + ", y=" + y);
            const [nx, ny] = findGrid(x, y);
            playerStep(nx, ny);
        };
        const thet = this;
        this.drawCheckBoard = (array2d) => {
            if (array2d.length != 20) {
                throw Error('array2d.length!=20');
            }
            if (array2d[0].length != 15) {
                throw Error('array2d[0].length!=15');
            }
            thet.arr2d = array2d;
            const gl = this.gl;
            const eageLen = 1.0 / 15;
            const pi = this.pi;
            const that = thet;
            const drawEage = () => {
                that.init(0, 0, this.pi / 2);
                that.forward(eageLen * 15 / 3 * Math.sqrt(3));
                that.pen(true);
                that.right(5 * pi / 6);
                that.forward(eageLen * 15);
                that.right(2 * pi / 3);
                that.forward(eageLen * 15);
                that.right(2 * pi / 3);
                that.forward(eageLen * 15);

                that.pen(false);
                that.init(0, 0, this.pi * 3 / 2);
                that.forward(eageLen * 15 / 3 * Math.sqrt(3));
                that.pen(true);
                that.right(5 * pi / 6);
                that.forward(eageLen * 15);
                that.right(2 * pi / 3);
                that.forward(eageLen * 15);
                that.right(2 * pi / 3);
                that.forward(eageLen * 15);

                const mid = 6;
                const drawCicyle = (x, y) => {
                    const radius = 0.03;
                    const k = 5.7;
                    const rx = (y % 2 == 1) ? eageLen * (k - x) : eageLen * (k - 0.5 - x);
                    const ry = (eageLen - 0.01) * (19 - y);

                    const swp = 20;
                    const OutSideTheta = 2 * pi / swp;
                    const Len = Math.sin(OutSideTheta / 2) * radius;
                    that.pen(false);
                    that.init(rx, ry, 0);
                    that.forward(radius);
                    that.pen(true);
                    that.left(pi / 2);
                    for (let i = 0; i < swp; i++) {
                        that.forward(Len);
                        that.left(OutSideTheta);
                    }
                    that.pen(false);
                }
                for (let i = 1; i < 14; i += 1) {
                    drawCicyle(mid, i + 10);
                    for (let j = 1; j < Math.floor((i + 1) / 2); j += 1) {
                        //drawCicyle(mid-j,i+10);
                        drawCicyle(mid + j, i + 10);
                    }
                    for (let k = 1; k < Math.floor((i + 2) / 2); k += 1) {
                        drawCicyle(mid - k, i + 10);
                    }
                }//build up-tri
                for (let i = 1; i < 14; i++) {
                    const ni = 18 - i;
                    if (ni > 13) {
                        drawCicyle(mid, ni + 10);
                    }
                    for (let j = 1; j < Math.floor((i + 1) / 2); j += 1) {
                        //drawCicyle(mid-j,i+10);
                        if (ni > 13 || (ni < 9 && j >= Math.floor(ni) / 2)) {
                            drawCicyle(mid + j, ni + 10);
                        }
                    }
                    for (let k = 1; k < Math.floor((i + 2) / 2); k += 1) {
                        if (ni > 13 || (ni < 9 && k >= Math.floor(ni + 1) / 2)) {
                            {
                                drawCicyle(mid - k, ni + 10);

                            }
                        }
                    }//build up-three small tris
                }
            };
            //console.log(that.arr2d)
            drawEage();
        };
        canvasN.addEventListener("click", this.clickCallback);
        //console.log("!" + canvasN);
        this.canvas = canvasN;
        this.gl = canvasN.getContext("webgl");
        const gl = this.gl;
        if (VSHADER_SOURCE === null) {
            return;
        }
        this.init(0, 0, Math.PI / 2);
        //this.data=new Float32Array([0.0,0.0]);
        //init webgl create Shader and Program
        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            const compileState = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compileState) {
                const err = gl.getShaderInfoLog(shader);
                console.log('着色器编译报错信息为:' + err);
                gl.deleteShader(shader);
                return null
            }
            return shader
        }
        const ceateProgram = (vshadher, fshader) => {
            const vertexShader = createShader(gl.VERTEX_SHADER, vshadher);
            const fragmentShader = createShader(gl.FRAGMENT_SHADER, fshader);
            console.log(vertexShader, fragmentShader)
            if (!vertexShader || !fragmentShader) {
                return null
            }
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            const linkState = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linkState) {
                const err = gl.getProgramInfoLog(program);
                console.log('链接报错' + err)
                gl.deleteShader(vertexShader)
                gl.deleteShader(fragmentShader);
                gl.deleteProgram(program);
                alert(66)
            }
            // alert(program)
            // console.log(program, 'program')
            gl.program = program;
            gl.useProgram(program);
        }
        ceateProgram(VSHADER_SOURCE, FSHADER_SOURCE);
    }
    clickCallback;

    init(x, y, theta) {
        if (theta > 2 * this.pi) {
            theta = theta % (2 * this.pi);
        }
        this.x = x;
        this.y = y;
        this.theta = theta;
    }
    forward(distance, rgb = null) {
        const xOffset = distance * Math.cos(this.theta);
        const yOffset = distance * Math.sin(this.theta);
        const nx = this.x + xOffset;
        const ny = this.y + yOffset;
        const drawLine = (x, y, nx, ny, gl) => {
            this.gl.clear(gl.COLOR_BUFFER_BIT);
            const buffer = gl.createBuffer();
            const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            this.data.push(x, y, nx, ny);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
            const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
            gl.uniform4f(u_FragColor, 1.0, 0, 1, 1); // 绿色
            const u_width = gl.getUniformLocation(gl.program, 'u_Width');
            const u_Height = gl.getUniformLocation(gl.program, 'u_Height');
            gl.uniform1f(u_width, gl.drawingBufferWidth);
            gl.uniform1f(u_Height, gl.drawingBufferHeight);
            const striteArray = [].concat.apply([], this.arr2d);
            const location = gl.getUniformLocation(gl.program, "u_BoxColor");
            gl.uniform1iv(location, striteArray);
            //console.log(striteArray);
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);
            gl.drawArrays(gl.LINES, 0, this.data.length / 2);
        };
        if (this.isDraw) {
            drawLine(this.x, this.y, nx, ny, this.gl);
        }
        //this.x,this.y=nx,ny
        [this.x, this.y] = [nx, ny];
        //console.log(this.data);
    }
    //array2d= none,to six player
    drawCheckBoard;
    isDraw = false;

    pen(up_down) {
        this.isDraw = up_down;
    }
    right(angle) {
        let ntheta = this.theta - angle;
        if (ntheta < 0) {
            ntheta = ntheta % (2 * this.pi) + 2 * this.pi;
        }
        this.theta = ntheta;
    }
    left(angle) {
        let ntheta = this.theta + angle;
        if (ntheta > 2 * this.pi) {
            ntheta = ntheta % (2 * this.pi)
        }
        this.theta = ntheta;
    }
    gl; x; y; theta; arr2d; canvas; playerOne = true;
    lastSelx; lastSely;
    pi = Math.PI;
    data = [];
}

