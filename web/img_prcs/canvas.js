var cvs = document.getElementById('cvs');
var context = cvs.getContext('2d');

// const WindowWidth = document.body.clientWidth;
const WindowWidth = window.innerWidth;
// const WindowHeight = document.body.clientHeight;
const WindowHeight = window.innerHeight;
cvs.setAttribute('width', WindowWidth);
cvs.setAttribute('height', WindowHeight * 0.9);
context.fillRect(0, 0, 50, 50);


function imgCreate(x,y,w,h){
    var img = context.createImageData(w, h);

        
    imgPrcs(img)
    context.putImageData(img, x, y);
}

function imgPrcs(img){
    for (var i = 0; i < img.data.length; i += 4) {
        var color = Math.floor(i/4/100)+150;  
        img.data[i] = color*0.8;
        img.data[i + 1] = color*0.1;
        img.data[i + 2] = color+0.5;
        img.data[i + 3] = 255;
    }

}


imgCreate(0,50,100,100);