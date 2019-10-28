const { createCanvas, loadImage,Image } = require('canvas')
const fs=require('fs')

var source='images/cat.png';

const canvas = createCanvas(200, 400);
const ctx = canvas.getContext('2d');

var factor=1
var wd,ht;
var myImg=initializePlayGround(source);
wd=canvas.width;
ht=canvas.height;
console.log(wd);
console.log(ht);


console.log(canvas.width + " ++ " + canvas.height);


var myImageData=ctx.getImageData(0,0,myImg.width,myImg.height);
console.log(myImageData);

greyscale(myImageData);

for(let y=0;y<ht;y++){
	for(let x=0;x<wd;x++){
		
		var index=getIndex(x,y);

		var r=  myImageData.data[index];
		var g=  myImageData.data[index + 1];
		var b=  myImageData.data[index + 2];
		var a=  myImageData.data[index + 3];


		var newR=find_closest_palette_color(r);
        var newG=find_closest_palette_color(g);
        var newB=find_closest_palette_color(b);
        var newA=  find_closest_palette_color(a);

        myImageData.data[index] = newR;
        myImageData.data[index + 1] = newG;
        myImageData.data[index + 2] = newB;
        myImageData.data[index + 3] = newA;


       // var str="[" + newR + " , " + newG + " , " + newB + "]     "; 
      //  console.log(str);
        

        //Calculating quantization error of a pixel.
        var quant_error_R=r-newR;
        var quant_error_G=g-newG;
        var quant_error_B=b-newB;
        var quant_error_A=a-newA;

        //
        index = getIndex(x+1,y);
        r=  myImageData.data[index]+(quant_error_R*7/16.0);
        g=  myImageData.data[index + 1]+(quant_error_G*7/16.0);
        b=  myImageData.data[index + 2]+(quant_error_B*7/16.0);
        a=  myImageData.data[index + 3]+(quant_error_A*7/16.0);
        myImageData.data[index] = r;
        myImageData.data[index + 1] = g;
        myImageData.data[index + 2] = b;
        myImageData.data[index + 3] = a;

        index = getIndex(x-1,y+1);
        r=  myImageData.data[index]+(quant_error_R*3/16.0);
        g=  myImageData.data[index + 1]+(quant_error_G*3/16.0);
        b=  myImageData.data[index + 2]+(quant_error_B*3/16.0);
        a=  myImageData.data[index + 3]+(quant_error_A*3/16.0);
        myImageData.data[index] = r;
        myImageData.data[index + 1] = g;
        myImageData.data[index + 2] = b;
        myImageData.data[index + 3] = a;

        index = getIndex(x,y+1);
        r=  myImageData.data[index]+(quant_error_R*5/16.0);
        g=  myImageData.data[index + 1]+(quant_error_G*5/16.0);
        b=  myImageData.data[index + 2]+(quant_error_B*5/16.0);
        a=  myImageData.data[index + 3]+(quant_error_A*5/16.0);
        myImageData.data[index] = r;
        myImageData.data[index + 1] = g;
        myImageData.data[index + 2] = b;
        myImageData.data[index + 3] = a;

        index = getIndex(x+1,y+1);
        r=  myImageData.data[index]+(quant_error_R*1/16.0);
        g=  myImageData.data[index + 1]+(quant_error_G*1/16.0);
        b=  myImageData.data[index + 2]+(quant_error_B*1/16.0);
        a=  myImageData.data[index + 3]+(quant_error_A*1/16.0);
        myImageData.data[index] = r;
        myImageData.data[index + 1] = g;
        myImageData.data[index + 2] = b;
        myImageData.data[index + 3] = a;



        
	}
}
ctx.putImageData(myImageData,0,0);

fs.writeFile('message.txt',canvas.toDataURL(),(err)=>{
	if(err) console.log(err);
	else console.log('success');
});




function initializePlayGround(path){
    const img = new Image();

   

	img.onload=function(){
        console.log(img.width);
        console.log(img.height);
		canvas.width=img.width;
		canvas.height=img.height;
		ctx.drawImage(img,0,0);
	}
	img.src=path;
	return img;
}

function getIndex(x,y){
    return (x+(y*wd))*4;
}

function find_closest_palette_color(old){
    return Math.round(factor*old/255)*(255/factor)
}

function greyscale(img){
    for(let y=0;y<ht;y++){
        for(let x=0;x<wd;x++){
            var index=getIndex(x,y);
            var r=  img.data[index];
		    var g=  img.data[index + 1];
            var b=  img.data[index + 2];
            
            var v = 0.2126*r + 0.7152*g + 0.0722*b;

            img.data[index]=img.data[index+1]=img.data[index+2]=v;
        }
    }
}