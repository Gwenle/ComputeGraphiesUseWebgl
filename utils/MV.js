//
//
//  Angel.js
//
//

//----------------------------------------------------------------------------
//
//  Helper functions
//

//将传入的所有的参数转换为数组方式
function _argumentsToArray(args) {
    return [].concat.apply([], Array.prototype.slice.apply(args));
}

//----------------------------------------------------------------------------

//角度转为弧度
function radians(degrees) {
    return degrees * Math.PI / 180.0;
}

//----------------------------------------------------------------------------
//
//  Vector Constructors 矢量构造器
//

//创建二维矢量
function vec2() {
    var result = _argumentsToArray(arguments);

    switch (result.length) {
        case 0:
            result.push(0.0);
        case 1:
            result.push(0.0);
    }

    return result.splice(0, 2);
}

//创建三维矢量
function vec3() {
    var result = _argumentsToArray(arguments);

    switch (result.length) {
        case 0:
            result.push(0.0);
        case 1:
            result.push(0.0);
        case 2:
            result.push(0.0);
    }

    return result.splice(0, 3);
}

//创建四维矢量
function vec4() {
    var result = _argumentsToArray(arguments);

    switch (result.length) {
        case 0:
            result.push(0.0);
        case 1:
            result.push(0.0);
        case 2:
            result.push(0.0);
        case 3:
            result.push(1.0);
    }

    return result.splice(0, 4);
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors 矩阵构造器
//

//创建二维矩阵
function mat2() {
    var v = _argumentsToArray(arguments);

    var m = [];
    switch (v.length) {
        case 0:
            v[0] = 1;
        case 1:
            m = [
                vec2(v[0], 0.0),
                vec2(0.0, v[0])
            ];
            break;

        default:
            m.push(vec2(v));
            v.splice(0, 2);
            m.push(vec2(v));
            break;
    }

    m.matrix = true;

    return m;
}

//----------------------------------------------------------------------------

//创建三维矩阵
function mat3() {
    var v = _argumentsToArray(arguments);

    var m = [];
    switch (v.length) {
        case 0:
            v[0] = 1;
        case 1:
            m = [
                vec3(v[0], 0.0, 0.0),
                vec3(0.0, v[0], 0.0),
                vec3(0.0, 0.0, v[0])
            ];
            break;

        default:
            m.push(vec3(v));
            v.splice(0, 3);
            m.push(vec3(v));
            v.splice(0, 3);
            m.push(vec3(v));
            break;
    }

    m.matrix = true;

    return m;
}

//----------------------------------------------------------------------------

//创建四维矩阵
function mat4() {
    var v = _argumentsToArray(arguments);

    var m = [];
    switch (v.length) {
        case 0:
            v[0] = 1;
        case 1:
            m = [
                vec4(v[0], 0.0, 0.0, 0.0),
                vec4(0.0, v[0], 0.0, 0.0),
                vec4(0.0, 0.0, v[0], 0.0),
                vec4(0.0, 0.0, 0.0, v[0])
            ];
            break;

        default:
            m.push(vec4(v));
            v.splice(0, 4);
            m.push(vec4(v));
            v.splice(0, 4);
            m.push(vec4(v));
            v.splice(0, 4);
            m.push(vec4(v));
            break;
    }

    m.matrix = true;

    return m;
}

//----------------------------------------------------------------------------
//
//  Generic Mathematical Operations for Vectors and Matrices 向量和矩阵的相关的数学运算方法
//

//判断两个矩阵或者两个矢量是否相等
function equal(u, v) {
    if (u.length != v.length) {
        return false;
    }

    if (u.matrix && v.matrix) {
        for (var i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                return false;
            }
            for (var j = 0; j < u[i].length; ++j) {
                if (u[i][j] !== v[i][j]) {
                    return false;
                }
            }
        }
    }
    else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
        return false;
    }
    else {
        for (var i = 0; i < u.length; ++i) {
            if (u[i] !== v[i]) {
                return false;
            }
        }
    }

    return true;
}

//----------------------------------------------------------------------------

//两个矩阵或者两个矢量相加
function add(u, v) {
    var result = [];

    if (u.matrix && v.matrix) {
        if (u.length != v.length) {
            throw "add(): trying to add matrices of different dimensions 尝试相加不同长度的矩阵";
        }

        for (var i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                throw "add(): trying to add matrices of different dimensions 尝试相加不同长度的矩阵";
            }
            result.push([]);
            for (var j = 0; j < u[i].length; ++j) {
                result[i].push(u[i][j] + v[i][j]);
            }
        }

        result.matrix = true;

        return result;
    }
    else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
        throw "add(): trying to add matrix and non-matrix variables 尝试矩阵和矢量相加";
    }
    else {
        if (u.length != v.length) {
            throw "add(): vectors are not the same dimension 矢量的长度不同";
        }

        for (var i = 0; i < u.length; ++i) {
            result.push(u[i] + v[i]);
        }

        return result;
    }
}

