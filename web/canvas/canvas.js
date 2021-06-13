const WindowWidth = document.body.clientWidth;
const WindowHeight = document.body.clientHeight;
const MaxV = Math.max(WindowHeight, WindowWidth) / 2;
const Acceleration = MaxV * 1.3
const Friction = WindowWidth
const FrameTime = 0.02;
const wallsMaxLength = clampWith(Math.floor(WindowWidth / 400), 2, 5)

var wallSpeed = Math.ceil(Math.max(WindowHeight, WindowWidth) * 0.002);
var cvs = document.getElementById("cvs");
var context = cvs.getContext("2d");
var eventFlag = false;
var key_pressed = {};
var v_temp = new Vector2(0, 0);
var circle = new Sprite(WindowWidth / 2, WindowHeight / 2, 30)
var destination = new Vector2(circle.x, circle.y);
var last_e = new Vector2();
var sum_e = new Vector2();
var Mode = false;
var score = 0;
var Death = false;

// TODO: when colliding, v equals zero or brouce back
// TODO: vector2 needs to optimize
// TODO: generation of walls needs to optimize, for lacking vairable interspace
cvs.setAttribute("width", WindowWidth - 2);
cvs.setAttribute("height", WindowHeight);
console.log(WindowWidth)
var walls = [];
walls.push(new Wall());
walls[0].randomize();
// function Wall(x, uh, eh, w, tail) 

document.onkeydown = function (e) {
    eventFlag = true;
    key_pressed[e.key] = true;
}


document.onkeyup = function (e) {
    console.log(e.code + '///')
    if (e.code == 'Space') {
        switchMode();
        return;
    }
    if (e.code == 'KeyR') {
        Death = false;
        console.log("restart")
        return;
    }
    if (e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown" || e.key == "ArrowUp") {
        key_pressed[e.key] = false;
        eventFlag = false;
        for (i in key_pressed) {
            if (key_pressed[i]) {
                eventFlag = true;
            }
        }
    }
}

document.onmousemove = function (e) {
    if (Mode) {

        destination.x = e.offsetX;
        destination.y = e.offsetY;
    }
}

document.getElementById('switch').addEventListener("click", switchMode)



setInterval(main, 1000 * FrameTime);
context.font = '30px sans-serif';


function main() {
    
    if (isCollision()) {
        Death = true;
        var str ='Game Over!';
        var font_size = WindowWidth/10*1.6;
        context.fillStyle='#aaa';
        context.textAlign='center';
        context.font= font_size + 'px sans-serif';
        context.fillText(str,(WindowWidth)/2,WindowHeight*2/3)
        context.fillStyle='#000';
    }
    else {
        move();
        render();
    }
}

function move() {
    // get v
    if (Mode)
        mouseToMove();
    else
        keyToMove();
    // to move
    context.clearRect(0, 0, WindowWidth, WindowHeight);
    circle.x += circle.v.x * FrameTime;
    circle.y += circle.v.y * FrameTime;
    circle.x = clampWith(circle.x, 0, WindowWidth);
    circle.y = clampWith(circle.y, 0, WindowHeight);
    // draw
}
function render() {
    drawCircle(circle);
    // draw walls
    
    for (var i = 0; i < walls.length; i++) {
        var wal = walls[i];
        drawWall(WindowHeight, wal);
        // if(walls.length < wallsMaxLength)
            wal.x -= wallSpeed;

            if (wal.x < -wal.w) {
                wal.randomize();
                wal.x = WindowWidth;
            }
            if (walls.length < wallsMaxLength && i == walls.length - 1 && (wal.x + wal.w) < WindowWidth) {
                var wall = new Wall();
                wall.randomize();
                wall.x = wal.tail + wal.w + WindowWidth;
                walls.push(wall);
            }
        
    }
    context.fillStyle = '#aaa';

    context.fillText("score:" + score, 10, 40);
    context.fillStyle = 'black';

    if (circle.v.Length() != 0) {
        var speedLine = 0.2;
        drawLine(circle.x, circle.y, circle.x - circle.v.x * speedLine, circle.y - circle.v.y * speedLine);
    }
}
// getCord();}
// interval makes starting to starting in period
// timeout makes finishing to starting in period

function isCollision() {
    // get nearest wall
    var near_wal = walls[0];
    var index = 1;
    var near_dist = getDistanceWalAndCircle(near_wal,circle);
    for (var i = 0; i < walls.length; i++) {
        var wal = walls[i];
        var dist = getDistanceWalAndCircle(wal,circle);
        if(dist<near_dist)
        {
            near_wal = wal;
            index = i+1;
            near_dist = dist;
        }
    }
    // judge collision
    if(near_dist > circle.r)
        return false
    else if(near_dist == 0){
        // at empty wall area
        // center - r >uh &&  center +r < uh+eh
        if(circle.y-circle.r > near_wal.uh && circle.y+circle.r < near_wal.uh+ near_wal.eh)
            return false;
        else return true;
    }
    else{
        var base_point = new Vector2(near_wal.x,near_wal.uh);
        var a = [];
        a.push(base_point);
        a.push(new Vector2(base_point.x,base_point.y+near_wal.eh));
        a.push(new Vector2(base_point.x+near_wal.w,base_point.y+near_wal.eh));
        a.push(new Vector2(base_point.x+near_wal.w,base_point.y));
        for(i in walls){
            var pd=getPointDistance(circle,a[i])
            if(pd <circle.r)
            {
                console.log(pd)
                return true;
            }
        }
    }
    return false;
}

function restart() { 
    ;
}

function getPointDistance(point1,point2) { 
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return cutFloatTo(Math.sqrt(dx*dx+dy*dy));
 }


function getDistanceWalAndCircle(wal,circle) {
    var distance=wal.x -circle.x;

    if (distance>0)
        return cutFloatTo(distance,3);
    else if (circle.x-wal.x < wal.w)
        return 0;
    else 
        return cutFloatTo((circle.x-wal.x-wal.w),3);
  }

function Vpid(dv, kp, ki, kd) {
    var e = new Vector2();
    e.Equal(dv);
    sum_e.Add(e);
    // de = dv - last_e
    var de = new Vector2(dv.x - last_e.x, dv.y - last_e.y)
    last_e.Equal(dv);
    // dv = kp*e+ki*sum_e+kd*de
    e.Multiply(kp);
    sum_e.Multiply(ki);
    de.Multiply(kd);
    e.Add(sum_e);
    e.Add(de);
    dv.Equal(e);
}

function keyToMove() {
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

    if (!v_temp.isZero()) {
        v_temp.clamp(dv)
        circle.v.Add(v_temp);
        circle.v.clamp(MaxV);
    }
    else
        vToZreo(circle.v, Friction * FrameTime);
    v_temp.clamp(0);
}
function mouseToMove() {
    var dv = new Vector2(destination.x - circle.x, destination.y - circle.y);
    // origin kp ki kd
    if (dv.Length() > 0.01) {
        Vpid(dv, 2, 0.2, 10)
        dv.clamp(Acceleration * FrameTime * 2);
        circle.v.Add(dv);
        circle.v.clamp(MaxV);
    }
    else {
        dv.clamp(0);
        circle.v.clamp(0);
        circle.x = destination.x;
        circle.y = destination.y;
    }
}

function switchMode() {
    Mode = !Mode;
    console.log("mode:" + Mode);
}
