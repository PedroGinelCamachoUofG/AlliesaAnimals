window.addEventListener("load", function () {
  // https://www.youtube.com/watch?v=U34l-Xz5ynU&ab_channel=freeCodeCamp.org
  // what if it is a phone wihtout buttons??
  // I need an if

  // so we where looking to spawn particles or print something at least when the cat gets clicked
  // issue is that the distance calculation was being super nonsensical

  class User {
    constructor(loop) {
      this.loop = loop;
      this.positionX;
      this.positionY;
      this.pressed = false;
    }

    draw() {
      if (this.pressed) {
        // draw like some lines of baping or something
      }
    }
  }

  class Particle {
    constructor(loop, x, y, name) {
      this.loop = loop;
      this.collisionX = x;
      this.collisionY = y;
      this.angle = 0;
      this.lifetime = 0;
      this.duration = 60;
      this.image = document.getElementById("bap"); // use name
      this.size = 10;
    }

    draw() {
      //context.drawImage(this.image, this.collisionX, this.collisionY, this.size * Math.random() + 5, this.size * Math.random() + 5);
    }
  }

  class Bap extends Particle {
    update() {
      //display movement
      // expand at a slight off angle
    }
  }

  class Loop {
    constructor() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.fps = 120;
      this.timer = 0;
      this.interval = 1000 / this.fps; // time increase until it reaches interval and then you change animations
      this.user = new User(this);
      this.animals = [];
      this.numberOfAnimals = 4;
      this.particles = [];

      window.addEventListener("mousedown", (e) => {
        this.user.positionX = e.pageX;
        this.user.positionY = e.pageY;
        this.user.pressed = true;
        let distance = this.checkCollision(this.animals[0], this.user);
        console.table(distance);
      });
      /*
      window.addEventListener("mouseup", (e) => {
        this.user.positionX = e.offsetX;
        this.user.positionY = e.offsetY;
        this.mouse.pressed = false;
      });
      */
    }

    checkCollision(animal, user) {
      const dx = animal.centerX - user.positionX;
      const dy = animal.centerY - user.positionY;
      const distance = Math.hypot(dy, dx);
      let animalX = animal.centerX;
      let animalY = animal.centerY;
      let userX = user.positionX;
      let userY = user.positionY;
      //console.table({ animalX, animalY, userX, userY, dx, dy, distance });
      return { animalX, animalY, userX, userY, dx, dy, distance };
    }

    init() {
      for (let i = 0; i < this.numberOfAnimals; i++) {
        this.animals.push(new Animal(this));
      }
    }

    removeObject() {
      this.particles = this.particles.filter(
        (element) => element.duration > element.lifetime
      );
    }

    render(deltaTime) {
      if (this.timer > this.interval) {
        this.animals.forEach((element) => element.update());
        this.animals.forEach((element) => element.draw());
        this.user.draw(); // since I'm noy drwawing anything its kind of irrelevant
        this.timer = 0;
      }
      this.timer += deltaTime;
    }
  }

  class Sprite {
    constructor(loop, animal) {
      this.loop = loop;
      this.internalY = 250;
      this.animal = animal;
      this.image = document.getElementById("sprite");
      this.frameTimer = 0;
    }

    update() {
      this.frameTimer += 2;
      if (this.frameTimer > 120) {
        this.frameTimer = 0;
      }
      this.internalY = ((this.frameTimer - 60) * 0.1) ** 2;
    }

    draw() {
      this.image.style = `top: ${this.internalY}px;`;
    }
  }

  class Animal {
    constructor(loop, name) {
      this.loop = loop;
      this.flipped = false;
      this.width = 250;
      this.height = 250;
      this.positionX =
        Math.random() * (this.loop.width - this.width * 2) + this.width * 0.5;
      this.positionY =
        Math.random() * (this.loop.height - this.height * 2) +
        this.height * 0.5;
      this.collisionRadius = 250;
      this.image = document.getElementById("animal-container"); // use name to distinguish between different animal files
      //document.getElementById("imageid").src="../template/save.png";e
      this.pointer = document.getElementById("pointer");

      this.centerX = this.positionX + this.width / 2;
      this.centerY = this.positionY + this.height / 2;
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.sprite = new Sprite(this.loop, this);

      this.state = 0; // state for changing animation
      this.direction = 0; // 1 equal left, 2 equal right
      this.step = 0; // step of animation

      this.speedX = 2;
      this.speedY = 0.75;
    }
    draw() {
      this.image.style = `position: absolute; ${
        this.flipped ? "transform: scaleX(-1);" : ""
      } top: ${this.positionY}px; left: ${this.positionX}px;`;
      let sx = this.step * this.spriteWidth; //x location is sprite sheet, represents state
      let sy = this.state * this.direction * this.spriteHeight; //y location is sprite sheet, represents step
      this.sprite.draw();
      this.pointer.style = `top: ${this.centerY}px; left: ${this.centerX}px;`;

      //context.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, this.spriteX, this.spriteY, this.width, this.height);
    }

    update() {
      // make it move
      this.positionX += this.speedX;
      this.positionY += this.speedY;

      this.centerX = this.positionX + this.width / 2;
      this.centerY = this.positionY + this.height / 2;
      // update the locations of stuff
      this.spriteX = this.positionX - this.width * 0.5;
      this.spriteY = this.positionY - this.height * 0.5;
      // update to keep them in the screen
      if (this.positionX < 0) {
        // outside left of screen
        this.speedX = -this.speedX;
        this.flipped = !this.flipped;
      } else if (this.positionX + this.width + 10 > this.loop.width) {
        // outside the right
        this.speedX = -this.speedX;
        this.flipped = !this.flipped;
      } else if (this.positionY + this.height + 10 > this.loop.height) {
        // outside the top
        this.speedY = -this.speedY;
      } else if (this.positionY < 0) {
        // outsidde the bottom
        this.speedY = -this.speedY;
      }
      this.sprite.update();
    }
  }

  const loop = new Loop();
  loop.init();

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    loop.render(deltaTime);

    window.requestAnimationFrame(animate);
  }
  animate(0);
});
