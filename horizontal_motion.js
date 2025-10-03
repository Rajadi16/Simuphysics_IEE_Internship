// horizontal_motion.js
// Horizontal Motion Simulation with Infinite Moving Ground

// Global variables
let baseFrame, movingBody;
let initialVelocity = 5;
let acceleration = 0;
let currentTime = 0;
let distanceTraveled = 0;
let groundTiles = [];
let tileSize = 200;
let numTiles = 10;

function horizontalMotion(velocity, accel) {
  // Clear the world
  Matter.World.clear(world, false);
  
  // Set parameters
  initialVelocity = velocity;
  acceleration = accel;
  currentTime = 0;
  distanceTraveled = 0;
  
  // Create infinite ground with tiles
  groundTiles = [];
  let startX = -tileSize * Math.floor(numTiles / 2);
  
  for (let i = 0; i < numTiles; i++) {
    let tile = Matter.Bodies.rectangle(startX + i * tileSize, 520, tileSize, 20, {
      isStatic: true,
      friction: 0, // No friction
      frictionAir: 0, // No air resistance
      render: { 
        fillStyle: '#8B4513' // Brown color for ground
      }
    });
    groundTiles.push(tile);
  }
  
  // Create moving circular body
  movingBody = Matter.Bodies.circle(0, 500, 20, {
    friction: 0, // No friction
    frictionAir: 0, // No air resistance
    restitution: 1, // Perfectly elastic
    render: { 
      fillStyle: '#f55a3c' // Red color
    }
  });
  
  // Set initial velocity
  Matter.Body.setVelocity(movingBody, { x: initialVelocity, y: 0 });
  
  // Add bodies to world
  Matter.Composite.add(world, [...groundTiles, movingBody]);
  
  // Add mouse control (following the same pattern as other simulations)
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
  
  // Create info display panel
  createInfoDisplay();
}

// Create information display panel
function createInfoDisplay() {
  // Remove existing display if it exists
  const existingDisplay = document.getElementById('motion-info-display');
  if (existingDisplay) {
    existingDisplay.remove();
  }
  
  // Create display panel
  const infoPanel = document.createElement('div');
  infoPanel.id = 'motion-info-display';
  infoPanel.style.position = 'absolute';
  infoPanel.style.top = '20px';
  infoPanel.style.left = '20px';
  infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  infoPanel.style.color = 'white';
  infoPanel.style.padding = '15px';
  infoPanel.style.borderRadius = '8px';
  infoPanel.style.fontFamily = 'Arial, sans-serif';
  infoPanel.style.fontSize = '14px';
  infoPanel.style.zIndex = '1000';
  
  infoPanel.innerHTML = `
    <h3 style="margin: 0 0 10px 0; color: #4CAF50">Horizontal Motion Data</h3>
    <div id="velocity-info">Current Velocity: <span id="velocity-value">0</span> m/s</div>
    <div id="distance-info">Distance Traveled: <span id="distance-value">0</span> m</div>
    <div id="time-info">Time Elapsed: <span id="time-value">0</span> s</div>
  `;
  
  document.querySelector('.simulation-container').appendChild(infoPanel);
  
  // Start updating the display
  updateInfoDisplay();
}

// Update information display
function updateInfoDisplay() {
  if (movingBody) {
    // Update velocity display
    const velocityElement = document.getElementById('velocity-value');
    if (velocityElement) {
      velocityElement.textContent = movingBody.velocity.x.toFixed(2);
    }
    
    // Update distance display
    const distanceElement = document.getElementById('distance-value');
    if (distanceElement) {
      distanceElement.textContent = Math.abs(movingBody.position.x).toFixed(2);
    }
    
    // Update time display (simple approximation)
    const timeElement = document.getElementById('time-value');
    if (timeElement) {
      timeElement.textContent = currentTime.toFixed(2);
    }
  }
}

// Move ground tiles to create infinite effect
function updateGround() {
  if (movingBody && groundTiles.length > 0) {
    let ballX = movingBody.position.x;
    
    // Move ground tiles to follow the ball
    for (let i = 0; i < groundTiles.length; i++) {
      let tile = groundTiles[i];
      let tileX = tile.position.x;
      
      // If tile is too far behind, move it to the front
      if (tileX < ballX - tileSize * (numTiles / 2 + 1)) {
        Matter.Body.setPosition(tile, { 
          x: tileX + tileSize * numTiles, 
          y: tile.position.y 
        });
      }
      // If tile is too far ahead, move it to the back
      else if (tileX > ballX + tileSize * (numTiles / 2 + 1)) {
        Matter.Body.setPosition(tile, { 
          x: tileX - tileSize * numTiles, 
          y: tile.position.y 
        });
      }
    }
  }
}

function resetScene() {
  // Clear the world
  Runner.stop(runner);
  Matter.World.clear(world, false);
  
  // Recreate the scene
  horizontalMotion(initialVelocity, acceleration);
  ResetGUI();
}

function resetparams() {
  Runner.stop(runner);
  isPlaying = false;
  Matter.World.clear(world, false);
  
  // Recreate the scene
  horizontalMotion(initialVelocity, acceleration);
}

const guiParams = {
  initialVelocity: initialVelocity,
  acceleration: acceleration
};

const gui = new lil.GUI();

const velocityControl = gui.add(guiParams, 'initialVelocity', -20, 20).step(0.1).name('Initial Velocity');
velocityControl.onChange(value => {
  initialVelocity = value;
  resetparams();
});

const accelerationControl = gui.add(guiParams, 'acceleration', -10, 10).step(0.1).name('Acceleration');
accelerationControl.onChange(value => {
  acceleration = value;
  resetparams();
});

function ResetGUI() {
  guiParams.initialVelocity = initialVelocity;
  guiParams.acceleration = acceleration;
  velocityControl.setValue(initialVelocity);
  accelerationControl.setValue(acceleration);
  velocityControl.updateDisplay();
  accelerationControl.updateDisplay();
}

// Custom update function to handle acceleration, info display, and ground movement
function updateMotion() {
  if (movingBody && isPlaying) {
    // Apply acceleration
    Matter.Body.applyForce(movingBody, movingBody.position, { x: acceleration * movingBody.mass / 1000, y: 0 });
    
    // Update time
    currentTime += 0.016; // Approximate time step (60 FPS)
    
    // Update information display
    updateInfoDisplay();
    
    // Update ground to create infinite effect
    updateGround();
  }
}

// Add custom update to the engine
Matter.Events.on(engine, 'beforeUpdate', updateMotion);

// Initial call
horizontalMotion(initialVelocity, acceleration);