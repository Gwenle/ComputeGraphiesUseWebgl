class TurtleGraph {
    constructor(CanvasId, VSHADER_SOURCE, FSHADER_SOURCE) {
        this.ratX=0;
        this.ratY=9;
        let canvasN=document.getElementById(CanvasId);
        console.log("!"+canvasN);
        this.gl=canvasN.getContext("webgl");
        let gl=this.gl;
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

        let clickCallback = (event) => {

                if (event.button == 0) {
                    this.mouseOrient=(this.mouseOrient+3)%4;
                    this.drawMaze(this.array3d);
            
                }else if (event.button == 2){
                    this.mouseOrient=(this.mouseOrient+5)%4;
                    this.drawMaze(this.array3d);
                }else if(event.button == 1){
                //console.log("鼠标滚轮!");
                    let [ratX,ratY]=[this.ratX,this.ratY];
                    const orient=this.mouseOrient;
                    // console.log(orient);
                    // console.log(ratX,ratY);
                    // console.log(this.array3d[ratX][ratY]);
                    switch (orient){
                        case 0://right //5 up0 left1  down2 right3 stauts
                            if(this.array3d[ratX][ratY][2]!=0){
                                this.ratX+=1;
                            }
                            break;
                        case 3://down
                            if(this.array3d[ratX][ratY][1]!=0){
                                this.ratY-=1;
                            }
                            break;
                        case 2://left
                            if(this.array3d[ratX][ratY][0]!=0){
                                this.ratX-=1;
                            }
                            break;
                        case 1://up
                            if(this.array3d[ratX][ratY][3]!=0){
                                this.ratY+=1;
                            }
                            break;
                    }
                    
                    this.drawMaze(this.array3d);
                }
            
        }

        canvasN.addEventListener("mousedown", clickCallback);
    }
    init(x, y, theta) {
        if (theta > 2 * this.pi) {
            theta = theta % (2 * this.pi);
        }
        this.x = x;
        this.y = y;
        this.theta = theta;
    }
    forward(distance) {
        let xOffset = distance * Math.cos(this.theta);
        let yOffset = distance * Math.sin(this.theta);
        let nx = this.x + xOffset;
        let ny = this.y + yOffset;
        let drawLine = (x, y, nx, ny, gl) => {
            /*
            this.gl.clear(gl.COLOR_BUFFER_BIT);
            const buffer = gl.createBuffer();
            const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            */
            this.data.push(x, y, nx, ny);
            /*
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);
            gl.drawArrays(gl.LINES, 0, this.data.length / 2);
            */
        };
        if (this.isDraw) {
            drawLine(this.x, this.y, nx, ny, this.gl);
        }
        //this.x,this.y=nx,ny
        [this.x, this.y] = [nx, ny];
        //console.log(this.data);
    }
    drawMaze(array3d){
        let gl=this.gl;
        let n=array3d.length;
        let m=array3d[0].length;
        let boxLength=1.0/n;
        let boxWidth=1.0/m;
        let pointBox=[];
        this.data=[];
        let darwRat=(x,y)=>{
            const eageLen=boxWidth;
                const pi=Math.PI;
                const radius = 0.04;
                const k = -4.65;
                const rx =  (eageLen) * (k + x);
                const ry = (eageLen) * (k+y);
            const drawCicyle = (x, y) => {
                
                //const rx=0;
                //const ry=0;

                const swp = 12;
                const OutSideTheta = 2 * pi / swp;
                //console.log(OutSideTheta);  
                const Len = Math.sin(OutSideTheta / 2) * radius;
                this.pen(false);
                this.init(rx, ry, 0);
                //set_color(...color);
                this.forward(radius);
                this.pen(true);
                this.left(pi / 2);
                for (let i = 0; i < swp; i++) {
                    this.forward(Len);
                    this.left(OutSideTheta);
                }   
                //console.log(this.data);
                this.pen(false);
            }
            drawCicyle(x,y);
            //drawEars
        
            this.pen(false);
            this.init(rx, ry, 0);
            this.forward(radius/2);
            this.left(pi/2*this.mouseOrient);
            //pointBox.push(rx,ry,rx+0.01,ry+0.01);
            this.left(pi/9);
            this.forward(radius/2);
            this.pen(true);
            this.forward(radius/2);
            
            this.pen(false);
            this.init(rx, ry, 0);
            this.forward(radius/2);
            this.left(pi/2*this.mouseOrient);
            //pointBox.push(rx,ry,rx+0.01,ry+0.01);
            this.right(pi/9);
            this.forward(radius/2);
            this.pen(true);
            this.forward(radius/2);
            pointBox.push(...this.data);
        }
        darwRat(this.ratX,this.ratY);
        for(let i=0;i<n;i++)
        //for(let i=0;i<3;i++)
            //for(let j=0;j<4;j++){
            for(let j=0;j<m;j++){
                    if(array3d[i][j][0]===0){
                        pointBox.push(-0.5+i*boxLength,-0.5+j*boxWidth);
                        pointBox.push(-0.5+i*boxLength,-0.5+(j+1)*boxWidth);
                    }
                    if(array3d[i][j][1]===0){
                        pointBox.push(-0.5+i*boxLength,-0.5+j*boxWidth);
                        pointBox.push(-0.5+(i+1)*boxLength,-0.5+j*boxWidth);
                    }
                }
        for(let i=0;i<n;i++)
        {
            if(array3d[i][m-1][3]===0){
                        pointBox.push(-0.5+i*boxLength,-0.5+m*boxWidth);
                        pointBox.push(-0.5+(i+1)*boxLength,-0.5+m*boxWidth);
            }
        }
        for(let j=0;j<m;j++)
        {
            if(array3d[n-1][j][2]===0){
                        pointBox.push(-0.5+n*boxLength,-0.5+j*boxWidth);
                        pointBox.push(-0.5+n*boxLength,-0.5+(j+1)*boxWidth);
            }
        }
                this.gl.clear(gl.COLOR_BUFFER_BIT);
                const buffer = gl.createBuffer();
                const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                //console.log(pointBox);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointBox), gl.STATIC_DRAW);
                gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_Position);
                gl.drawArrays(gl.LINES, 0, pointBox.length / 2);
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
    buildMaze(n, m) {
        //5 up left down right stauts
        var rows = n,
            cols = m,
            cats = 5,
            array3d = new Array(rows),
            i, j, k;

        for (i = 0; i < rows; i++) {
            array3d[i] = new Array(cols);

            for (j = 0; j < cols; j++) {
                array3d[i][j] = new Array(cats);

                for (k = 0; k < cats; k++) {
                    array3d[i][j][k] = 0;
                }
            }
        }
        //init array3d

        let possibility=[[0,0]];
        let randomPick=(arr)=>{
            let lp=arr.length;
            let k=Math.floor(Math.random()*lp);
            let re= arr[k];
            arr.splice(k,1);
            return re;
        }
        while (possibility.length>0){
            let k=randomPick(possibility);
            let [r,c]=[k[0],k[1]];
            array3d[r][c][4]=1;

            let check=[];
            if(r-1>=0){
                if(array3d[r-1][c][4]===0)
                {
                    possibility.push([r-1,c]);
                    array3d[r-1][c][4]=2;
                }else if(array3d[r-1][c][4]===1){
                    check.push('Up');
                }
            }
            if(r+1<n){
                if(array3d[r+1][c][4]===0)
                {
                    possibility.push([r+1,c]);
                    array3d[r+1][c][4]=2;
                }else if(array3d[r+1][c][4]===1){
                    check.push('Down');
                }
            }
            if(c-1>=0){
                if(array3d[r][c-1][4]===0)
                {
                    possibility.push([r,c-1]);
                    array3d[r][c-1][4]=2;
                }else if(array3d[r][c-1][4]===1){
                    check.push('Left');
                }
            }
            if(c+1<m){
                if(array3d[r][c+1][4]===0)
                {
                    possibility.push([r,c+1]);
                    array3d[r][c+1][4]=2;
                }else if(array3d[r][c+1][4]===1){
                    check.push('Right');
                }
            }
            let direction=randomPick(check);
            //break the wall Up left down right
            switch(direction){
                case 'Left':
                    array3d[r][c][1]=1;
                    array3d[r][c-1][3]=1;
                    break;
                case 'Right':
                    array3d[r][c][3]=1;
                    array3d[r][c+1][1]=1;
                    break;
                case 'Up':
                    array3d[r][c][0]=1;
                    array3d[r-1][c][2]=1;
                    break;
                case 'Down':
                    array3d[r][c][2]=1;
                    array3d[r+1][c][0]=1;
                    break;
            }

        }

        this.array3d=array3d;
        return array3d;
    }
        gl; x; y; theta;
        ratX;raty;
        pi = Math.PI;
        data = [];
        mouseOrient=0;
}

