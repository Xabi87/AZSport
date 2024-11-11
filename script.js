/* script.js */

// Initialize Theme
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
  } else {
      document.body.classList.remove('dark-mode');
      themeToggle.checked = false;
  }

  themeToggle.addEventListener('change', function () {
      if (this.checked) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
      } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
      }
  });
}

// Call initializeTheme on page load
document.addEventListener('DOMContentLoaded', initializeTheme);

/* Particle Animation for Index Page */
let font;
let outlineParticles = [];
let fillParticles = [];
let explode = false;
let pg;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Bold.otf');
}

function setup() {
  if (document.getElementById('logo-container')) {
      pixelDensity(1);
      let canvas = createCanvas(window.innerWidth, window.innerHeight * 0.6);
      canvas.parent('logo-container');

      let fontSize = width / 10;
      let outlinePoints = font.textToPoints(
          'Elevate Your Game',
          width * 0.1,
          height / 2,
          fontSize,
          {
              sampleFactor: 0.15,
          }
      );

      for (let pt of outlinePoints) {
          let particle = new Particle(pt.x, pt.y, 'outline');
          outlineParticles.push(particle);
      }

      createFillParticles();
  }
}

function draw() {
  if (document.getElementById('logo-container')) {
      clear();

      for (let particle of fillParticles) {
          particle.behaviors();
          particle.update();
          particle.show();
      }

      for (let particle of outlineParticles) {
          particle.behaviors();
          particle.update();
          particle.show();
      }
  }
}

function mousePressed() {
  explode = true;
  setTimeout(() => (explode = false), 1000);
}

class Particle {
  constructor(x, y, type) {
      this.type = type;
      this.pos = createVector(
          x + random(-50, 50),
          y + random(-50, 50)
      );
      this.target = createVector(x, y);
      this.vel = createVector();
      this.acc = createVector();
      this.maxSpeed = 10;
      this.maxForce = 1;
  }

  behaviors() {
      let arrive = this.arrive(this.target);
      let mouse = createVector(mouseX, mouseY);
      let flee = this.flee(mouse);

      arrive.mult(1);
      flee.mult(5);

      this.applyForce(arrive);
      this.applyForce(flee);

      if (explode) {
          let randomForce = p5.Vector.random2D();
          randomForce.mult(10);
          this.applyForce(randomForce);
      }
  }

  applyForce(f) {
      this.acc.add(f);
  }

  arrive(target) {
      let desired = p5.Vector.sub(target, this.pos);
      let d = desired.mag();
      let speed = this.maxSpeed;
      if (d < 100) {
          speed = map(d, 0, 100, 0, this.maxSpeed);
      }
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
  }

  flee(target) {
      let desired = p5.Vector.sub(target, this.pos);
      let d = desired.mag();
      if (d < 50) {
          desired.setMag(this.maxSpeed);
          desired.mult(-1);
          let steer = p5.Vector.sub(desired, this.vel);
          steer.limit(this.maxForce * 5);
          return steer;
      } else {
          return createVector(0, 0);
      }
  }

  update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
  }

  show() {
      let outlineColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-outline-color').trim();
      let fillColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-fill-color').trim();

      push();

      if (this.type === 'outline') {
          drawingContext.shadowBlur = window.innerWidth < 768 ? 5 : 10;
          drawingContext.shadowColor = outlineColor;
          stroke(outlineColor);
      } else {
          stroke(fillColor);
      }

      strokeWeight(window.innerWidth < 768 ? 1 : 2);
      point(this.pos.x, this.pos.y);

      pop();
  }
}

function createFillParticles() {
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0, 0, 0, 0);
  pg.fill(255);
  pg.noStroke();

  let fontSize = width < 768 ? width / 8 : width / 10;
  pg.textFont(font);
  pg.textSize(fontSize);
  pg.textAlign(LEFT, BASELINE);
  pg.text('Elevate Your Game', width * 0.1, height / 2);

  pg.loadPixels();
  let d = pg.pixelDensity();
  let imgWidth = pg.width * d;
  let imgHeight = pg.height * d;

  let density = width < 768 ? 6 : 4;

  for (let x = 0; x < imgWidth; x += density) {
      for (let y = 0; y < imgHeight; y += density) {
          let index = 4 * (x + y * imgWidth);
          let alpha = pg.pixels[index + 3];
          if (alpha > 128) {
              let particleX = x / d;
              let particleY = y / d;
              let particle = new Particle(particleX, particleY, 'fill');
              fillParticles.push(particle);
          }
      }
  }
}

function windowResized() {
  if (document.getElementById('logo-container')) {
      resizeCanvas(window.innerWidth, window.innerHeight * 0.6);
      outlineParticles = [];
      fillParticles = [];

      let fontSize = width / 10;
      let outlinePoints = font.textToPoints(
          'Elevate Your Game',
          width * 0.1,
          height / 2,
          fontSize,
          {
              sampleFactor: 0.15,
          }
      );

      for (let pt of outlinePoints) {
          let particle = new Particle(pt.x, pt.y, 'outline');
          outlineParticles.push(particle);
      }

      createFillParticles();
  }
}
