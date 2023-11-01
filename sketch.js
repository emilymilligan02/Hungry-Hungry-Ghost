let player; // Player object
let candies = []; // Array to store regular candies
let specialCandies = []; // Array to store special candies
let timer = 60; // Game timer
let candyCount = 0; // Candies collected
let gameOver = false; // Game over flag
let backgroundImage; // Background image
let customFont; // Custom font

function preload() {
  playerImage = loadImage('ghosty.png');
  candyImage = loadImage('candy.png');
  specialCandyImage = loadImage('candy2.png');

  // Load the background image
  backgroundImage = loadImage('background.jpg');

  // Load the custom font
  customFont = loadFont('Nosifer-Regular.ttf');
}

function setup() {
  // createCanvas(600, 600);
let canvas = createCanvas(600,600);
canvas.parent("game");
  // Create the player
  player = createPlayer(width / 2, height - 50, playerImage);
}

function draw() {
  // Draw the background image
  image(backgroundImage, 0, 0, width, height);

  // Display the game information
  textFont('Arial');
  textAlign(LEFT);
  textSize(16);
  fill(220);
  text(`Time: ${timer}`, 12, 25);
  text(`Candies: ${candyCount}`, 12, 47);

  // Check if the game is over
  if (gameOver) {
    textFont(customFont); // Set the custom font
    fill(255, 0, 0);
    textSize(60);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
  }

  // Update and display player
  player.update();
  player.display();

  // Update and display regular candies
  for (let i = candies.length - 1; i >= 0; i--) {
    let candy = candies[i];
    candy.update();
    candy.display();
    if (player.collects(candy)) {
      candies.splice(i, 1);
      candyCount++;
    }
  }

  // Update and display special candies
  for (let i = specialCandies.length - 1; i >= 0; i--) {
    let specialCandy = specialCandies[i];
    specialCandy.update();
    specialCandy.display();
    if (player.collects(specialCandy)) {
      specialCandies.splice(i, 1);
      gameOver = true; // Game over if a special candy is collected
    }
  }

  // Countdown timer
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
    if (timer === 0) {
      gameOver = true; // Game over when the timer reaches 0
    }
  }

  // Automatically spawn regular candies
  if (frameCount % 40 === 0 && !gameOver) {
    let candy = createCandy(random(width), 0, candyImage);
    candies.push(candy);
  }

  // Automatically spawn special candies
  if (frameCount % 80 === 0 && !gameOver) {
    let specialCandy = createCandy(random(width), 0, specialCandyImage);
    specialCandies.push(specialCandy);
  }
}

// Player class
class Player {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.size = 100;
    this.image = image;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 10;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += 10;
    }
    // Constrain player within canvas boundaries
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }

  display() {
    image(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  collects(candy) {
    let d = dist(this.x, this.y, candy.x, candy.y);
    return d < this.size / 2 + candy.size / 2;
  }
}

// Candy class (both regular and special candies)
class Candy {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.image = image;
  }

  update() {
    this.y += 4; // Candy falls down
  }

  display() {
    image(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}

function createPlayer(x, y, image) {
  return new Player(x, y, image);
}

function createCandy(x, y, image) {
  return new Candy(x, y, image);
}