//----------------------------------------------------------------------------

//返回第一个矩阵减去第二个矩阵，或者第一个矢量减去第二个矢量
function subtract(u, v) {
    var result = [];

    if (u.matrix && v.matrix) {
        if (u.length != v.length) {
            throw "subtract(): trying to subtract matrices of different dimensions 尝试减去不同长度的矩阵";
        }

        for (var i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                throw "subtract(): trying to subtract matrices of different dimensions 尝试减去不同长度的矩阵";
            }
            result.push([]);
            for (var j = 0; j < u[i].length; ++j) {
                result[i].push(u[i][j] - v[i][j]);
            }
        }

        result.matrix = true;

        return result;
    }
    else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
        throw "subtact(): trying to subtract  matrix and non-matrix variables 尝试矩阵和非矩阵相减";
    }
    else {
        if (u.length != v.length) {
            throw "subtract(): vectors are not the same length 两个矢量长度不同";
        }

        for (var i = 0; i < u.length; ++i) {
            result.push(u[i] - v[i]);
        }

        return result;
    }
}

//----------------------------------------------------------------------------

//矩阵和矩阵 矢量和矢量 矩阵和矢量之间的相乘
function mult(u, v) {
    var result = [];

    if (u.matrix && v.matrix) {
        if (u.length != v.length) {
            throw "mult(): trying to add matrices of different dimensions 尝试不同长度的矩阵相乘";
        }

        for (var i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                throw "mult(): trying to add matrices of different dimensions 尝试不同长度的矩阵相乘";
            }
        }

        for (var i = 0; i < u.length; ++i) {
            result.push([]);

            for (var j = 0; j < v.length; ++j) {
                var sum = 0.0;
                for (var k = 0; k < u.length; ++k) {
                    sum += u[i][k] * v[k][j];
                }
                result[i].push(sum);
            }
        }

        result.matrix = true;

        return result;
    }

    if (u.matrix && (u.length == v.length)) {
        for (var i = 0; i < v.length; i++) {
            var sum = 0.0;
            for (var j = 0; j < v.length; j++) {
                sum += u[i][j] * v[j];
            }
            result.push(sum);
        }
        return result;
    }


    else {
        if (u.length != v.length) {
            throw "mult(): vectors are not the same dimension 不同长度的矢量";
        }

        for (var i = 0; i < u.length; ++i) {
            result.push(u[i] * v[i]);
        }

        return result;
    }
}

//----------------------------------------------------------------------------
//
//  Basic Transformation Matrix Generators 基本的矩阵转换方法
//

//生成位置矩阵
function translate(x, y, z) {
    if (Array.isArray(x) && x.length == 3) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][3] = x;
    result[1][3] = y;
    result[2][3] = z;

    return result;
}

//----------------------------------------------------------------------------

//生成旋转矩阵
function rotate(angle, axis) {
    if (!Array.isArray(axis)) {
        axis = [arguments[1], arguments[2], arguments[3]];
    }

    var v = normalize(axis);

    var x = v[0];
    var y = v[1];
    var z = v[2];

    var c = Math.cos(radians(angle));
    var omc = 1.0 - c;
    var s = Math.sin(radians(angle));

    var result = mat4(
        vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0),
        vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0),
        vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0),
        vec4()
    );

    return result;
}

//生成沿x轴旋转矩阵
function rotateX(theta) {
    var c = Math.cos(radians(theta));
    var s = Math.sin(radians(theta));
    var rx = mat4(1.0, 0.0, 0.0, 0.0,
        0.0, c, -s, 0.0,
        0.0, s, c, 0.0,
        0.0, 0.0, 0.0, 1.0);
    return rx;
}

//生成沿y轴旋转矩阵
function rotateY(theta) {
    var c = Math.cos(radians(theta));
    var s = Math.sin(radians(theta));
    var ry = mat4(c, 0.0, s, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -s, 0.0, c, 0.0,
        0.0, 0.0, 0.0, 1.0);
    return ry;
}

//生成沿z轴旋转矩阵
function rotateZ(theta) {
    var c = Math.cos(radians(theta));
    var s = Math.sin(radians(theta));
    var rz = mat4(c, -s, 0.0, 0.0,
        s, c, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0);
    return rz;
}


//----------------------------------------------------------------------------

