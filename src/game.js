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

function moveback(i, j)
{
  ball_a = sprites[i];
  ball_b = sprites[j];
  var x1 = ball_a.cx();
  var y1 = ball_a.cy();
  var x2 = ball_b.cx();
  var y2 = ball_b.cy();
  var dist = square(x2 - x1) + square(y2 - y1);
  if(dist == 0)
  {
    return;
  }
  var r = Math.sqrt(dist);
  r = (25 - r) / 2;
  var A = y1 - y2;
  var B = x2 - x1;
  var C = x1*y2 - x2*y1;
  var h = x1;
  var k = y1;
  var temp = Math.sqrt(square(A) + square(B)); //   (A^2 + B^2)^1/2
  var a = A  / temp;
  var b = B / temp;
  var d = (A*h + B*k + C) / temp;
  temp = Math.sqrt(square(r) - square(d));          //    (r ^2 - d ^2)^1/2
  var x_a = h - a*d + b*temp;
  var x_b = h - a*d - b*temp;
  var y_a = k - b*d + a*temp;
  var y_b = k - b*d - a*temp;
  /*
   * (x,y)----------------(x1,y1)------------------(x2,y2)
   * dist((x,y) (x1,y1)) + dist((x1,y1) (x2,y2)) = dist((x,y) (x2,y2))
   *
   * (x - x1)^2 + (y - y1)^2 + dist = (x - x2)^2 + (y - y2)^2
   * 
   */
  var temp1 = square(x_a - x2) + square(y_a - y2);
  temp = square(x_a - x1) + square(y_a - y1) + dist;
  if(temp == temp1)
  {
    
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
      for(i in sprites)
      {
        sprites[i].vx *= 0;
        sprites[i].vy *= 0;
      }
      x = rball.cx() + rball.vx * rball.sp;
      y = rball.cy() + rball.vy * rball.sp;
    }
    /*
     * crr[0] = collision 1 & 2
     * crr[1] = collision 1 & 3
     * crr[2] = collision 1 & 4
     * crr[3] = collision 2 & 3
     * crr[4] = collision 2 & 4
     * crr[5] = collision 3 & 4
    */
    if(window.crr[0])
    {
      bounce(1, 2);
    }
    else if(window.crr[1])
    {
      bounce(1, 3);
    }
    else if(window.crr[2])
    {
      bounce(1, 4);
    }
    else if(window.crr[3])
    {
      bounce(2, 3);
    }
    else if(window.crr[4])
    {
      bounce(2, 4);
    }
    else if(window.crr[5])
    {
      bounce(3, 4);
    }
    rball.setx(x);
    rball.sety(y);
  }
}
var logmessage = "";
var temp1 = "";
var ctr = 0;

function log_redballs()
{
  logdiv =document.getElementById("rbstat");
  logdiv.innerHTML = "";
  var logstr = "";
  for(i=1;i<5;i++)
  {
    logstr = "Ball " + i + " : vx : " + sprites[i].vx + "; vy : " + sprites[i].vy + " (" + sprites[i].cx() + "," + sprites[i].cy() + ")</br>";
    logdiv.innerHTML += logstr;
  }
}

function page_log(msg)
{
  if(msg != logmessage && msg != temp1)
  {
    div_log = document.getElementById("pagelog");
    if(ctr>50)
    {
      return;
    }
    div_log.innerHTML += msg;
    temp1 = logmessage;
    logmessage = msg;
    ctr++;
  }
}

function bounce(i, j)
{
  b1 = sprites[i];
  b2 = sprites[j];
  mesg = "B1 is " + b1.vx + ", " + b1.vy + " and B2 is " + b2.vx + ", " + b2.vy;
  if(b1.vx != b2.vx && b1.vy == b2.vy)
  {
    b1.vx *= -1;
    b2.vx *= -1;
    mesg += " Case 1 </br>";
  }
  else if(b1.vy != b2.vy && b1.vx == b2.vx)
  {
    b1.vy *= -1;
    b2.vy *= -1;
    mesg += "Case 2 </br>";
  }
  else if(b1.vx == b1.vy && b2.vx == b2.vy || b1.vx != b1.vy && b2.vx != b2.vy)
  {
    b1.vx *= -1;
    b1.vy *= -1;
    b2.vx *= -1;
    b2.vy *= -1;
    mesg += "Case 3 </br>";
  }
  else
  {
    b1.vx *= -1;
    b1.vy *= -1;
    b2.vx *= -1;
    b2.vy *= -1;
    mesg += "Case else </br>";
  }
  moveback(i, j);
  page_log(mesg);
  /*
   * vx1 != vx2 && vy1 == vy2 ==>> x * -1
   * 
   * 
  */
  //b1.vx *= -1;
  //b1.vy *= -1;
  //b2.vx *= -1;
  //b2.vy *= -1;
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
  log_redballs();
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