// projectile.js
//when reset, just the position is changing, im not putting stuff back to initial. 

// Global variables
let blockHeight = 100;
let xVelocity = 4;
let yVelocity = -4;
let block, body;

// ground(common to questions with a ground-this exact code.)
const ground = Bodies.rectangle(400, 575, 800, 50, { isStatic: true,render:{ fillStyle: '#28ba3eff'}});

//height of the body from the ground. defined through a block. 
const blockWidth = 60;

//circle parameters
const circleRadius = 20;

// Ground top edge
const groundTop = 550; // center - half height = 550 

function projectileMotion(height, xVel, yVel){
  blockHeight = height;
  xVelocity = xVel;
  yVelocity = yVel;

  // Block center y
  let blockY = groundTop - blockHeight / 2;

  // Circle center y (on top of block)
  let circleY = blockY - blockHeight / 2 - circleRadius;

  // Create block
  block = Bodies.rectangle(100, blockY, blockWidth, blockHeight, {
    isStatic: true,
    render: { fillStyle: '#3d3dc1ff' }
  });
  
  body = Bodies.circle(100, circleY, 20,{restitution: 0.0, friction: 0.1, density: 0.004, render:{ fillStyle: '#f55a3c'}});
  Body.setVelocity(body, { x: xVelocity, y: yVelocity });
  Composite.add(world,[block,body, ground]);
}

function resetScene() {//for the reset button
  // Clear the world
  Runner.stop(runner);
    Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

    // Recreate the scene
    projectileMotion(blockHeight, xVelocity, yVelocity);
    ResetGUI();
  }

function resetparams(){//for the slider
    Runner.stop(runner);
    isPlaying=false;
    Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

    // Recreate the scene
    projectileMotion(blockHeight, xVelocity, yVelocity);
  }

const guiParams = {
    blockHeight: blockHeight,
    xVelocity: xVelocity,
    yVelocity: yVelocity,
};

const gui = new lil.GUI();

const velX=gui.add(guiParams, 'xVelocity', -20, 20).step(0.1).name("Body Velocity X").onChange(value => {xVelocity=value;resetparams();playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';console.log("x velocity changed");
    Matter.Body.setVelocity(body, { x: value, y: body.velocity.y });
});

const velY=gui.add(guiParams, 'yVelocity', -20, 20).step(0.1).name("Body Velocity Y").onChange(value => {yVelocity=-value;resetparams();playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';console.log("y velocity changed")
    Matter.Body.setVelocity(body, { x: body.velocity.x, y: -value });  
});

const blockh=gui.add(guiParams,'blockHeight',0,500).step(0.1).name("Height of object from ground").onChange(value=>{blockHeight=value;resetparams();playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';console.log("height changed")
});

function ResetGUI() {
    guiParams.xVelocity = xVelocity;
    guiParams.yVelocity = yVelocity;
    velX.setValue(xVelocity);
    velY.setValue(yVelocity);
    velX.updateDisplay();
    velY.updateDisplay();
}

projectileMotion(100,4,-4);
//change the behavior on reset
//when increasing the height of the body, the y position must increase also , the block must be replaced with a different block of different height