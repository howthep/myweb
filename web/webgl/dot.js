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
    // get location of attribute a_Position
    if (a_Position < 0 && a_PointSize<0) {
        console.log("Failed to get a_Position or a_PointSize");
        return;
    }
    // gl.vertexAttrib3f(a_Position, 0, 0, 0);
    gl.vertexAttrib1f(a_PointSize, 10);
    // assign 
    canvas.onmousedown = function(e){
        // console.log(e);
        var x = e.offsetX;
        var y = e.offsetY;
        // console.log("("+x+":"+y+")");
        var rect  = e.target.getBoundingClientRect();
        // get border information of canvas;
        x = cutFloatTo(x/rect.width*2 -1,3);
        y = -cutFloatTo(y/rect.height*2 -1,3);
        console.log("("+x+":"+y+")");
        points.push(x);
        points.push(y);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var len = points.length;
        for(var i =0;i<len;i+=2){
            gl.vertexAttrib3f(a_Position, points[i], points[i+1], 0.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.POINTS, 0, 1);
    // gl.drawArrays(mode, first, count);

}




