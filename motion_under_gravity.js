// motion_under_gravity.js
// Uses worldcreation.js for Matter.js setup

// ground(common to questions with a ground-this exact code.)
let ground = Bodies.rectangle(400, 575, 800, 50, { isStatic: true, render: { fillStyle: '#28ba3eff'}});
Composite.add(world, [ground]);

// Enable gravity
engine.world.gravity.y = 1;

// Ground top edge
const groundTop = 550;

// Global variables for object
let object;
let objectHeight = 100;
let yVelocity = 5;
const objectSize = 40;
const initialPositionX = 400;

function motionUnderGravity(height, velocity) {
    objectHeight = height;
    yVelocity = velocity;
    
    // Calculate initial position based on height from ground
    const initialPositionY = groundTop - objectHeight - objectSize/2;
    
    // Create object
    object = Bodies.rectangle(initialPositionX, initialPositionY, objectSize, objectSize, {
        restitution: 0.0, 
        friction: 0.1, 
        density: 0.004, 
        render: { fillStyle: '#0066ff'}
    });
    
    // Set initial velocity (only Y velocity for gravity motion)
    Body.setVelocity(object, {x: 0, y: -yVelocity}); // negative because y axis is inverted
    
    Composite.add(world, [object]);
}

function resetScene() { // for the reset button
    // Clear the world
    isPlaying = false;
    Runner.stop(runner);
    Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

    // Recreate objects
    motionUnderGravity(objectHeight, yVelocity);
    
    // Re-add ground
    Matter.World.add(engine.world, [ground]);
    ResetGUI();
}

function resetparams() { // for the slider
    Runner.stop(runner);
    isPlaying = false;
    Matter.World.clear(engine.world, false); // keep the engine, just remove bodies

    // Recreate objects with new parameters
    motionUnderGravity(objectHeight, yVelocity);
    
    // Re-add ground
    Matter.World.add(engine.world, [ground]);
}

const guiParams = {
    objectHeight: objectHeight,
    yVelocity: yVelocity,
};

const gui = new lil.GUI();

const velY = gui.add(guiParams, 'yVelocity', -20, 20).step(0.1).name("Initial Y Velocity").onChange(value => {
    yVelocity = value;
    resetparams();
    if (typeof playPauseBtn !== 'undefined') {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    console.log("y velocity changed");
});

const objHeight = gui.add(guiParams, 'objectHeight', 0, 500).step(0.1).name("Height from ground").onChange(value => {
    objectHeight = value;
    resetparams();
    if (typeof playPauseBtn !== 'undefined') {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    console.log("height changed");
});

function ResetGUI() {
    guiParams.yVelocity = yVelocity;
    guiParams.objectHeight = objectHeight;
    velY.setValue(yVelocity);
    objHeight.setValue(objectHeight);
    velY.updateDisplay();
    objHeight.updateDisplay();
}

// Custom function call with default parameters
motionUnderGravity(100, 5); // height=100, initial Y velocity=5
