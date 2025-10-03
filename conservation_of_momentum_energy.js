// conservation_of_momentum_energy.js
// Conservation of Momentum and Energy Simulation (Newton's Cradle)

// Global variables
let ballCount = 5;
let ballRadius = 20;
let stringLength = 100;
let ballMass = 1;
let orangeBallMass = 1; // Mass of the first (orange) ball
let elasticity = 0.99; // Restitution coefficient
let balls = [];
let constraints = [];

function conservationOfMomentumEnergy() {
  // Clear the world
  Matter.World.clear(world, false);
  
  // Calculate positions
  var ballSpacing = 2 * ballRadius + 2;
  var startX = 400 - (ballCount - 1) * ballSpacing / 2;
  var startY = 150; // Moved up to accommodate string length
  
  // Create balls
  balls = [];
  constraints = [];
  
  for (var i = 0; i < ballCount; i++) {
    // Set mass - first ball (orange) has its own mass, others have the same mass
    var mass = (i === 0) ? orangeBallMass : ballMass;
    
    var ball = Matter.Bodies.circle(startX + i * ballSpacing, startY + stringLength, ballRadius, {
      mass: mass,
      restitution: elasticity, // Controlled elasticity
      friction: 0.00001, // Reduced friction for better energy conservation
      frictionAir: 0.0001, // Reduced air friction for better energy conservation
      render: {
        fillStyle: i === 0 ? '#f55a3c' : '#367af6' // First ball different color (orange)
      }
    });
    balls.push(ball);
  }
  
  // Create constraints (strings) - now extending downward
  for (var i = 0; i < ballCount; i++) {
    var constraint = Matter.Constraint.create({
      pointA: { x: startX + i * ballSpacing, y: startY },
      bodyB: balls[i],
      stiffness: 0.999,
      length: stringLength,
      render: {
        strokeStyle: '#444444',
        lineWidth: 2
      }
    });
    constraints.push(constraint);
  }
  
  // Add ground
  const ground = Matter.Bodies.rectangle(400, 575, 800, 50, { 
    isStatic: true,
    render: { fillStyle: '#28ba3eff' }
  });
  
  // Add all bodies and constraints to world
  Matter.Composite.add(world, [...balls, ...constraints, ground]);
  
  // Add mouse control (following the same pattern as pendulum.js)
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
  
  // Lift the first ball initially
  liftFirstBall();
}

// Function to lift the first ball
function liftFirstBall() {
  if (balls.length > 0) {
    var ballSpacing = 2 * ballRadius + 2;
    var startX = 400 - (ballCount - 1) * ballSpacing / 2;
    var startY = 150;
    
    // Lift the first ball to the side
    var liftX = startX - 100;
    Matter.Body.setPosition(balls[0], {
      x: liftX,
      y: startY + stringLength
    });
  }
}

function resetScene() {
  // Clear the world
  Runner.stop(runner);
  Matter.World.clear(world, false);
  
  // Recreate the scene
  conservationOfMomentumEnergy();
  ResetGUI();
}

function resetparams() {
  Runner.stop(runner);
  isPlaying = false;
  Matter.World.clear(world, false);
  
  // Recreate the scene
  conservationOfMomentumEnergy();
}

const guiParams = {
  ballCount: ballCount,
  stringLength: stringLength,
  ballMass: ballMass,
  orangeBallMass: orangeBallMass,
  elasticity: elasticity
};

const gui = new lil.GUI();

const ballCountSlider = gui.add(guiParams, 'ballCount', 3, 10).step(1).name('Number of Balls');
ballCountSlider.onChange(value => {
  ballCount = value;
  resetparams();
});

const stringLengthSlider = gui.add(guiParams, 'stringLength', 50, 200).step(1).name('String Length');
stringLengthSlider.onChange(value => {
  stringLength = value;
  resetparams();
});

const ballMassSlider = gui.add(guiParams, 'ballMass', 0.1, 10).step(0.1).name('Ball Mass');
ballMassSlider.onChange(value => {
  ballMass = value;
  resetparams();
});

const orangeBallMassSlider = gui.add(guiParams, 'orangeBallMass', 0.1, 10).step(0.1).name('Orange Ball Mass');
orangeBallMassSlider.onChange(value => {
  orangeBallMass = value;
  resetparams();
});

const elasticitySlider = gui.add(guiParams, 'elasticity', 0, 1).step(0.01).name('Elasticity');
elasticitySlider.onChange(value => {
  elasticity = value;
  resetparams();
});

function ResetGUI() {
  guiParams.ballCount = ballCount;
  guiParams.stringLength = stringLength;
  guiParams.ballMass = ballMass;
  guiParams.orangeBallMass = orangeBallMass;
  guiParams.elasticity = elasticity;
  ballCountSlider.setValue(ballCount);
  stringLengthSlider.setValue(stringLength);
  ballMassSlider.setValue(ballMass);
  orangeBallMassSlider.setValue(orangeBallMass);
  elasticitySlider.setValue(elasticity);
  ballCountSlider.updateDisplay();
  stringLengthSlider.updateDisplay();
  ballMassSlider.updateDisplay();
  orangeBallMassSlider.updateDisplay();
  elasticitySlider.updateDisplay();
}

// Initial call
conservationOfMomentumEnergy();