//生成缩放矩阵
function scalem(x, y, z) {
    //做兼容，如果传入的是一个数组，不是三个数字，获取到值
    if (Array.isArray(x) && x.length == 3) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}

//----------------------------------------------------------------------------
//
//  ModelView Matrix Generators 模型视图矩阵构造器
//

//生成一个眼朝向一个物体的矩阵 参数：眼的位置 物体位置 向上的位置
function lookAt(eye, at, up) {
    if (!Array.isArray(eye) || eye.length != 3) {
        throw "lookAt(): first parameter [eye] must be an a vec3 参数必须是一个三维矢量";
    }

    if (!Array.isArray(at) || at.length != 3) {
        throw "lookAt(): first parameter [at] must be an a vec3 参数必须是一个三维矢量";
    }

    if (!Array.isArray(up) || up.length != 3) {
        throw "lookAt(): first parameter [up] must be an a vec3 参数必须是一个三维矢量";
    }

    //判断一个眼的位置和看的位置是否相等，相等则返回一个默认的矩阵
    if (equal(eye, at)) {
        return mat4();
    }

    var v = normalize(subtract(at, eye));  // view direction vector 视角方向矢量
    var n = normalize(cross(v, up));       // perpendicular vector 垂直的向量
    var u = normalize(cross(n, v));        // "new" up vector

    v = negate(v);

    var result = mat4(
        vec4(n, -dot(n, eye)),
        vec4(u, -dot(u, eye)),
        vec4(v, -dot(v, eye)),
        vec4()
    );

    return result;
}

//----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//

//生成一个正交相机矩阵 左 右 下 上 近 远
function ortho(left, right, bottom, top, near, far) {
    if (left == right) {
        throw "ortho(): left and right are equal 左右相等";
    }
    if (bottom == top) {
        throw "ortho(): bottom and top are equal 上下相等";
    }
    if (near == far) {
        throw "ortho(): near and far are equal 远近相等";
    }

    var w = right - left;
    var h = top - bottom;
    var d = far - near;

    var result = mat4();
    result[0][0] = 2.0 / w;
    result[1][1] = 2.0 / h;
    result[2][2] = -2.0 / d;
    result[0][3] = -(left + right) / w;
    result[1][3] = -(top + bottom) / h;
    result[2][3] = -(near + far) / d;

    return result;
}

//----------------------------------------------------------------------------

//生成一个透视相机矩阵 垂直视角 比例 近 远
function perspective(fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(radians(fovy) / 2);
    var d = far - near;

    var result = mat4();
    result[0][0] = f / aspect;
    result[1][1] = f;
    result[2][2] = -(near + far) / d;
    result[2][3] = -2 * near * far / d;
    result[3][2] = -1;
    result[3][3] = 0.0;

    return result;
}

//----------------------------------------------------------------------------
//
//  Matrix Functions 矩阵相关函数
//

//逆转置矩阵 矩阵
function transpose(m) {
    if (!m.matrix) {
        return "transpose(): trying to transpose a non-matrix 当前参数不是一个矩阵";
    }

    var result = [];
    for (var i = 0; i < m.length; ++i) {
        result.push([]);
        for (var j = 0; j < m[i].length; ++j) {
            result[i].push(m[j][i]);
        }
    }

    result.matrix = true;

    return result;
}

//----------------------------------------------------------------------------
//
//  Vector Functions 矢量相关函数
//

//两个矢量的点积 点积计算可以用来表征或计算两个向量之间的夹角，以及在b向量在a向量方向上的投影
function dot(u, v) {
    if (u.length != v.length) {
        throw "dot(): vectors are not the same dimension 两个矢量的长度不同";
    }

    var sum = 0.0;
    for (var i = 0; i < u.length; ++i) {
        sum += u[i] * v[i];
    }

    return sum;
}

//----------------------------------------------------------------------------

//矢量取反
function negate(u) {
    var result = [];
    for (var i = 0; i < u.length; ++i) {
        result.push(-u[i]);
    }

    return result;
}

//----------------------------------------------------------------------------

//两个矢量的叉积 在三维几何中，向量a和向量b的叉积结果是一个向量，更为熟知的叫法是法向量，该向量垂直于a和b向量构成的平面。
function cross(u, v) {
    if (!Array.isArray(u) || u.length < 3) {
        throw "cross(): first argument is not a vector of at least 3 第一个矢量的长度必须大于等于3";
    }

    if (!Array.isArray(v) || v.length < 3) {
        throw "cross(): second argument is not a vector of at least 3 第二个矢量的长度必须大于等于3";
    }

    var result = [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]
    ];

    return result;
}

