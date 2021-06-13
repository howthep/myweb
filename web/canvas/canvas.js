const WindowWidth = document.body.clientWidth;
const WindowHeight = document.body.clientHeight;
const Acceleration = WindowWidth
const Friction = WindowWidth
const FrameTime = 0.02;
const MaxV = WindowWidth/3;

var cvs = document.getElementById("cvs");
var context = cvs.getContext("2d");
var eventFlag = false;
var key_pressed = {};
var v_temp = new Vector2(0,0);
var circle = new Sprite(WindowWidth/2, WindowHeight/2,30)
var destination = new Vector2(circle.x,circle.y);
var last_e = new Vector2();
var sum_e = new Vector2();
var Mode = false;
var score = 0;

// TODO: when colliding, v equals zero or brouce back
// TODO: vector2 needs to optimize
cvs.setAttribute("width",WindowWidth-2);
cvs.setAttribute("height",WindowHeight);

var wal = new Wall(1000,0,50,WindowHeight*Math.random());

document.onkeydown = function (e) {
    eventFlag = true;
    console.log(e.key);
    key_pressed[e.key] = true;
}
document.onkeyup = function (e) {
    console.log(e.code+'///')
    if(e.code == 'Space') {
        switchMode();
        return;
    }
    if(e.key == "ArrowLeft"||e.key == "ArrowRight"||e.key == "ArrowDown"||e.key == "ArrowUp")
    {
        key_pressed[e.key] = false;
        eventFlag = false;
        for(i in key_pressed){
            if(key_pressed[i])
            {
                eventFlag = true;
            }
        }
    }
}

document.onmousemove = function(e){
    if(Mode){
        
        destination.x = e.offsetX ;
        destination.y = e.offsetY ;
    }
}

document.getElementById('switch').addEventListener("click",switchMode)

setInterval(main, 1000 * FrameTime);
context.font='30px sans-serif';

function main() {
    if(Mode)
    mouseToMove();
    else
    keyToMove();
    context.clearRect(0, 0, WindowWidth, WindowHeight);
    circle.x += circle.v.x * FrameTime;
    circle.y += circle.v.y * FrameTime;
    circle.x=clampWith(circle.x,0,WindowWidth);
    circle.y=clampWith(circle.y,0,WindowHeight);
    drawCircle(circle);
    drawWall(wal);
    context.fillText("score:"+score, 10, 40 );
    // wal.x--;
    if(circle.v.Length()!=0){
        var speedLine = 0.2;
        drawLine(circle.x,circle.y,circle.x-circle.v.x*speedLine,circle.y-circle.v.y*speedLine);
    }
    // getCord();
}
// interval makes starting to starting in period
// timeout makes finishing to starting in period


function Vpid(dv,kp,ki,kd){
    var e = new Vector2();
    e.Equal(dv);
    sum_e.Add(e);
    // de = dv - last_e
    var de = new Vector2(dv.x-last_e.x,dv.y-last_e.y)
    last_e.Equal(dv);
    // dv = kp*e+ki*sum_e+kd*de
    e.Multiply(kp);
    sum_e.Multiply(ki);
    de.Multiply(kd);
    e.Add(sum_e);
    e.Add(de);
    dv.Equal(e);
}

function keyToMove(){
    var dv = Acceleration * FrameTime
    if (key_pressed.ArrowLeft) {
        v_temp.x -= dv;
    }
    if (key_pressed.ArrowRight) {
        v_temp.x += dv;
    }
    if (key_pressed.ArrowDown) {
        v_temp.y += dv;
    }
    if (key_pressed.ArrowUp) {
        v_temp.y -= dv;
    }
    
    if(!v_temp.isZero())
    {
        v_temp.clamp(dv)
        circle.v.Add(v_temp);
        circle.v.clamp(MaxV);       
    }
    else
        vToZreo(circle.v,Friction * FrameTime);
    v_temp.clamp(0);
}
function mouseToMove(){
    var dv = new Vector2(destination.x-circle.x,destination.y-circle.y);
    // origin kp ki kd
    if(dv.Length()> 0.01)
    {   Vpid(dv,2,0.2,10)
        dv.clamp(Acceleration * FrameTime*2);
        circle.v.Add(dv);
        circle.v.clamp(MaxV);
    }
    else 
    {
        dv.clamp(0);
        circle.v.clamp(0);
        circle.x = destination.x;
        circle.y = destination.y;
    }
}

function switchMode(){
    Mode =!Mode;
    console.log("mode:"+Mode);
}