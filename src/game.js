function square(number)
{
  return number * number;
}

function detect_collision()
{
  // Detect blue colliding with any red ball
  
  bluecx = sprites[0].cx();
  bluecy = sprites[0].cy();
  
  for(i = 1; i < sprites.length; i++)
  {
    rball = sprites[i];
    
    rcx = rball.cx();
    rcy = rball.cy();
    
    dist = square((rcx - bluecx)) + square((rcy - bluecy));
    
    if(dist <= 625)
    {
      window.gamestate = "gameover";
      window.gravity = 0.05;
    }
  }
  
  // Detect collisions between the red balls
  
  for(i=1;i<sprites.length;i++)
  {
    for(j=i+1;j<sprites.length;j++)
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
        // Resolve collisions on detection
        resolve_colliding(ri, rj);
        //add_ball_sprite(200, 200);
        var mx = (ricx + rjcx) / 2;
        var my = (ricy + rjcy) / 2;
      }
    }
  }
}

function moveRed()
{
  /* Assign new coordinated to the red balls
   * 
   * Starts when the timer goes off
   * 
   * Check if any of the balls are out of the canvas
   * If yes, reassign them to new bounced coordinates
   */
  
  if(window.gamestate != "started")
  {
    return;
  }
  
  for(i =1; i<sprites.length; i++)
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
    rball.setx(x);
    rball.sety(y);
  }
  
  detect_collision();
}

function falldown()
{
  if(window.gamestate != "gameover")
  {
    return ;
  }
  
  for(i =0; i<sprites.length; i++)
  {
    ball = sprites[i];
    ball.vy += window.gravity;
    x = ball.cx() + ball.vx * ball.sp;
    y = ball.cy() + ball.vy * ball.sp;
    right = (ball.w / 2) + x;
    left = x - (ball.w / 2);
    ytop = y - (ball.h / 2);
    bottom = y + (ball.h / 2);
    
    if(right > canvas.width)
    {
      diff = right - canvas.width;
      ball.vx *= -0.2;
      x -= diff;
    }
    else if(left < 0)
    {
      diff = 0 - left;
      ball.vx *= -0.2;
      x += diff; 
    }
    else if(bottom > canvas.height)
    {
      diff = bottom - canvas.height;
      ball.vy *= -0.6;
      y -= diff;
    }
    else if(ytop < 0)
    {
      diff = 0 - ytop;
      ball.vy *= -1;
      y += diff; 
    }
    ball.setx(x);
    ball.sety(y);
  }
  detect_collision();
}

function resolve_colliding(b1, b2)
{  
  // The velocity vectors V1 and V2
  var v1 = Object.create(vector);
  v1.setxy(b1.vx, b1.vy);
  
  var v2 = Object.create(vector);
  v2.setxy(b2.vx, b2.vy);
  
  // The normal vector at the point of the collision
  var un = Object.create(vector);
  un.setxy(b1.cx() - b2.cx(), b1.cy() - b2.cy());

  // The unit normal vector
  un.unit_vector();
  
  // The unit tangent vector at the point of collision
  var ut = Object.create(vector);
  ut.setxy(-1*un.vy, un.vx);
  
  // Projecting the velocity vectors onto the tangent 
  // and normal vectors
  var v1n = v1.dot_vector(un);
  var v2n = v2.dot_vector(un);
  var v1t = v1.dot_vector(ut);
  var v2t = v2.dot_vector(ut);
  
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
  var new_v1n = Object.create(vector);
  new_v1n.scalar_vector(v1n, un);

  var new_v1t = Object.create(vector);
  new_v1t.scalar_vector(v1n, ut);
  
  var new_v2n = Object.create(vector);
  new_v2n.scalar_vector(v2n, un);
  
  var new_v2t = Object.create(vector);
  new_v2t.scalar_vector(v2t, ut);

  // New vellocity vectors 
  v1.add_vector(new_v1n, new_v1t);
  v2.add_vector(new_v2n, new_v2t)
  
  b1.vx = v1.vx;
  b1.vy = v1.vy;
  b2.vx = v2.vx;
  b2.vy = v2.vy;
  
}

