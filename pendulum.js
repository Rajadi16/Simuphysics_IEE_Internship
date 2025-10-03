// pendulum.js

// Global variables
let pendulumBall, pendulumConstraint;
let pivotX = 400;
let pivotY = 230;
let pendulumLength = 200;
let ballRadius = 25;

// Initial angle in radians (30 degrees)
let initialAngle = Math.PI / 6;

function createPendulum() {
  // Calculate initial position of the ball based on the angle
  let ballX = pivotX + pendulumLength * Math.sin(initialAngle);
  let ballY = pivotY + pendulumLength * Math.cos(initialAngle);
  
  // Create the pendulum ball
  pendulumBall = Matter.Bodies.circle(ballX, ballY, ballRadius, {
    restitution: 0.9,
    friction: 0.002,
    render: { fillStyle: '#f55a3c' }
  });
  
  // Create the constraint (pendulum string)
  pendulumConstraint = Matter.Constraint.create({
    pointA: { x: pivotX, y: pivotY },
    bodyB: pendulumBall,
    length: pendulumLength,
    stiffness: 1,
    render: { strokeStyle: '#ffffff' }
  });
  
  // Add the pendulum ball and constraint to the world
  Matter.Composite.add(world, [pendulumBall, pendulumConstraint]);
  
  // Add ground
  const ground = Matter.Bodies.rectangle(400, 575, 800, 50, { 
    isStatic: true, 
    render: { fillStyle: '#28ba3eff' } 
  });
  
  Matter.Composite.add(world, ground);
  
  // Add mouse control
  var mouse = Matter.Mouse.create(render.canvas),
      mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
              stiffness: 0.2,
              render: {
                  visible: false
              }
          }
      });

  Matter.Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;
}

function resetScene() {
  // Clear the world
  Runner.stop(runner);
  Matter.World.clear(engine.world, false);
  
  // Recreate the scene
  createPendulum();
  ResetGUI();
}

function resetparams() {
  Runner.stop(runner);
  isPlaying = false;
  Matter.World.clear(engine.world, false);
  
  // Recreate the scene
  createPendulum();
}

const guiParams = {
  initialAngle: initialAngle * 180 / Math.PI, // Convert to degrees for GUI
  pendulumLength: pendulumLength
};

const gui = new lil.GUI();

const angleControl = gui.add(guiParams, 'initialAngle', -90, 90).step(1)
  .name("Initial Angle (degrees)")
  .onChange(value => {
    initialAngle = value * Math.PI / 180; // Convert to radians
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("Initial angle changed");
  });

const lengthControl = gui.add(guiParams, 'pendulumLength', 50, 300).step(1)
  .name("Pendulum Length")
  .onChange(value => {
    pendulumLength = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("Pendulum length changed");
  });

function ResetGUI() {
  guiParams.initialAngle = initialAngle * 180 / Math.PI;
  guiParams.pendulumLength = pendulumLength;
  angleControl.setValue(initialAngle * 180 / Math.PI);
  lengthControl.setValue(pendulumLength);
  angleControl.updateDisplay();
  lengthControl.updateDisplay();
}

// Initialize the pendulum
createPendulum();