//----------------------------------------------------------------------------

//矢量距离原点的长度 矢量
function length(u) {
    return Math.sqrt(dot(u, u));
}

//----------------------------------------------------------------------------

//矢量归一化 矢量 是否排除最后一个值
function normalize(u, excludeLastComponent) {
    if (excludeLastComponent) {
        var last = u.pop();
    }

    var len = length(u);

    //判断len是否是Infinity
    if (!isFinite(len)) {
        throw "normalize: vector " + u + " has zero length 矢量没有长度";
    }

    for (var i = 0; i < u.length; ++i) {
        u[i] /= len;
    }

    if (excludeLastComponent) {
        u.push(last);
    }

    return u;
}

//----------------------------------------------------------------------------

//字面意思两个矢量混合 第一个矢量 第二个矢量 数字
function mix(u, v, s) {
    if (typeof s !== "number") {
        throw "mix: the last paramter " + s + " must be a number 第三个参数不是一个数字";
    }

    if (u.length != v.length) {
        throw "vector dimension mismatch 两个矢量的长度不相等";
    }

    var result = [];
    for (var i = 0; i < u.length; ++i) {
        result.push((1.0 - s) * u[i] + s * v[i]);
    }

    return result;
}

//----------------------------------------------------------------------------
//
// Vector and Matrix functions
//

//矢量u的每个值于数字s相乘
function scale(s, u) {
    if (!Array.isArray(u)) {
        throw "scale: second parameter " + u + " is not a vector 第二个参数不是一个矢量";
    }

    var result = [];
    for (var i = 0; i < u.length; ++i) {
        result.push(s * u[i]);
    }

    return result;
}

//----------------------------------------------------------------------------
//
//
//

//将当前的矢量或者矢量转为数组
function flatten(v) {
    if (v.matrix === true) {
        v = transpose(v);
    }

    var n = v.length;
    var elemsAreArrays = false; //当前是矩阵还是矢量

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}

//----------------------------------------------------------------------------

//每种数据类型的长度
var sizeof = {
    'vec2': new Float32Array(flatten(vec2())).byteLength,
    'vec3': new Float32Array(flatten(vec3())).byteLength,
    'vec4': new Float32Array(flatten(vec4())).byteLength,
    'mat2': new Float32Array(flatten(mat2())).byteLength,
    'mat3': new Float32Array(flatten(mat3())).byteLength,
    'mat4': new Float32Array(flatten(mat4())).byteLength
};

// new functions 5/2/2015

// printing 打印矩阵

function printm(m) {
    if (m.length == 2)
        for (var i = 0; i < m.length; i++)
            console.log(m[i][0], m[i][1]);
    else if (m.length == 3)
        for (var i = 0; i < m.length; i++)
            console.log(m[i][0], m[i][1], m[i][2]);
    else if (m.length == 4)
        for (var i = 0; i < m.length; i++)
            console.log(m[i][0], m[i][1], m[i][2], m[i][3]);
}

// determinants

function det2(m) {

    return m[0][0] * m[1][1] - m[0][1] * m[1][0];

}

function det3(m) {
    var d = m[0][0] * m[1][1] * m[2][2]
        + m[0][1] * m[1][2] * m[2][0]
        + m[0][2] * m[2][1] * m[1][0]
        - m[2][0] * m[1][1] * m[0][2]
        - m[1][0] * m[0][1] * m[2][2]
        - m[0][0] * m[1][2] * m[2][1]
    ;
    return d;
}

