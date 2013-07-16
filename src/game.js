function square(number)
{
  return number * number;
}

function detect_collision()
{
  bluecx = objBlueBall.cx();
  bluecy = objBlueBall.cy();
  for(i = 1; i < 5; i++)
  {
    rball = sprites[i];
    rcx = rball.cx();
    rcy = rball.cy();
    dist = square((rcx - bluecx)) + square((rcy - bluecy));
    if(dist <= 625)
    {
      window.cbr[i-1] = true;
    }
    else
    {
      window.cbr[i-1] = false;
    }
  }
  window.count = 0;
  for(i=1;i<4;i++)
  {
    for(j=i+1;j<5;j++)
    {
      ri = sprites[i];
      rj = sprites[j];
      ricx = ri.cx();
      ricy = ri.cy();
      rjcx = rj.cx();
      rjcy = rj.cy();
      dist = square((ricx - rjcx)) + square((ricy - rjcy));
      if(dist <= 625)
      {
        window.crr[window.count] = true;
      }
      else
      {
        window.crr[window.count] = false;
      }
      window.count++;
    }
  }
}

function moveRed()
{
  for(i =1; i<5; i++)
  {
    rball = sprites[i];
    x = rball.cx() + rball.vx * rball.sp;
    y = rball.cy() + rball.vy * rball.sp;
    right = (rball.w / 2) + x;
    left = x - (rball.w / 2);
    ytop = y - (rball.h / 2);
    bottom = y + (rball.h / 2);

    /*
     * crr[0] = collision 1 & 2
     * crr[1] = collision 1 & 3
     * crr[2] = collision 1 & 4
     * crr[3] = collision 2 & 3
     * crr[4] = collision 2 & 4
     * crr[5] = collision 3 & 4
    */
    
    if(right > canvas.width)
    {
      diff = right - canvas.width;
      rball.vx *= -1;
      x -= diff;
    }
    else if(left < 0)
    {
      diff = 0 - left;
      rball.vx *= -1;
      x += diff; 
    }
    else if(bottom > canvas.height)
    {
      diff = bottom - canvas.height;
      rball.vy *= -1;
      y -= diff;
    }
    else if(ytop < 0)
    {
      diff = 0 - ytop;
      rball.vy *= -1;
      y += diff; 
    }
    else if(window.cbr[i-1])
    {
      window.gameover = true;
      x = rball.cx() + rball.vx * rball.sp;
      y = rball.cy() + rball.vy * rball.sp;
    }

    rball.setx(x);
    rball.sety(y);
  }
  
  detect_collision();
  
  if(window.crr[0])
  {
    resolve_colliding(1, 2);
  }
  else if(window.crr[1])
  {
    resolve_colliding(1, 3);
  }
  else if(window.crr[2])
  {
    resolve_colliding(1, 4);
  }
  else if(window.crr[3])
  {
    resolve_colliding(2, 3);
  }
  else if(window.crr[4])
  {
    resolve_colliding(2, 4);
  }
  else if(window.crr[5])
  {
    resolve_colliding(3, 4);
  }
}

function resolve_colliding(i, j)
{
  b1 = sprites[i];
  b2 = sprites[j];
  
  // The velocity vectors V1 and V2
  var v1x = b1.vx;
  var v1y = b1.vy;
  var v2x = b2.vx;
  var v2y = b2.vy;
  
  // The normal at the point of the collision
  var nx = b1.cx() - b2.cx();
  var ny = b1.cy() - b2.cy();
  
  // The unit normal vector
  var n_mag = Math.sqrt(square(nx) + square(ny));
  var unx = nx / n_mag;
  var uny = ny / n_mag;
  
  // The unit tangent vector at the point of collision
  var utx = uny*-1;
  var uty = unx;
  
  // Projecting the velocity vectors onto the tangent 
  // and normal vectors
  var v1n = unx * v1x + uny * v1y;
  
  var v2n = unx * v2x + uny * v2y;
  
  var v1t = utx * v1x + uty * v1y;
  
  var v2t = utx * v2x + uty * v2y;
  
  /* Calculating the resultant vectors
   * Vector v1t & v2t do not change
   * 
   * Since both the balls have the same mass,
   * v1n and v2n are swapped
   */
  
  var temp = v1n;
  v1n = v2n;
  v2n = temp;
  
  /* Reassigning the resultant vectors to the new 
   * velocity vectors
   */
  
  var v1nx = v1n * unx;
  var v1ny = v1n * uny;
  
  var v1tx = v1t * utx;
  var v1ty = v1t * uty;
  
  var v2nx = v2n * unx;
  var v2ny = v2n * uny;
  
  var v2tx = v2t * utx;
  var v2ty = v2t * uty;

  // New vellocity vectors 
  v1x = v1nx + v1tx;
  v1y = v1ny + v1ty;
  v2x = v2nx + v2tx;
  v2y = v2ny + v2ty;
  
  b1.vx = v1x;
  b1.vy = v1y;
  b2.vx = v2x;
  b2.vy = v2y;
  
  //moveback(i, j);
  //page_log(mesg);
}

