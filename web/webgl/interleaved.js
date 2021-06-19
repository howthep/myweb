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
    // get location of uniform variation

    // assign 
    // gl.vertexAttrib3f(a_Position, 0, 0, 0);

    gl.uniform4fv(u_FragColor, [1.0, 1.0, 0.0, 1.0]);

    var vertexSizeColor = [
        // 0.0, 0.0,10.0,1.0,1.0,1.0,
        -0.5, 0.0,10.0,1.0,1.0,0.0,
        -0.25, -0.433,50.0,0.0,1.0,1.0,
        0.0, -0.55,30.0,0.0,0.0,1.0,
        0.25, -0.433,40.0,1.0,1.0,0.0,
        0.5, 0.0,40.0,1.0,0.0,1.0,
        0.25, 0.433,40.0,0.0,1.0,1.0,
        // -0.5, 0.0,10.0,1.0,0.0,0.0,
    ];
    
    var n = initVertexBuffer(gl, vertexSizeColor);
    if (n < 0) {
        console.log('Failed to initVertexBuffer');
        return;
    }
    
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



function initVertexBuffer(gl, arr) {
    // better way to draw multiple vertexes
    var vsc = new Float32Array(arr);
    // Why not use usual array instead of using object?
    // To make typeof data is same, if using usual array, 
    // the type is uncertain, for it can be number or string.
    // Having same type, array can perform better. 
    // but they can't use method which usual array own. 
    var vscBuffer = gl.createBuffer();
    if (!vscBuffer) {
        console.log("Failed to create vertexBuffer");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vscBuffer);
    // gl.bindBuffer(target, buffer); 
    // target is the purpose using buffer;
    // ARRAY_BUFFER is for vertex
    gl.bufferData(gl.ARRAY_BUFFER, vsc, gl.STATIC_DRAW);
    // write data to target rather than buffer variation
    var FSIZE = vsc.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*6, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*6, FSIZE*2);
    gl.enableVertexAttribArray(a_PointSize);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
    gl.enableVertexAttribArray(a_Color);
    
    return vsc.length / 6;
}

