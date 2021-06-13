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
    gradient(img,155,200)
    context.putImageData(img, x, y);
}

function gradient(img,min,max){
    var data = img.data;
    for (var i = 0; i < img.data.length; i += 4) {
        var color=Math.floor(i/4/img.width)/img.height*(max-min)+min;
        data[i]=color;
        data[i+1]=color;
        data[i+2]=color;
        data[i+3]=255;
    }
}

var image = new Image();
image.crossOrigin = "Anonymous";
image.src='https://tse2-mm.cn.bing.net/th/id/OIP.Z_i-X1iOJpYTRDIKDp602gHaEK?w=289&h=180&c=7&o=5&pid=1.7'

image.onload=function(){   
    context.drawImage(image,100,100);
    var idata=context.getImageData(100, 100, image.width, image.height);
    decolor(idata.data);
    context.putImageData(idata,100+image.width, 100);
    
}

imgCreate(500,500,200,200)



function decolor(data){
    for(var i =0;i<data.length;i+=4){
        var color = Math.round((data[i]+data[i+1]+data[i+2])/3)
        data[i]=color;
        data[i+1]=color;
        data[i+2]=color;
    }
}