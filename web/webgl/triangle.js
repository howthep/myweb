// triangle.js
// the unit of 3d model is triangle;
var points = [];

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
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    // get location of attribute variation
    var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    var u_cos = gl.getUniformLocation(gl.program, "u_cos");
    var u_sin = gl.getUniformLocation(gl.program, "u_sin");
    // get location of uniform variation

    // assign 
    // gl.vertexAttrib3f(a_Position, 0, 0, 0);
    // gl.vertexAttrib1f(a_PointSize, 10);
    
    // gl.vertexAttrib3f(a_Position, p[0], p[1], 0.0);
    // gl.vertexAttrib1f(a_PointSize, p[2]);
    gl.uniform4fv(u_FragColor, [1.0, 0.0, .0, 1.0])
    // p[3] is vec4;
    // canvas.onmousedown = function (e) {
        //     drawPoint(e,gl,a_Position,a_PointSize,u_FragColor);
        // }
        // gl.drawArrays(mode, first, count);
        var triangle = [
            0, 0,
            -0.5, -0.5,
            0.5, -0.5,
            0.2,0.8,
            -0.5,0.3
        ];
        var rect = [
            -0.5,.5,
            -.5,-.5,
            .5,.5,
            .5,-.5
        ];
        
        var n = initVertexBuffer(gl,rect);
        if (n < 0){
            console.log('Failed to initVertexBuffer');
            return;
        }

    var radian = Math.PI/180 * 60;
    gl.uniform1f(u_cos, Math.cos(radian));
    gl.uniform1f(u_sin, Math.sin(radian));
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.POINTS, 0, n);
    
    // gl.drawArrays(gl.LINES, 0, n);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);

    // gl.drawArrays(gl.TRIANGLES, 0, n);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    console.log('end');
}

function initVertexBuffer(gl,arr) {
    // better way to draw multiple vertexes
    var vertexes = new Float32Array( arr);
    // Why not use usual array instead of using object?
    // To make typeof data is same, if using usual array, 
    // the type is uncertain, for it can be number or string.
    // Having same type, array can perform better. 
    // but they can't use method which usual array own. 
    var n = 3;
    
    
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create vertexBuffer");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.bindBuffer(target, buffer); 
    // target is the purpose using buffer;
    // ARRAY_BUFFER is for vertex
    gl.bufferData(gl.ARRAY_BUFFER, vertexes,gl.STATIC_DRAW);
    // write data to target rather than buffer variation
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return vertexes.length/2;
}