function det4(m) {
    var m0 = [
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[2][1], m[2][2], m[2][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    ];
    var m1 = [
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[2][0], m[2][2], m[2][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    ];
    var m2 = [
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[2][0], m[2][1], m[2][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    ];
    var m3 = [
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[2][0], m[2][1], m[2][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    ];
    return m[0][0] * det3(m0) - m[0][1] * det3(m1)
        + m[0][2] * det3(m2) - m[0][3] * det3(m3);

}

function det(m) {
    if (m.matrix != true) console.log("not a matrix");
    if (m.length == 2) return det2(m);
    if (m.length == 3) return det3(m);
    if (m.length == 4) return det4(m);
}

//---------------------------------------------------------

// inverses 逆转矩阵

function inverse2(m) {
    var a = mat2();
    var d = det2(m);
    a[0][0] = m[1][1] / d;
    a[0][1] = -m[0][1] / d;
    a[1][0] = -m[1][0] / d;
    a[1][1] = m[0][0] / d;
    a.matrix = true;
    return a;
}

function inverse3(m) {
    var a = mat3();
    var d = det3(m);

    var a00 = [
        vec2(m[1][1], m[1][2]),
        vec2(m[2][1], m[2][2])
    ];
    var a01 = [
        vec2(m[1][0], m[1][2]),
        vec2(m[2][0], m[2][2])
    ];
    var a02 = [
        vec2(m[1][0], m[1][1]),
        vec2(m[2][0], m[2][1])
    ];
    var a10 = [
        vec2(m[0][1], m[0][2]),
        vec2(m[2][1], m[2][2])
    ];
    var a11 = [
        vec2(m[0][0], m[0][2]),
        vec2(m[2][0], m[2][2])
    ];
    var a12 = [
        vec2(m[0][0], m[0][1]),
        vec2(m[2][0], m[2][1])
    ];
    var a20 = [
        vec2(m[0][1], m[0][2]),
        vec2(m[1][1], m[1][2])
    ];
    var a21 = [
        vec2(m[0][0], m[0][2]),
        vec2(m[1][0], m[1][2])
    ];
    var a22 = [
        vec2(m[0][0], m[0][1]),
        vec2(m[1][0], m[1][1])
    ];

    a[0][0] = det2(a00) / d;
    a[0][1] = -det2(a10) / d;
    a[0][2] = det2(a20) / d;
    a[1][0] = -det2(a01) / d;
    a[1][1] = det2(a11) / d;
    a[1][2] = -det2(a21) / d;
    a[2][0] = det2(a02) / d;
    a[2][1] = -det2(a12) / d;
    a[2][2] = det2(a22) / d;

    return a;

}

function inverse4(m) {
    var a = mat4();
    var d = det4(m);

    var a00 = [
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[2][1], m[2][2], m[2][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    ];
    var a01 = [
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[2][0], m[2][2], m[2][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    ];
    var a02 = [
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[2][0], m[2][1], m[2][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    ];
    var a03 = [
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[2][0], m[2][1], m[2][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    ];
    var a10 = [
        vec3(m[0][1], m[0][2], m[0][3]),
        vec3(m[2][1], m[2][2], m[2][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    ];
    var a11 = [
        vec3(m[0][0], m[0][2], m[0][3]),
        vec3(m[2][0], m[2][2], m[2][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    ];
    var a12 = [
        vec3(m[0][0], m[0][1], m[0][3]),
        vec3(m[2][0], m[2][1], m[2][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    ];
    var a13 = [
        vec3(m[0][0], m[0][1], m[0][2]),
        vec3(m[2][0], m[2][1], m[2][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    ];
    var a20 = [
        vec3(m[0][1], m[0][2], m[0][3]),
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    ];
    var a21 = [
        vec3(m[0][0], m[0][2], m[0][3]),
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    ];
    var a22 = [
        vec3(m[0][0], m[0][1], m[0][3]),
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    ];
    var a23 = [
        vec3(m[0][0], m[0][1], m[0][2]),
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    ];

    var a30 = [
        vec3(m[0][1], m[0][2], m[0][3]),
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[2][1], m[2][2], m[2][3])
    ];
    var a31 = [
        vec3(m[0][0], m[0][2], m[0][3]),
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[2][0], m[2][2], m[2][3])
    ];
    var a32 = [
        vec3(m[0][0], m[0][1], m[0][3]),
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[2][0], m[2][1], m[2][3])
    ];
    var a33 = [
        vec3(m[0][0], m[0][1], m[0][2]),
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[2][0], m[2][1], m[2][2])
    ];


    a[0][0] = det3(a00) / d;
    a[0][1] = -det3(a10) / d;
    a[0][2] = det3(a20) / d;
    a[0][3] = -det3(a30) / d;
    a[1][0] = -det3(a01) / d;
    a[1][1] = det3(a11) / d;
    a[1][2] = -det3(a21) / d;
    a[1][3] = det3(a31) / d;
    a[2][0] = det3(a02) / d;
    a[2][1] = -det3(a12) / d;
    a[2][2] = det3(a22) / d;
    a[2][3] = -det3(a32) / d;
    a[3][0] = -det3(a03) / d;
    a[3][1] = det3(a13) / d;
    a[3][2] = -det3(a23) / d;
    a[3][3] = det3(a33) / d;

    return a;
}

function inverse(m) {
    if (m.matrix != true) console.log("not a matrix");
    if (m.length == 2) return inverse2(m);
    if (m.length == 3) return inverse3(m);
    if (m.length == 4) return inverse4(m);
}

function normalMatrix(m, flag) {
    var a = mat4();
    a = inverse(transpose(m));
    if (flag != true) return a;
    else {
        var b = mat3();
        for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) b[i][j] = a[i][j];
        return b;
    }

}

