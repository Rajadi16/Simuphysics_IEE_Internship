// verticalBounce.js

// Global variables
let ball, ground;
let ballRadius = 20;
let initialYVelocity = -8;
let elasticity = 0.8;
let ballX = 400; // Center of the canvas
let ballY = 400; // Initial height

function projectileMotion(yVel, bounce) {
  initialYVelocity = yVel;
  elasticity = bounce;

  // Create the ball with minimal friction and no air resistance
  ball = Bodies.circle(ballX, ballY, ballRadius, {
    restitution: elasticity,
    friction: 0, // No friction
    frictionAir: 0, // No air resistance
    density: 0.004,
    render: { fillStyle: '#f55a3c' }
  });
  
  // Set initial velocity
  Body.setVelocity(ball, { x: 0, y: initialYVelocity });
  
  // Create ground with no friction
  ground = Bodies.rectangle(400, 575, 800, 50, { 
    isStatic: true, 
    friction: 0, // No friction on ground
    render: { fillStyle: '#28ba3eff' } 
  });
  
  // Add bodies to the world
  Composite.add(world, [ball, ground]);
}

function resetScene() { //for the reset button
  // Clear the world
  Runner.stop(runner);
  Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

  // Recreate the scene
  projectileMotion(initialYVelocity, elasticity);
  ResetGUI();
}

function resetparams() { //for the slider
  Runner.stop(runner);
  isPlaying = false;
  Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

  // Recreate the scene
  projectileMotion(initialYVelocity, elasticity);
}

const guiParams = {
  yVelocity: initialYVelocity,
  elasticity: elasticity
};

const gui = new lil.GUI();

const velY = gui.add(guiParams, 'yVelocity', -20, 0).step(0.1)
  .name("Initial Velocity Y")
  .onChange(value => {
    initialYVelocity = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("y velocity changed");
    if (ball) {
      Matter.Body.setVelocity(ball, { x: 0, y: value });
    }
  });

const elasticityControl = gui.add(guiParams, 'elasticity', 0, 1).step(0.05)
  .name("Elasticity (Bounce)")
  .onChange(value => {
    elasticity = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("elasticity changed");
  });

function ResetGUI() {
  guiParams.yVelocity = initialYVelocity;
  guiParams.elasticity = elasticity;
  velY.setValue(initialYVelocity);
  elasticityControl.setValue(elasticity);
  velY.updateDisplay();
  elasticityControl.updateDisplay();
}

// Initialize the vertical bouncing ball after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure the world and engine are available
  if (typeof world !== 'undefined' && typeof engine !== 'undefined') {
    projectileMotion(initialYVelocity, elasticity);
    
    // Add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
  }
});