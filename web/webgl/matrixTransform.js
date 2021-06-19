// matrixTransformation.js

function main() {
    const canvas = document.querySelector("#cvs");
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }
    var vertexShaderSource = document.getElementById('vertexShader').innerText;
    var fragShaderSource = document.getElementById('fragmentShader').innerText;

    if (!initShaders(gl, vertexShaderSource, fragShaderSource)) {
        // create program so that getAttribLocation can call gl.program
        console.log("Initiation Failed!");
        return
    }
    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // get location of attribute variation
    var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    var u_matrix = gl.getUniformLocation(gl.program, "u_matrix");
    // get location of uniform variation

    // assign 
    // gl.vertexAttrib3f(a_Position, 0, 0, 0);
    // gl.vertexAttrib1f(a_PointSize, 10);

    // gl.vertexAttrib3f(a_Position, p[0], p[1], 0.0);
    // gl.vertexAttrib1f(a_PointSize, p[2]);
    gl.uniform4fv(u_FragColor, [1.0, 1.0, 0.0, 1.0]);
    // p[3] is vec4;
    // canvas.onmousedown = function (e) {
    //     drawPoint(e,gl,a_Position,a_PointSize,u_FragColor);
    // }
    // gl.drawArrays(mode, first, count);
    var rect = [
        -0.2, 0.2,
        -0.2, -0.2,
        0.2, -0.2,
        0.2, 0.2
    ];

    var n = initVertexBuffer(gl, rect);
    if (n < 0) {
        console.log('Failed to initVertexBuffer');
        return;
    }
    // var radian = Math.PI / 180 * 37;
    // var cosr = Math.cos(radian);
    // var sinr = Math.sin(radian);

    // var matrix = new Float32Array([
    //     cosr,sinr,0,0,
    //     -sinr,cosr,0,0,
    //     0,0,1,0,
    //     0,0,0,1
    // ])

    // var matrix = new Float32Array([
    //     1,0,0,0,
    //     0,1,0,0,
    //     0,0,1,0,
    //     0.2,0,0,1
    // ])
    // write matrix in 1D array by column major order 
    var matrix = new Matrix4();
    var angel = 0;
    var xy=[0.0,0.0];
    
    
    
    // dont know how to input argumen
    // DON't recall animation(), recall anim();
    // if recall animation, no input argument;
    // recall anim(), can input local variation; 
    var anim = function () {
        // anonymous function;
        angel=animation(angel, gl, matrix, u_matrix,n,xy);
        requestAnimationFrame(anim);
    }
    // using lib
    // matrix.setRotate(-45, 0, 0, 1);
    // matrix.translate(0.5,0,0);
    // matrix.setTranslate(0.2, 0.5, 0);
    // matrix.rotate(45,0,0,1)
    
    // gl.uniformMatrix4fv(u_matrix, false, matrix);
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);
    // gl.uniformMatrix4fv(location, transpose, value)
    //  transpose MUST be false. for webgl its a nonsense argument
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
    
    // gl.drawArrays(gl.LINES, 0, n);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    console.log('end');
    // anim();
}
const AnimStep = 360;
const maxSpan = 0.8;
var time = Date.now();
var flag = true;
function animation(angel, gl, matrix, u_matrix,n,xy) {
    var dt = Date.now()-time;
    var span_step = 0.5;
    var dx =span_step*(dt%50)/1000;
    // console.log(matrix);
    angel = (angel + (dt)*AnimStep/1000) % 360;
    matrix.setTranslate(xy[0],xy[1],0);
    matrix.rotate(angel, 0, 0, 1);
    // matrix.setRotate(angel, 0, 0, 1);
    // matrix.translate(xy[0],xy[1],0);
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    time += dt;
    if(flag){
        xy[0]+=dx;
        xy[1]+=dx;
    }
    else{
        xy[0]-=dx;
        xy[1]-=dx;
    }
    if(xy[0]>=maxSpan) flag =false;
    else if (xy[0]<=-maxSpan) flag = true;
    xy[0]=cutFloatTo(xy[0],3);
    xy[1]=cutFloatTo(xy[1],3);
    if(dt>100)
    console.log(xy+"~~~~"+dt+'~~~~'+dx);
    console.log(xy+":"+dt+':'+dx);
    return angel;
}




function initVertexBuffer(gl, arr) {
    // better way to draw multiple vertexes
    var vertexes = new Float32Array(arr);
    // Why not use usual array instead of using object?
    // To make typeof data is same, if using usual array, 
    // the type is uncertain, for it can be number or string.
    // Having same type, array can perform better. 
    // but they can't use method which usual array own. 
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create vertexBuffer");
        return -1;
    }
    var sizes = new Float32Array([10.0,20.0,30.0]);
    var sizesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.bindBuffer(target, buffer); 
    // target is the purpose using buffer;
    // ARRAY_BUFFER is for vertex
    gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);

    // write data to target rather than buffer variation
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, sizesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);
    
    return vertexes.length / 2;
}

