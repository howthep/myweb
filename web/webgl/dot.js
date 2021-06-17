// dot.js
function main() {
    const canvas = document.querySelector("#cvs");
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }
    var vertexShaderSource = document.getElementById('vertexShader').innerText;
    var fragShaderSource = document.getElementById('fragmentShader').innerText;
    var points = [];

    if (!initShaders(gl, vertexShaderSource, fragShaderSource)) {
        // create program so that getAttribLocation can call gl.program
        console.log("Initiation Failed!");
        return
    }
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    // get location of attribute variation
    var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    // get location of uniform variation

    if (a_Position < 0 && a_PointSize < 0) {
        console.log("Failed to get a_Position or a_PointSize");
        return;
    }
    // gl.vertexAttrib3f(a_Position, 0, 0, 0);
    gl.vertexAttrib1f(a_PointSize, 10);
    // assign 
    // gl.vertexAttrib3f(a_Position, p[0], p[1], 0.0);
    // gl.vertexAttrib1f(a_PointSize, p[2]);
    // gl.uniform4fv(u_FragColor, p[3])
    canvas.onmousedown = function (e) {
        // console.log(e);
        var x = e.offsetX;
        var y = e.offsetY;
        var size = cutFloatTo(Math.random() * 20 + 20);
        var red = cutFloatTo(Math.random());
        var green = cutFloatTo(Math.random());
        var blue = cutFloatTo(Math.random());
        var color = [red,green,blue,1.0];
        // console.log("("+x+":"+y+")");
        var rect = e.target.getBoundingClientRect();
        // get border information of canvas;
        x = cutFloatTo(x / rect.width * 2 - 1, 3);
        y = -cutFloatTo(y / rect.height * 2 - 1, 3);
        // console.log("("+x+":"+y+")");
        points.push([x, y, size, color]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var len = points.length;
        for (var i = 0; i < len; i++) {
            var p = points[i];
            gl.vertexAttrib3f(a_Position, p[0], p[1], 0.0);
            gl.vertexAttrib1f(a_PointSize, p[2]);
            gl.uniform4fv(u_FragColor, p[3])
            gl.drawArrays(gl.POINTS, 0, 1);
        }
        if(len>100){
            console.log("ponits clear");
            points.splice(0,1);
        }
        console.log(len);
    }
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.POINTS, 0, 1);
    // gl.drawArrays(mode, first, count);

}




