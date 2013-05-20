canvas = document.getElementById("cv");
surface = canvas.getContext("2d");
//--- The sprite object

function loadImage() 
{ 
    //Update the sprite as soon as the image has been loaded
    update(); 
}

window.collBR = false;

var sprite = 
{ 
    //The X and Y source position of the sprite's image and its height and width
    srcX: 0, 
    srcY: 0, 
    srcW: 0, 
    srcH: 0, 
    //The X and Y position of the sprite on the canvas as well as its height
    x: 0, 
    y: 0, 
    w: 10, 
    h: 10,
    //Getters
    cx: function()
    {
      return this.x + (this.w / 2);
    },
    cy: function()
    {
      return this.y + (this.h / 2);
    }
}; 
//An array to store the game sprites
var sprites = []; 
//Create the sprite.

//Center it on the canvas and push it into the sprites array
var objRedBall = Object.create(sprite);
objRedBall.x = canvas.width / 2;
objRedBall.y = canvas.height / 2;
objRedBall.w = 20;
objRedBall.h = 20;
objRedBall.srcW = 400;
objRedBall.srcH = 400;
sprites.push(objRedBall);

//Load the sprite image
var imgRedBall = new Image(); 
imgRedBall.addEventListener("load", loadImage, false); 
imgRedBall.src = "../images/red.png"; 

var objBlueBall = Object.create(sprite);
objBlueBall.x = 100;
objBlueBall.y = 0;
objBlueBall.w = 20;
objBlueBall.h = 20;
objBlueBall.srcW = 400;
objBlueBall.srcH = 400;
sprites.push(objBlueBall);

var imgBlueBall = new Image();
imgBlueBall.addEventListener("load", loadImage, false);
imgBlueBall.src = "../images/blue.png";

function square(number)
{
  return number * number;
}

function collision()
{
  bluecx = objBlueBall.cx();
  bluecy = objBlueBall.cy();
  redcx = objRedBall.cx();
  redcy = objRedBall.cy();
  dist = Math.sqrt(square((redcx - bluecx)) + square((redcy - bluecy)));
  distdiv = document.getElementById("dtag");
  distdiv.innerHTML = "Blue(" + bluecx + "," + bluecy + ") Red(" + redcx + "," + redcy + ") Distance is : " + dist;
  if(dist <= 20)
  {
    window.collBR = true;
    return true;
  }
  else
  {
    window.collBR = false;
    return false;
  }
}

function update() 
{ 
    //Create the animation loop
    window.requestAnimationFrame(update, canvas); 
    render(); 
} 

function render() 
{ 
    //Clear the previous animation frame
    surface.clearRect(0, 0, canvas.width, canvas.height);
    //Loop through all the sprites in the "sprites" array and use their properties to display them
    if(sprites.length !== 0)
    { 
        for(var i = 0; i < sprites.length; i++) 
        { 
            switch(i)
            {
                case 0:
                    var sprite = sprites[i]; 
                    surface.drawImage 
                    ( 
                        imgRedBall, 
                        sprite.srcX, sprite.srcY, 
                        sprite.srcW, sprite.srcH, 
                        Math.floor(sprite.x), Math.floor(sprite.y), 
                        sprite.w, sprite.h 
                    );
                    break;
                case 1:
                    var sprite = sprites[i]; 
                    surface.drawImage 
                    ( 
                        imgBlueBall, 
                        sprite.srcX, sprite.srcY, 
                        sprite.srcW, sprite.srcH, 
                        Math.floor(sprite.x), Math.floor(sprite.y), 
                        sprite.w, sprite.h 
                    );
            }
        } 
    } 
}

canvas.addEventListener("mousemove", function(event)
{
  collision();
  if(!window.collBR)
  {
    mouseX = event.pageX - canvas.offsetLeft;
    mouseY = event.pageY - canvas.offsetTop;
    objBlueBall.x = mouseX;
    objBlueBall.y = mouseY;
  }
  else
  {
  }
}, false);