function update() 
{
  //Create the animation loop
  if(window.gameover == false)
  {
    moveRed();
    window.requestAnimationFrame(update, canvas); 
    render();
  }
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
  objBlueBall.setx(mousex - objBlueBall.w/2);
  objBlueBall.sety(mousey - objBlueBall.h/2);
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

//Variable to check game state
window.gameover = false;

//Array to check collision of blue red
window.cbr = new Array(4);
for(i in window.cbr)
{
  window.cbr[i] = false;
}

//Array for collision of red with red
window.crr = new Array(6);
for(i in window.crr)
{
  window.crr[i] = false;
}
/*
crr[0] = collision 1 & 2
crr[1] = collision 1 & 3
crr[2] = collision 1 & 4
crr[3] = collision 2 & 3
crr[4] = collision 2 & 4
crr[5] = collision 3 & 4

Collision is checked in loop
12 13 14
23 24
34


*/

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
  
  //The old values of x & y
  oldx: 0,
  oldy: 0,
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
  },
  //Setters
  setx: function(valx)
  {
    this.oldx = this.cx();
    this.x = valx - (this.w / 2);
  },
  sety: function(valy)
  {
    this.oldy = this.cy();
    this.y = valy - (this.h / 2);
  }
}; 
//An array to store the game sprites
var sprites = []; 
//Create the sprite.

var objBlueBall = Object.create(sprite);
objBlueBall.x = 100;
objBlueBall.y = 0;
objBlueBall.w = 25;
objBlueBall.h = 25;
objBlueBall.srcW = 400;
objBlueBall.srcH = 400;
sprites.push(objBlueBall);

var imgBlueBall = new Image();
imgBlueBall.addEventListener("load", loadImage, false);
imgBlueBall.src = "../images/blue.png";

canvas.addEventListener("mousemove",mousemoveHandle, false);

//Center it on the canvas and push it into the sprites array
var r1 = Object.create(sprite);
var redxrand = Math.random() * 200;
var redyrand = Math.random() * 200;
r1.setx(redxrand);
r1.sety(redyrand);
r1.w = 25;
r1.h = 25;
r1.srcW = 400;
r1.srcH = 400;
r1.vx = -1;
r1.vy = -1;
//r1.sp = 0.1;
sprites.push(r1);

var r2 = Object.create(sprite);
redxrand = Math.random() * 200 + 200;
redyrand = Math.random() * 200;
r2.setx(redxrand);
r2.sety(redyrand);
r2.w = 25;
r2.h = 25;
r2.srcW = 400;
r2.srcH = 400;
r2.vx = 1;
r2.vy = -1;
//r2.sp = 0.1;
sprites.push(r2);

var r3 = Object.create(sprite);
redxrand = Math.random() * 200;
redyrand = Math.random() * 200 + 200;
r3.setx(redxrand);
r3.sety(redyrand);
r3.w = 25;
r3.h = 25;
r3.srcW = 400;
r3.srcH = 400;
r3.vx = -1;
r3.vy = 1;
//r3.sp = 0.1;
sprites.push(r3);

var r4 = Object.create(sprite);
redxrand = Math.random() * 200 + 200;
redyrand = Math.random() * 200 + 200;
r4.setx(redxrand);
r4.sety(redyrand);
r4.w = 25;
r4.h = 25;
r4.srcW = 400;
r4.srcH = 400;
r4.vx = 1;
r4.vy = -1;
//r4.sp = 0.1;
sprites.push(r4);

//Load the sprite image
var imgRedBall = new Image(); 
imgRedBall.addEventListener("load", loadImage, false); 
imgRedBall.src = "../images/red.png";