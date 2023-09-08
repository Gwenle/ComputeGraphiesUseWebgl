class TurtleGraph {
    constructor(CanvasId, VSHADER_SOURCE, FSHADER_SOURCE) {
        let canvasN = document.getElementById(CanvasId);
        console.log("!" + canvasN);
        this.gl = canvasN.getContext("webgl");
        let gl = this.gl;
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
    init(x, y, theta) {
        if (theta > 2 * this.pi) {
            theta = theta % (2 * this.pi);
        }
        this.x = x;
        this.y = y;
        this.theta = theta;
    }
    forward(distance, rgb = null) {
        let xOffset = distance * Math.cos(this.theta);
        let yOffset = distance * Math.sin(this.theta);
        let nx = this.x + xOffset;
        let ny = this.y + yOffset;
        let drawLine = (x, y, nx, ny, gl) => {
            this.gl.clear(gl.COLOR_BUFFER_BIT);
            const buffer = gl.createBuffer();
            const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            this.data.push(x, y, nx, ny);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
            const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
            gl.uniform4f(u_FragColor, 1.0, 0, 1, 1); // 绿色
            let striteArray = [].concat.apply([],this.arr2d);
            const u_width = gl.getUniformLocation(gl.program, 'u_Width');
            const u_Height = gl.getUniformLocation(gl.program, 'u_Height');
            gl.uniform1f(u_width, gl.drawingBufferWidth);
            gl.uniform1f(u_Height, gl.drawingBufferHeight);
            let location = gl.getUniformLocation(gl.program, "u_BoxColor");
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
    drawCheckBoard(array2d) {
        if (array2d.length != 15) {
            throw Error('array2d.length!=15');
        }
        if (array2d[0].length != 20) {
            throw Error('array2d[0].length!=15');
        }
        this.arr2d = array2d;
        const gl = this.gl;
        let pointArr = [];
        let eageLen = 1.0 / 15;
        let eageWidth = 1.0 / 20;
        let pi = this.pi;
        let drawEage = () => {
            this.init(0, 0, this.pi / 2);
            this.forward(eageLen * 15 / 3 * Math.sqrt(3));
            this.pen(true);
            this.right(5 * pi / 6);
            this.forward(eageLen * 15);
            this.right(2 * pi / 3);
            this.forward(eageLen * 15);
            this.right(2 * pi / 3);
            this.forward(eageLen * 15);

            this.pen(false);
            this.init(0, 0, this.pi * 3 / 2);
            this.forward(eageLen * 15 / 3 * Math.sqrt(3));
            this.pen(true);
            this.right(5 * pi / 6);
            this.forward(eageLen * 15);
            this.right(2 * pi / 3);
            this.forward(eageLen * 15);
            this.right(2 * pi / 3);
            this.forward(eageLen * 15);

            let mid = 6;
            let drawCicyle = (x, y) => {
                let radius = 0.03;
                let k = 5.7;
                let rx = (y % 2 == 1) ? eageLen * (k - x) : eageLen * (k - 0.5 - x);
                let ry = (eageLen - 0.01) * (19 - y);

                const swp = 20;
                const OutSideTheta = 2 * pi / swp;
                const Len = Math.sin(OutSideTheta / 2) * radius;
                this.pen = false;
                this.init(rx, ry, 0);
                this.forward(radius);
                this.pen = true;
                this.left(pi / 2);
                for (let i = 0; i < swp; i++) {
                    this.forward(Len);
                    this.left(OutSideTheta);
                }
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
                let ni = 18 - i;
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

        drawEage();
    }
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
    gl; x; y; theta; arr2d;
    pi = Math.PI;
    data = [];
}

