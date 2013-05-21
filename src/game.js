function square(number)
{
  return number * number;
}

function collision()
{
  bluecx = objBlueBall.cx();
  bluecy = objBlueBall.cy();
  for(i = 1; i < 5; i++)
  {
    rball = sprites[i];
    rcx = rball.cx();
    rcy = rball.cy();
    dist = Math.sqrt(square((rcx - bluecx)) + square((rcy - bluecy)));
    if(dist <= 20)
    {
      window.cbr[i-1] = true;
    }
    else
    {
      window.cbr[i-1] = false;
    }
  }
}

function moveRed()
{
  for(i =1; i<5; i++)
  {
    rball = sprites[i];
    x = rball.x + rball.vx * rball.sp;
    y = rball.y + rball.vy * rball.sp;
    right = rball.w + x;
    left = x;
    top = y;
    bottom = y + rball.h;
    if(right > canvas.width)
    {
      diff = right - canvas.width;
      rball.vx = -1;
      x -= diff; 
    }
    else if(left < 0)
    {
      diff = 0 - left;
      rball.vx = 1;
      x += diff; 
    }
    else if(bottom > canvas.height)
    {
      diff = bottom - canvas.height;
      rball.vy = -1;
      y -= diff;
    }
    else if(top < 0)
    {
      diff = 0 - top;
      rball.vy = 1;
      y += diff;
    }
    else if(window.cbr[i-1])
    {
      rball.vx *= -1;
      rball.vy *= -1;
      x = rball.x + rball.vx * rball.sp;
      y = rball.y + rball.vy * rball.sp;
    }
    rball.x = x;
    rball.y = y;
  }
}

function update() 
{ 
  //Create the animation loop
  collision();
  moveRed();
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
      if(i==0)
      {
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
      else
      {
        var sprite = sprites[i]; 
        surface.drawImage 
        ( 
          imgRedBall, 
          sprite.srcX, sprite.srcY, 
          sprite.srcW, sprite.srcH, 
          Math.floor(sprite.x), Math.floor(sprite.y), 
          sprite.w, sprite.h 
        );
      } 
    } 
  }
}

function move(mousex, mousey)
{
  objBlueBall.x = mousex - objBlueBall.w/2;
  objBlueBall.y = mousey - objBlueBall.h/2;
}

function mousemoveHandle(event)
{
  mouseX = event.pageX - canvas.offsetLeft;
  mouseY = event.pageY - canvas.offsetTop;
  move(mouseX, mouseY);
}

function loadImage() 
{ 
  //Update the sprite as soon as the image has been loaded
  update(); 
}

window.cbr = new Array(4);
window.cbr[0] = false;
window.cbr[1] = false;
window.cbr[2] = false;
window.cbr[3] = false;

canvas = document.getElementById("cv");
canvas.style.cursor = "none";
surface = canvas.getContext("2d");
//--- The sprite object

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
  
  //Direction Vectors
  vx: 0,
  vy: 0,
  //Magnitude
  sp: 1,
  //Getters
  cx: function()
  {
    return this.x + (this.w / 2);
  },
  cy: function()
  {
    return this.y + (this.h / 2);
  },
  left: function()
  {
    return this.x;
  },
  right: function()
  {
    return this.x + this.w;
  },
  top: function()
  {
    return this.y;
  },
  bottom: function()
  {
    return this.y + this.h;
  }
}; 
//An array to store the game sprites
var sprites = []; 
//Create the sprite.

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

canvas.addEventListener("mousemove",mousemoveHandle, false);

//Center it on the canvas and push it into the sprites array
var r1 = Object.create(sprite);
r1.x = 50;
r1.y = 20;
r1.w = 20;
r1.h = 20;
r1.srcW = 400;
r1.srcH = 400;
r1.vx = 1;
r1.vy = -1;
r1.sp = 0.5;
sprites.push(r1);

var r2 = Object.create(sprite);
r2.x = 100;
r2.y = 60;
r2.w = 20;
r2.h = 20;
r2.srcW = 400;
r2.srcH = 400;
r2.vx = -1;
r2.vy = 1;
r2.sp = 0.2;
sprites.push(r2);

var r3 = Object.create(sprite);
r3.x = 150;
r3.y = 100;
r3.w = 20;
r3.h = 20;
r3.srcW = 400;
r3.srcH = 400;
r3.vx = 1;
r3.vy = 1;
r3.sp = 0.5;
sprites.push(r3);

var r4 = Object.create(sprite);
r4.x = 200;
r4.y = 140;
r4.w = 20;
r4.h = 20;
r4.srcW = 400;
r4.srcH = 400;
r4.vx = -1;
r4.vy = -1;
r4.sp = 0.3;
sprites.push(r4);

//Load the sprite image
var imgRedBall = new Image(); 
imgRedBall.addEventListener("load", loadImage, false); 
imgRedBall.src = "../images/red.png";
