// doublePendulum.js

// Global variables
let pendulum1, pendulum2, constraint1, constraint2;
let pivotX = 400;
let pivotY = 200;
let pendulumLength1 = 150;
let pendulumLength2 = 150;
let ballRadius1 = 20;
let ballRadius2 = 15;
let initialAngle1 = 60; // degrees
let initialAngle2 = 45; // degrees
let trailPoints = []; // Array to store trail points
let maxTrailPoints = 150; // Increased number of trail points for longer duration

// Function to create double pendulum
function doublePendulumMotion(angle1, angle2, length1, length2) {
  initialAngle1 = angle1;
  initialAngle2 = angle2;
  pendulumLength1 = length1;
  pendulumLength2 = length2;

  // Convert angles from degrees to radians
  let radAngle1 = angle1 * Math.PI / 180;
  let radAngle2 = angle2 * Math.PI / 180;

  // Calculate initial positions of the balls based on the angles
  let ball1X = pivotX + pendulumLength1 * Math.sin(radAngle1);
  let ball1Y = pivotY + pendulumLength1 * Math.cos(radAngle1);
  
  let ball2X = ball1X + pendulumLength2 * Math.sin(radAngle2);
  let ball2Y = ball1Y + pendulumLength2 * Math.cos(radAngle2);
  
  // Create the pendulum balls with reduced density for more swing
  pendulum1 = Bodies.circle(ball1X, ball1Y, ballRadius1, {
    restitution: 0.9,
    friction: 0.002,
    density: 0.001, // Reduced density for more swing
    render: { fillStyle: '#f55a3c' }
  });
  
  pendulum2 = Bodies.circle(ball2X, ball2Y, ballRadius2, {
    restitution: 0.9,
    friction: 0.002,
    density: 0.0008, // Even lower density for the second ball
    render: { fillStyle: '#3d3dc1ff' }
  });
  
  // Create the constraints (pendulum strings)
  constraint1 = Constraint.create({
    pointA: { x: pivotX, y: pivotY },
    bodyB: pendulum1,
    length: pendulumLength1,
    stiffness: 1,
    render: { strokeStyle: '#ffffff' }
  });
  
  constraint2 = Constraint.create({
    bodyA: pendulum1,
    pointA: { x: 0, y: 0 },
    bodyB: pendulum2,
    length: pendulumLength2,
    stiffness: 1,
    render: { strokeStyle: '#ffffff' }
  });
  
  // Add the pendulum balls and constraints to the world
  Composite.add(world, [pendulum1, pendulum2, constraint1, constraint2]);
  
  // Add ground
  const ground = Bodies.rectangle(400, 575, 800, 50, { 
    isStatic: true, 
    render: { fillStyle: '#28ba3eff' } 
  });
  
  Composite.add(world, ground);
  
  // Reset trail points
  trailPoints = [];
  
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

  Composite.add(world, mouseConstraint);
  render.mouse = mouse;
}

// Function to update the trail
function updateTrail() {
  if (pendulum2) {
    // Add current position of pendulum2 to trail
    trailPoints.push({ 
      x: pendulum2.position.x, 
      y: pendulum2.position.y,
      timestamp: Date.now() // Add timestamp for fade effect
    });
    
    // Limit the number of trail points
    if (trailPoints.length > maxTrailPoints) {
      trailPoints.shift();
    }
    
    // Update the trail rendering with fade effect
    render.options.wireframes = false;
    
    // Draw trail with gradient effect (fading out)
    for (let i = 1; i < trailPoints.length; i++) {
      const pointA = trailPoints[i - 1];
      const pointB = trailPoints[i];
      
      // Calculate alpha based on age (newer points are more opaque)
      const age = (Date.now() - pointA.timestamp) / 5000; // 5 second fade duration
      const alpha = Math.max(0, 1 - age);
      
      // Set line style with alpha
      render.context.beginPath();
      render.context.strokeStyle = `rgba(61, 61, 193, ${alpha})`; // #3d3dc1ff with alpha
      render.context.lineWidth = 2;
      
      // Draw line segment
      render.context.moveTo(pointA.x, pointA.y);
      render.context.lineTo(pointB.x, pointB.y);
      render.context.stroke();
    }
  }
}

// Add rendering event to update trail
Events.on(render, 'afterRender', updateTrail);

function resetScene() { //for the reset button
  // Clear the world
  Runner.stop(runner);
  Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

  // Recreate the scene
  doublePendulumMotion(
    initialAngle1, 
    initialAngle2, 
    pendulumLength1, 
    pendulumLength2
  );
  ResetGUI();
}

function resetparams() { //for the slider
  Runner.stop(runner);
  isPlaying = false;
  Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

  // Recreate the scene
  doublePendulumMotion(
    initialAngle1, 
    initialAngle2, 
    pendulumLength1, 
    pendulumLength2
  );
}

const guiParams = {
  initialAngle1: initialAngle1,
  initialAngle2: initialAngle2,
  pendulumLength1: pendulumLength1,
  pendulumLength2: pendulumLength2
};

const gui = new lil.GUI();

const angle1Control = gui.add(guiParams, 'initialAngle1', -180, 180).step(1)
  .name("First Pendulum Angle (degrees)")
  .onChange(value => {
    initialAngle1 = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("First pendulum angle changed");
  });

const angle2Control = gui.add(guiParams, 'initialAngle2', -180, 180).step(1)
  .name("Second Pendulum Angle (degrees)")
  .onChange(value => {
    initialAngle2 = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("Second pendulum angle changed");
  });

const length1Control = gui.add(guiParams, 'pendulumLength1', 50, 300).step(1)
  .name("First Pendulum Length")
  .onChange(value => {
    pendulumLength1 = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("First pendulum length changed");
  });

const length2Control = gui.add(guiParams, 'pendulumLength2', 50, 300).step(1)
  .name("Second Pendulum Length")
  .onChange(value => {
    pendulumLength2 = value;
    resetparams();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    console.log("Second pendulum length changed");
  });

function ResetGUI() {
  guiParams.initialAngle1 = initialAngle1;
  guiParams.initialAngle2 = initialAngle2;
  guiParams.pendulumLength1 = pendulumLength1;
  guiParams.pendulumLength2 = pendulumLength2;
  angle1Control.setValue(initialAngle1);
  angle2Control.setValue(initialAngle2);
  length1Control.setValue(pendulumLength1);
  length2Control.setValue(pendulumLength2);
  angle1Control.updateDisplay();
  angle2Control.updateDisplay();
  length1Control.updateDisplay();
  length2Control.updateDisplay();
}

// Initialize the double pendulum
doublePendulumMotion(
  initialAngle1, 
  initialAngle2, 
  pendulumLength1, 
  pendulumLength2
);