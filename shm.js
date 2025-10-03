let mass, ground;
let anchors = [];
let springs = [];
let massWidth = 60;
let massHeight = 40;
let amplitude = 90;
let springStiffness = 0.008;
let springLength = 120;
let positionY = 300;
let numSprings = 2; // Default 2 springs

// Setup scene with variable number of springs
function setupSHM(numSprings, amplitude, springStiffness, springLength) {
  // Clear old world
  Matter.World.clear(engine.world, false);
  anchors = [];
  springs = [];

  // Disable gravity for this simulation
  engine.world.gravity.y = 0;

  // Create anchors depending on number of springs
  if (numSprings === 1) {
    anchors.push(Matter.Bodies.circle(400, 150, 10, { isStatic: true, render: { fillStyle: "#505050" } }));
  } else if (numSprings === 2) {
    anchors.push(Matter.Bodies.circle(200, positionY, 10, { isStatic: true, render: { fillStyle: "#505050" } }));
    anchors.push(Matter.Bodies.circle(600, positionY, 10, { isStatic: true, render: { fillStyle: "#505050" } }));
  } else if (numSprings === 3) {
    // Position three anchors at 120-degree intervals around the mass
    const centerX = 400;
    const centerY = positionY;
    const radius = 150;
    
    // Calculate positions for three anchors at same angles (120 degrees apart)
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      anchors.push(Matter.Bodies.circle(x, y, 10, { isStatic: true, render: { fillStyle: "#505050" } }));
    }
  }

  // Create mass at the center position
  mass = Matter.Bodies.rectangle(400 + (numSprings === 1 ? amplitude : 0), positionY, massWidth, massHeight, {
    restitution: 0,
    friction: 0.1,
    density: 0.002,
    render: { fillStyle: "#f55a3c" }
  });

  // Create springs connecting mass to anchors
  anchors.forEach((anchor, index) => {
    let offsetX = 0;
    let offsetY = 0;
    
    if (numSprings === 1) {
      // For single spring, connect to top of mass
      offsetX = 0;
      offsetY = -massHeight / 2;
    } else if (numSprings === 2) {
      offsetX = index === 0 ? -massWidth / 2 : massWidth / 2;
    } else if (numSprings === 3) {
      // For three springs, connect to center of mass
      offsetX = 0;
      offsetY = 0;
    }
    
    springs.push(Matter.Constraint.create({
      bodyA: anchor,
      bodyB: mass,
      pointA: { x: 0, y: 0 },
      pointB: { x: offsetX, y: offsetY },
      length: springLength,
      stiffness: springStiffness,
      render: { strokeStyle: "#3d3dc1", lineWidth: 4 }
    }));
  });

  // Add bodies and springs to the world
  Matter.Composite.add(world, anchors.concat([mass, ...springs]));
  
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
  render.mouse = mouse;
}

// Reset the simulation
function resetScene() {
  Matter.Runner.stop(runner);
  Matter.World.clear(engine.world, false);
  // Re-enable gravity for other simulations
  engine.world.gravity.y = 1; // Default gravity
  setupSHM(numSprings, amplitude, springStiffness, springLength);
  resetGUI();
}

// Reset parameters
function resetparams() {
  Matter.Runner.stop(runner);
  isPlaying = false;
  Matter.World.clear(engine.world, false);
  // Re-enable gravity for other simulations
  engine.world.gravity.y = 1; // Default gravity
  setupSHM(numSprings, amplitude, springStiffness, springLength);
}

// GUI control panel setup
const guiParams = {
  numSprings: 2,
  amplitude: amplitude,
  springStiffness: springStiffness,
  springLength: springLength
};

const gui = new lil.GUI();
gui.add(guiParams, "numSprings", { "1 Spring": 1, "2 Springs": 2, "3 Springs": 3 }).name("Number of Springs").onChange(value => {
  numSprings = value;
  resetparams();
});
gui.add(guiParams, "amplitude", 10, 100).step(1).name("Amplitude").onChange(value => {
  amplitude = value;
  resetparams();
});
gui.add(guiParams, "springStiffness", 0.001, 0.05).step(0.001).name("Spring Stiffness").onChange(value => {
  springStiffness = value;
  resetparams();
});
gui.add(guiParams, "springLength", 80, 250).step(1).name("Spring Length").onChange(value => {
  springLength = value;
  resetparams();
});

function resetGUI() {
  guiParams.numSprings = numSprings;
  guiParams.amplitude = amplitude;
  guiParams.springStiffness = springStiffness;
  guiParams.springLength = springLength;
  gui.updateDisplay();
}

// Initial setup
setupSHM(numSprings, amplitude, springStiffness, springLength);