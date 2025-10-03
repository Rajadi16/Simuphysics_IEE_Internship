// DAMPED OSCILLATION SIMULATION in Matter.js - Projectile.js format

// Use the global variables from worldcreation.js
// Remove the local engine, world, and runner declarations

let blockHeight = 40;
let blockWidth = 60;
let block, anchor, spring, ground;
let springStiffness = 0.01;
let dampingCoeff = 0.03; // frictionAir simulates damping
let initialDisplacement = 150;
let massValue = 5;

// Setup ground
ground = Bodies.rectangle(400, 575, 800, 50, {
  isStatic: true,
  render: { fillStyle: '#28ba3eff' }
});
World.add(world, ground);

// Function to create damped oscillation
function dampedOscillation(amplitude, stiffness, damping, mass) {
  // Clear world except ground
  World.clear(world, false);
  World.add(world, ground);

  // Anchor fixed in place
  anchor = Bodies.circle(200, 550, 10, {
    isStatic: true,
    render: { fillStyle: '#505050' }
  });

  // Mass block starts displaced
  block = Bodies.rectangle(200 + amplitude, 550, blockWidth, blockHeight, {
    mass: mass,
    frictionAir: damping,
    restitution: 0,
    friction: 0,
    render: { fillStyle: '#f55a3c' },
    inertia: Infinity // prevent rotation
  });

  // Spring connecting anchor and mass
  spring = Constraint.create({
    bodyA: anchor,
    bodyB: block,
    length: 150,
    stiffness: stiffness,
    render: { strokeStyle: '#3d3dc1', lineWidth: 4 }
  });

  World.add(world, [anchor, block, spring]);
}

// Reset the simulation
function resetScene() {
  Runner.stop(runner);
  World.clear(world, false);
  World.add(world, ground);
  dampedOscillation(initialDisplacement, springStiffness, dampingCoeff, massValue);
  resetGUI();
  Runner.run(runner, engine);
}

// Control panel parameters
const guiParams = {
  springStiffness: springStiffness,
  dampingCoeff: dampingCoeff,
  initialDisplacement: initialDisplacement,
  massValue: massValue,
};

const gui = new lil.GUI();

const stiffnessSlider = gui.add(guiParams, 'springStiffness', 0.001, 0.05).step(0.001).name('Spring Stiffness');
stiffnessSlider.onChange(value => {
  springStiffness = value;
  resetScene();
});

const dampingSlider = gui.add(guiParams, 'dampingCoeff', 0, 0.1).step(0.001).name('Damping Coefficient');
dampingSlider.onChange(value => {
  dampingCoeff = value;
  resetScene();
});

const displacementSlider = gui.add(guiParams, 'initialDisplacement', 20, 250).step(1).name('Initial Displacement');
displacementSlider.onChange(value => {
  initialDisplacement = value;
  resetScene();
});

const massSlider = gui.add(guiParams, 'massValue', 1, 10).step(0.1).name('Mass');
massSlider.onChange(value => {
  massValue = value;
  resetScene();
});

// GUI display reset function
function resetGUI() {
  stiffnessSlider.setValue(springStiffness);
  dampingSlider.setValue(dampingCoeff);
  displacementSlider.setValue(initialDisplacement);
  massSlider.setValue(massValue);
  stiffnessSlider.updateDisplay();
  dampingSlider.updateDisplay();
  displacementSlider.updateDisplay();
  massSlider.updateDisplay();
}

// Remove the render setup since it's already created in worldcreation.js

// Initial call
resetScene();