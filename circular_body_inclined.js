// circular_motion_inclined.js
// Uses worldcreation.js for Matter.js setup

// Enable gravity
engine.world.gravity.y = 1;

// Global variables
let ball, inclinedPlane;
let friction = 0.3;
let appliedForce = 0;
let forceAngle = 0; // angle of applied force in degrees
let gravity = 1;
let planeAngle = 30; // angle of inclined plane in degrees
let ballMass = 10;
let ballRadius = 25; // Ball radius (same as blockSize default)

// Convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function circularMotionInclined(frictionCoeff, force, forceAngleDeg, gravityConstant, inclineAngle, ballRadiusParam) {
    friction = frictionCoeff;
    appliedForce = force;
    forceAngle = forceAngleDeg;
    gravity = gravityConstant;
    planeAngle = inclineAngle;
    ballRadius = ballRadiusParam;
    
    // Set gravity
    engine.world.gravity.y = gravity;
    
    // Create green ground just below the triangle base like in projectile simulation
    const ground = Bodies.rectangle(400, 575, 800, 50, {
        isStatic: true,
        render: { fillStyle: '#28ba3eff'} // Same green as projectile
    });
    
    // Calculate triangle dimensions with fixed base line position
    const groundTop = 550; // Top surface of the green ground
    const fixedBaseY = groundTop; // Position triangle base exactly at the green ground surface level
    const fixedHeight = 300; // Fixed height for the triangle
    const baseWidth = fixedHeight / Math.tan(toRadians(planeAngle)); // Calculate base width based on angle
    const height = fixedHeight; // Use fixed height
    
    // Create right-angled triangle using vertices
    // Triangle base positioned directly on the green ground surface
    const triangleVertices = [
        { x: 0, y: 0 },                    // Bottom left (on ground)
        { x: baseWidth, y: 0 },            // Bottom right (on ground)
        { x: 0, y: -height }               // Top left (limited height)
    ];
    
    // Create inclined plane as triangle with base at the same level as ground surface
    inclinedPlane = Bodies.fromVertices(250, fixedBaseY - height/2, [triangleVertices], {
        isStatic: true,
        friction: friction,
        render: {
            fillStyle: 'rgba(135, 206, 250, 0.6)', // light blue transparent
            strokeStyle: '#87CEEB',
            lineWidth: 2
        }
    });
    
    // Position ball at the height of the perpendicular above the fixed base line
    const ballX = 200; // Same X position as block
    const ballY = fixedBaseY - height; // At the height of the perpendicular above fixed base line
    
    // Create ball at the height of the perpendicular with same positioning as block
    ball = Bodies.circle(ballX, ballY, ballRadius, {
        mass: ballMass,
        friction: friction,
        frictionAir: 0.01,
        // No inertia constraint - allow natural circular motion
        render: {
            fillStyle: '#ff6b35', // orange ball (same color as block)
            strokeStyle: '#cc5429',
            lineWidth: 2
        }
    });
    
    // Add bodies to world (including green ground)
    World.add(world, [ground, inclinedPlane, ball]);
    
    // Don't apply external force immediately - let user control it
    // Only apply force when the slider value is greater than 0
    
    // Update force continuously only when needed
    Events.on(engine, 'beforeUpdate', () => {
        if (appliedForce > 0) {
            applyExternalForce();
        }
    });
}

function applyExternalForce() {
    if (ball && appliedForce > 0) {
        // Reduced force multiplier for more controlled effect
        const forceX = appliedForce * Math.cos(toRadians(forceAngle)) * 0.0002;
        const forceY = appliedForce * Math.sin(toRadians(forceAngle)) * -0.0002;
        
        Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
    }
}

function resetScene() {
    isPlaying = false;
    Runner.stop(runner);
    Matter.World.clear(engine.world, false);
    
    // Recreate simulation
    circularMotionInclined(friction, appliedForce, forceAngle, gravity, planeAngle, ballRadius);
    ResetGUI();
}

function resetparams() {
    Runner.stop(runner);
    isPlaying = false;
    Matter.World.clear(engine.world, false);
    
    // Recreate simulation with new parameters
    circularMotionInclined(friction, appliedForce, forceAngle, gravity, planeAngle, ballRadius);
}

const guiParams = {
    friction: friction,
    appliedForce: appliedForce,
    forceAngle: forceAngle,
    planeAngle: planeAngle,
    ballRadius: ballRadius
};

const gui = new lil.GUI();

// Friction control
const frictionControl = gui.add(guiParams, 'friction', 0, 1).step(0.01).name("Friction of Surface").onChange(value => {
    friction = value;
    resetparams();
    if (typeof playPauseBtn !== 'undefined') {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    console.log("friction changed");
});

// Applied force control
const forceControl = gui.add(guiParams, 'appliedForce', 0, 10).step(0.1).name("Applied Force Magnitude").onChange(value => {
    appliedForce = value;
    // Don't auto-pause when force changes, let it apply dynamically
    console.log("applied force changed");
});

// Force angle control
const forceAngleControl = gui.add(guiParams, 'forceAngle', -90, 90).step(1).name("Force Angle (degrees)").onChange(value => {
    forceAngle = value;
    if (typeof playPauseBtn !== 'undefined') {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    console.log("force angle changed");
});

// Plane angle control
const planeAngleControl = gui.add(guiParams, 'planeAngle', 10, 60).step(1).name("Incline Angle (degrees)").onChange(value => {
    planeAngle = value;
    resetparams();
    if (typeof playPauseBtn !== 'undefined') {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    console.log("plane angle changed");
});

// Ball radius control (same range as block size)
const ballRadiusControl = gui.add(guiParams, 'ballRadius', 15, 50).step(1).name("Ball Radius").onChange(value => {
    ballRadius = value;
    resetparams();
    if (typeof playPauseBtn !== 'undefined') {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    console.log("ball radius changed");
});

function ResetGUI() {
    guiParams.friction = friction;
    guiParams.appliedForce = appliedForce;
    guiParams.forceAngle = forceAngle;
    guiParams.planeAngle = planeAngle;
    guiParams.ballRadius = ballRadius;
    
    frictionControl.setValue(friction);
    forceControl.setValue(appliedForce);
    forceAngleControl.setValue(forceAngle);
    planeAngleControl.setValue(planeAngle);
    ballRadiusControl.setValue(ballRadius);
    
    frictionControl.updateDisplay();
    forceControl.updateDisplay();
    forceAngleControl.updateDisplay();
    planeAngleControl.updateDisplay();
    ballRadiusControl.updateDisplay();
}

// Custom function call with default parameters - start with zero applied force
circularMotionInclined(0.3, 0, 0, 1, 30, 25); // friction=0.3, force=0, angle=0°, gravity=1, incline=30°, ballRadius=25