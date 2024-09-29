"use strict";
// Initial setup
const startButton = document.getElementById("startButton");
const welcomeScreen = document.getElementById("welcomeScreen");
const gameContainer = document.getElementById("gameContainer");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartButton = document.getElementById("restartButton");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const shootSound = document.getElementById("shootSound");
const gameOverSound = document.getElementById("gameOverSound");
let score = 0;
let level = 1;
let gameActive = true;

// Responsive canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

// Start game
startButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  gameContainer.style.display = "block";
  resizeCanvas();
  startGame();
});

// Game logic to be implemented...
function startGame() {
  // Placeholder for the game logic
  console.log("Game has started!");
}

// Spaceship properties
const spaceship = {
  width: 40,
  height: 20,
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  speed: 5,
  bullets: [],
  canShoot: true,
  cooldown: 500, // 500ms between shots
};

// Alien properties
let aliens = [];
const alienSize = 30;
const alienSpeed = [1, 2, 3, 4, 5]; // Different speeds for different levels

// Bullet properties
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;

// Key presses
const keys = {
  left: false,
  right: false,
  space: false,
};

// Mobile controls
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const shootButton = document.getElementById("shootButton");

leftButton.addEventListener("touchstart", () => (keys.left = true));
leftButton.addEventListener("touchend", () => (keys.left = false));
rightButton.addEventListener("touchstart", () => (keys.right = true));
rightButton.addEventListener("touchend", () => (keys.right = false));
shootButton.addEventListener("touchstart", () => {
  keys.space = true;
  shoot();
});
shootButton.addEventListener("touchend", () => (keys.space = false));

// Responsive canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  spaceship.y = canvas.height - 50; // Adjust spaceship position on resize
}

window.addEventListener("resize", resizeCanvas);

// Start game
startButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  gameContainer.style.display = "block";
  resizeCanvas();
  startGame();
});

restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  gameContainer.style.display = "block";
  resetGame();
});

// Generate aliens
function generateAliens(count) {
  for (let i = 0; i < count; i++) {
    const alien = {
      x: Math.random() * (canvas.width - alienSize),
      y: Math.random() * -500 - 50, // Random starting height
      size: alienSize,
      speed: alienSpeed[level - 1], // Speed based on level
    };
    aliens.push(alien);
  }
}

// Move spaceship based on key presses
function moveSpaceship() {
  if (keys.left && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  }
  if (keys.right && spaceship.x + spaceship.width < canvas.width) {
    spaceship.x += spaceship.speed;
  }
}

// Shooting bullets
function shoot() {
  if (keys.space && spaceship.canShoot) {
    shootSound.play(); // Play shooting sound
    spaceship.bullets.push({
      x: spaceship.x + spaceship.width / 2 - bulletWidth / 2,
      y: spaceship.y,
      width: bulletWidth,
      height: bulletHeight,
    });
    spaceship.canShoot = false;
    setTimeout(() => (spaceship.canShoot = true), spaceship.cooldown);
  }
}

// Draw bullets
function drawBullets() {
  spaceship.bullets = spaceship.bullets.filter((bullet) => bullet.y > 0); // Remove bullets that go off screen
  spaceship.bullets.forEach((bullet) => {
    bullet.y -= bulletSpeed;
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Draw spaceship
function drawSpaceship() {
  ctx.fillStyle = "white";
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Move and draw aliens
function moveAliens() {
  aliens.forEach((alien) => {
    alien.y += alien.speed;

    // Check if alien reaches the ground (game over)
    if (alien.y + alien.size >= canvas.height) {
      gameOverSound.play(); // Play game over sound
      gameOver();
    }
  });

  // Draw aliens
  aliens.forEach((alien) => {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(alien.x, alien.y, alien.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.font = "24px Arial";
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#d223f58c";
    ctx.fillText("👽", alien.x, alien.y);
  });
}

// Check for collisions between bullets and aliens
function checkCollisions() {
  spaceship.bullets.forEach((bullet) => {
    aliens.forEach((alien, index) => {
      const distX = Math.abs(bullet.x - alien.x - alien.size / 2);
      const distY = Math.abs(bullet.y - alien.y - alien.size / 2);
      if (distX < alien.size / 2 && distY < alien.size / 2) {
        aliens.splice(index, 1); // Remove alien
        score += 10;
        scoreDisplay.innerText = `Score: ${score}`;
      }
    });
  });
}

// Game over logic
function gameOver() {
  gameActive = false;
  gameContainer.style.display = "none";
  gameOverScreen.style.display = "flex";
}

// Reset the game for replay
function resetGame() {
  score = 0;
  level = 1;
  scoreDisplay.innerText = `Score: ${score}`;
  levelDisplay.innerText = `Level: ${level}`;
  spaceship.bullets = [];
  aliens = [];
  gameActive = true;
  generateAliens(level * 5); // Generate new aliens for the level
  let request = requestAnimationFrame(gameLoop);
}

// Level progression
function checkLevelProgression() {
  if (aliens.length === 0 && gameActive) {
    level++;
    levelDisplay.innerText = `Level: ${level}`;
    generateAliens(level * 5); // More aliens per level
  }
}

// Main game loop
function gameLoop() {
  if (!gameActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  moveSpaceship();
  shoot();
  drawSpaceship();
  drawBullets();
  moveAliens();
  checkCollisions();
  checkLevelProgression();

  requestAnimationFrame(gameLoop); // Keep the game running
}

// Start game logic
function startGame() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === " ") keys.space = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === " ") keys.space = false;
  });

  gameActive = true;
  score = 0;
  level = 1;
  scoreDisplay.innerText = `Score: ${score}`;
  levelDisplay.innerText = `Level: ${level}`;
  spaceship.bullets = [];
  aliens = [];
  generateAliens(level * 5); // Initial alien generation
  gameLoop(); // Start the game loop
}