function update() 
{
  //Create the animation loop
  if(window.gamestate == "started" || window.gamestate == "starting")
  {
    moveRed();
    window.requestAnimationFrame(update, canvas); 
    render();
  }
  else if(window.gamestate == "gameover")
  {
    falldown();
    window.requestAnimationFrame(update, canvas); 
    render();
  }
} 

function render()
{
  if(window.count < 3000 && window.gamestate == "started")
  {
    window.count++;
  }
  else if(window.gamestate == "started")
  {
    add_ball_sprite(200, 200, 0);
    window.count = 0;
    window.gameScore++;
  }
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
  sprites[0].setx(mousex);
  sprites[0].sety(mousey);
}

function mousemoveHandle(event)
{
  mouseX = event.pageX - canvas.offsetLeft;
  mouseY = event.pageY - canvas.offsetTop;
  if(window.gamestate == "started" || window.gamestate == "starting")
  {
    move(mouseX, mouseY);
  }
}

function loadImage() 
{
  //Update the sprite as soon as the image has been loaded
  update(); 
}

function gameStart()
{
  setTimeout(function(){
    window.gamestate = "started";
  }, 2000);
}

function add_ball_sprite(x, y, i)
{
  objBall = Object.create(sprite);
  objBall.setx(Math.random() * 200 + x);
  objBall.sety(Math.random() * 200 + y);
  objBall.vx = -1 * Math.random();
  objBall.vy = Math.random();
  if(i==0)
  {
    objBall.vx = 0;
    objBall.vy = 0;
    setTimeout(function(){
      sprites[sprites.length - 1].vx = 0;
      sprites[sprites.length - 1].vy = 1;
    }, 1000);
  }
  sprites.push(objBall);
}

var vector =
{
  vx: 0,
  vy: 0,
  mag: 0,
  add_vector: function(vector, vector1)
  {
    this.setxy(vector.vx + vector1.vx, vector.vy + vector1.vy);
  },
  dot_vector: function(vector)
  {
    return this.vx * vector.vx + this.vy * vector.vy;
  },
  scalar_vector: function(scalar, vector)
  {
    this.setxy(scalar*vector.vx, scalar*vector.vy);
  },
  setxy: function(x, y)
  {
    this.vx = x;
    this.vy = y;
    this.mag = Math.sqrt(square(x) + square(y));
  },
  unit_vector: function()
  {
    this.setxy(this.vx / this.mag, this.vy / this.mag);
  },
};

var sprite = //--- The sprite object
{ 
  //The X and Y source position of the sprite's image and its height and width
  srcX: 0, 
  srcY: 0, 
  srcW: 400, 
  srcH: 400, 
  //The X and Y position of the sprite on the canvas as well as its height
  x: 0, 
  y: 50, 
  w: 25, 
  h: 25,
  
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
    this.x = valx - (this.w / 2);
  },
  sety: function(valy)
  {
    this.y = valy - (this.h / 2);
  }
};

//Variables of the game
window.gamestate = "starting";
window.gameScore = 0;
window.count = 0;
window.gravity = 0.1;

canvas = document.getElementById("cv");
canvas.style.cursor = "none";
surface = canvas.getContext("2d");

//An array to store the game sprites
var sprites = []; 

// Sprite for the blue ball
add_ball_sprite(200, 200, 1);

var imgBlueBall = new Image();
imgBlueBall.addEventListener("load", loadImage, false);
imgBlueBall.src = "../images/blue.png";

canvas.addEventListener("mousemove",mousemoveHandle, false);

// Adding sprites for the red balls

add_ball_sprite(0, 0, 1);
add_ball_sprite(0, 200, 1);
add_ball_sprite(200, 0, 1);
add_ball_sprite(200, 200, 1);
gameStart();

//Load the sprite image
var imgRedBall = new Image(); 
imgRedBall.addEventListener("load", loadImage, false); 
imgRedBall.src = "../images/red.png";