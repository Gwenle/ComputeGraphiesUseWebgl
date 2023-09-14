//import {vec2} from '../utils/MV';
class selfRotateSquare{
    constructor(canvas,VShader,FShader){
        const gl=canvas.getContext("webgl");
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
            return shader;
        }
        const initProg=()=>{
            const vshader=createShader(gl.VERTEX_SHADER,VShader);
            const fshader=createShader(gl.FRAGMENT_SHADER,FShader);
            if(!vshader || !fshader){
                return null;
            }
            const program=gl.createProgram();
            gl.attachShader(program,vshader);
            gl.attachShader(program,fshader);
            gl.linkProgram(program);
            const linkState = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linkState) {
                const err = gl.getProgramInfoLog(program);
                console.log('链接报错'+err)
                gl.deleteShader(vertexShader)
                gl.deleteShader(fragmentShader);
                gl.deleteProgram(program);
                alert(66);
            }
            gl.program = program;
            gl.useProgram(program);
        }

    

        const initBuffer=()=>{
            const buffer=gl.createBuffer();
            let hx=Math.cos(this.theta);
            let hy=Math.sin(this.theta);
            const data=[vec2(hx,hy),vec2(-hy,hx),vec2(-hx,-hy),vec2(hy,-hx)];
            const size = data.length;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW);
            const vPosition = gl.getAttribLocation(gl.program, 'vPosition');
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vPosition);
            gl.uniform1f(thetaLoc,this.theta);
            gl.drawArrays(gl.LINE_LOOP,0,size);
        }

        const repeatBuffer=()=>{
            requestAnimationFrame(()=>{
                this.theta+=0.05;
                gl.uniform1f(thetaLoc,this.theta);
                gl.drawArrays(gl.LINE_LOOP,0,4);
                repeatBuffer();
            },17);
        }


        initProg();
        const thetaLoc=gl.getUniformLocation(gl.program,"theta");
        initBuffer();
        repeatBuffer();
    }
    theta=Math.PI/3;
}