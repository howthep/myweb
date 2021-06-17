
function main(){
    const canvas = document.querySelector("#cvs");
    const gl = canvas.getContext('webgl');

    if(!gl){
        alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }
    
    var vertexShaderSource = document.getElementById('vertexShader').innerText;
    //片元着色器源码
    var fragShaderSource = document.getElementById('fragmentShader').innerText;
    //初始化着色器
    var program = initShader(gl,vertexShaderSource,fragShaderSource);
    gl.drawArrays(gl.POINTS,0,1);
    
}




function initShader(gl,vertexShaderSource,fragmentShaderSource){
    //创建顶点着色器对象
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    //创建片元着色器对象
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader,vertexShaderSource);
    gl.shaderSource(fragmentShader,fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    var program = gl.createProgram();
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
}