
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
    if (!initShader(gl, vertexShaderSource, fragShaderSource)) {
        console.log("Initiation Failed!");
        return
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

}




