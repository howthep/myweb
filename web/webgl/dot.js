
function main() {
    const canvas = document.querySelector("#cvs");
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }
    var vertexShaderSource = document.getElementById('vertexShader').innerText;
    //片元着色器源码
    var fragShaderSource = document.getElementById('fragmentShader').innerText;
    //初始化着色器
    // var program = initShader(gl, vertexShaderSource, fragShaderSource); 
    // if (!program) {
    //     console.log("Initiation Failed!");
    //     return
    // }
    if (!initShaders(gl, vertexShaderSource, fragShaderSource)) {
        console.log("Initiation Failed!");
        return
    }
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get a_Position");
        return;
    }
    gl.vertexAttrib3f(a_Position, 0, 0, 0)
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
    // gl.drawArrays(mode, first, count);

}




