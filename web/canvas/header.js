// Vector2 
// Sprite
// var test = new Vector2(1,4);
// var test1 = new Vector2(4,3);
// console.log(test.Substract(test1));



function Vector2(x, y) {
    this.name = 'Vector2'
    this.x = x||0;
    this.y = y||0;
    this.Length = function () {
        return cutFloatTo(Math.sqrt(this.x * this.x + this.y * this.y), 3)
    }
    this.Normalize = function () {
        var vector = new Vector2(0, 0);
        var length = this.Length();
        vector.x = cutFloatTo(this.x / length, 4);
        vector.y = cutFloatTo(this.y / length, 4);
        return vector
    }
    this.clamp = function (maxLength) {
        if (this.Length() > maxLength) {
            var vector = new Vector2();
            vector.Equal(this.Normalize());
            this.x = vector.x * maxLength;
            this.y = vector.y * maxLength;
        }
    }
    this.Equal = function (obj) {
        if (obj.name == "Vector2") {

            this.x = obj.x;
            this.y = obj.y;
        }
    }
    this.Add = function (obj) {
        if (obj.name = "Vector2") {
            this.x += obj.x
            this.y += obj.y
            return new Vector2(this.x,this.y)
        }
    }
    this.Multiply = function(num){
        this.x *=num;
        this.y *=num;
        return new Vector2(this.x,this.y)
    }
    this.isZero = function () {
        return this.Length() == 0
    }
    this.Substract = function(obj){
        if (obj.name = "Vector2") {
            
            this.x -= obj.x
            this.y -= obj.y
            return new Vector2(this.x,this.y)
        }

    }
}

function clampWith(value, min, max) {
    if (value < min) value = min;
    if (value > max) value = max;
    return value
}

function cutFloatTo(floa, base) {
    var k = 1;
    for (var i = 0; i < base; i++)
        k *= 10;
    return Math.round(floa * k) / k;
}


function Sprite(px, py, r,vx, vy) {
    this.x = px;
    this.y = py;
    this.v = new Vector2(vx  || 0, vy || 0)
    this.r = r;
}

function Wall(x,y,w,h){
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
}



function vToZreo(obj, friction) {

    if (typeof (obj) == "number") {
        var sign = Math.abs(obj) / obj
        if (sign == 1)
            return ((obj - friction) > 0) ? obj - friction : 0
        else
            return ((obj + friction) < 0) ? obj + friction : 0
    }
    else if (obj.name = "Vector2") {
        var base_vector = new Vector2()
        base_vector.Equal(obj.Normalize());
        obj.x = vToZreo(obj.x, friction)
        obj.y = vToZreo(obj.y, friction)
    }
}



function drawCircle(circle) {
    context.beginPath();
    context.arc(circle.x, circle.y, circle.r, Math.PI / 180 * 0, Math.PI / 180 * 360);
    context.stroke();
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}
function getCord() {
    var x = circle.v.x;
    var y = circle.v.y;
    document.getElementById("Cord").innerHTML = "v:(" + x + ';' + y + ')' + circle.v.Length() + ' Accelerating:' + eventFlag;
}

function drawWall(obj){
    context.fillRect(obj.x,obj.y,obj.w,obj.h);
}
