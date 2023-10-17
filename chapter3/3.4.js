import { TurtleGraph } from "./ColorTurtle.js";
class JumpChess {
    constructor(VSHADER_SOURCE, FSHADER_SOURCE, CanvasId) {
        this.TurtleGraphN = new TurtleGraph(CanvasId, VSHADER_SOURCE, FSHADER_SOURCE);
        this.initColorArray();
        let that = this;
        let darw = () => {
            const eageLen = 1.0 / 15;
            let TurtleGraph1 = this.TurtleGraphN;
            let pi = this.pi;
            let initPage = () => {
                TurtleGraph1.init(0, 0, this.pi / 2);
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
                const k = 6.7;
                const rx = (y % 2 == 1) ? eageLen * (k - x) : eageLen * (k - 0.5 - x);
                const ry = (eageLen - 0.01) * (9 - y);

                const swp = 20;
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
            console.log(that.ColorBufferArray);
            const drawChess = () => {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        if (this.ColorBufferArray[i][j] > -1) {
                            drawCicyle(j, i, this.UseColorsArray[this.ColorBufferArray[i][j]]);
                        }
                    }
                }
            };
            initPage();
            drawChess();
        }
        darw();
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
        let st=1,ed=cols-1;
        for(let i=5;i<14;i++){
            if(i>9)
            {
            if(i%2==0){st-=1;}else{ed+=1};
            }
            for(let j=st;j<ed;j++)
            {
                this.ColorBufferArray[i][j] = 0;
            }
            if(i<=8){
            if(i%2==0){st+=1;}else{ed-=1};
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
    UseColorsArray = [[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0], [1.0, 0.0, 0.0, 1.0]];
    pi = Math.PI;
    rows = 20;
    cols = 15;
};

export { JumpChess };