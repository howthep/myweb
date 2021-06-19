//  head.js
//  usually used function

function cutFloatTo(floa,length){
    var k=1;
    for(var i =0;i<length;i++)
        k*=10;
    return Math.round(floa*k)/k;
}
function randomRange(min,max){
    return Math.random()*(max - min)+min ;
}