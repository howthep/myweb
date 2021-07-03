// Problem: can't show image
function main() {
  const canvas = document.getElementById("cvs");
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  canvas.setAttribute("width", winWidth);
  if (winWidth < 1000) canvas.setAttribute("height", winHeight * 0.7);
  else canvas.setAttribute("height", winHeight * 0.9);

  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }
  const vertexShaderSource = document.getElementById('vertexShader').innerText;
  const fragShaderSource = document.getElementById('fragmentShader').innerText;

  if (!initShaders(gl, vertexShaderSource, fragShaderSource)) {
    // create program so that getAttribLocation can call gl.program
    console.log("Initiation Failed!");
    return;
  }

  let viewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  let vmat = new Matrix4();
  vmat.setPerspective(30,1920/1080,1,100);
  vmat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(viewMatrix, false, vmat.elements);
  
  var vertexArr = [
    1,1,1,1,1,1,
    -1,1,1,1,0,1,
    -1,-1,1,1,0,0,
    1,-1,1,1,1,0,
    1,-1,-1,0,1,0,
    1,1,-1,0,1,1,
    -1,1,-1,0,0,1,
    -1,-1,-1,0,0,0,
  ];
  var indexArr=[
    0,1,2,0,2,3,
    0,3,4,0,4,5,
    0,5,6,0,6,1,
    1,6,7,1,7,2,
    7,4,3,7,3,2,
    4,7,6,4,6,5
  ]
  let n = render(gl, vertexArr,indexArr);
  
  let x = 3;
  let y = 3;
  document.onkeydown = function (e) {
    console.log(e.code);
    let code = e.code;
    let step = 0.1;
    if (code == "KeyD")
    x += step;
    if (code == "KeyA")
    x -= step;
    if (code == "KeyW")
    y += step;
    if (code == "KeyS")
    y -= step;
    x=cutFloatTo(x,2);
    vmat.setPerspective(30,1920/1080,1,100);
    vmat.lookAt(x, y, 7, 0, 0, 0, 0, 1, 0);
    viewdraw(vmat, viewMatrix, gl,n);
    document.getElementById("text").innerText = "x:"+x+"~~~~之后的就不学了，学babylon.js去了";
  }
}

function viewdraw(mat, viewMatrix, gl,n) {
  gl.uniformMatrix4fv(viewMatrix, false, mat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function render(gl, vertexSizeColor,indexArray) {
  let n = initVertexBuffer(gl, vertexSizeColor,indexArray);
  if (n <= 0) {
    console.log('Failed to initVertexBuffer');
    return;
  }
  // console.log(vertexSizeColor);
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  // gl.drawArrays(gl.POINTS, 0, n);

  // gl.drawArrays(gl.LINES, 0, n);
  // gl.drawArrays(gl.LINE_STRIP, 0, n);
  // gl.drawArrays(gl.LINE_LOOP, 0, n);

  // gl.drawArrays(gl.TRIANGLES, 0, n);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //odd:[n,n+1,n+2] even:[n,n-1,n+1]
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  // gl.drawArrays(gl.PONITS, 0, n);
  // gl.drawArrays(gl.LINES, 0, n);
  console.log('render end');
  return n;
}

function initVertexBuffer(gl, vertexArr,indexArr) {
  var vsc = new Float32Array(vertexArr);
  var vscBuffer = gl.createBuffer();
  let index = new Uint8Array(indexArr);
  let idxBuffer = gl.createBuffer();
  if (!vscBuffer) {
    console.log("Failed to create vertexBuffer");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vscBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vsc, gl.STATIC_DRAW);
  var FSIZE = vsc.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,index,gl.STATIC_DRAW);
  return index.length;
}

