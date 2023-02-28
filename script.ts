window.addEventListener("load", function () {
  // https://www.youtube.com/watch?v=U34l-Xz5ynU&ab_channel=freeCodeCamp.org
  // what if it is a phone wihtout buttons??
  // I need an if

  // so we where looking to spawn particles or print something at least when the cat gets clicked
  // issue is that the distance calculation was being super nonsensical

  class User {
    loop: Loop;
    positionX: number;
    positionY: number;
    isPressed: boolean;

    constructor(loop: Loop) {
      this.loop = loop;
      // mouse position
      this.positionX;
      this.positionY;
      this.isPressed = false;
    }

    // user doesn't have an update method, its values are updated on mouse press
    // perhaps it is better idea to have an update method here and call it when on mouse press

    draw() {
      if (this.isPressed) {
        // draw like some lines of baping or something
      }
    }
  }

  class Particle {
    loop: Loop;
    positionX: number;
    positionY: number;
    angle: number;
    lifetime: number;
    duration: number;
    image: HTMLElement | null;
    size: number;

    constructor(loop: Loop, x: number, y: number, name: string) {
      this.loop = loop;
      this.positionX = x;
      this.positionY = y;
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
    width: number;
    height: number;
    fps: number;
    timer: number;
    interval: number;
    user: User;
    animals: Animal[];
    numberOfAnimals: number;
    particles: Particle[];

    constructor() {
      // occupy all screen
      /**There is a problem with this where if you resize the screen the cat is set to the bounds of the old page
       * So it will bounce outside the old page. However, if you update the bounds, then when you resize the screen
       * The cat will get stuck flipping constantly if it is caught outside the size of the screen
       * So I think the best solution for this is a method that restarts everything if the screen is
       */
      this.width = document.body.scrollWidth;
      this.height = document.body.scrollHeight;

      // for coordinating frequency of updates
      this.fps = 120;
      this.timer = 0;
      this.interval = 1000 / this.fps; // time increase until it reaches interval and then you change animations

      // variables
      this.user = new User(this);
      this.animals = [];
      this.numberOfAnimals = 1;
      this.particles = [];

      // event listeners
      window.addEventListener("mousedown", (e) => {
        this.user.positionX = e.pageX;
        this.user.positionY = e.pageY;
        this.user.isPressed = true;
        let collided = this.checkCollision(this.animals[0], this.user);
        console.table(collided);
      });

      /*
      window.addEventListener("mouseup", (e) => {
        this.user.positionX = e.offsetX;
        this.user.positionY = e.offsetY;
        this.mouse.pressed = false;
      });
      */
    }

    // displays wether user (the mouse), is in the collision radius of the animal
    checkCollision(animal: Animal, user: User) {
      const dx = animal.centerX - user.positionX;
      const dy = animal.centerY - user.positionY;
      const distance = Math.sqrt(dy ** 2 + dx ** 2);
      // let animalX = animal.centerX;
      // let animalY = animal.centerY;
      // let userX = user.positionX;
      // let userY = user.positionY;
      let collided = distance <= animal.collisionRadius;
      return collided;
    }

    // initializes animals
    init() {
      for (let i = 0; i < this.numberOfAnimals; i++) {
        this.animals.push(new Animal(this));
      }
    }

    // removes objects
    /*
    removeObject() {
      this.particles = this.particles.filter(
        (element) => element.duration > element.lifetime
      );
    }*/

    // calls updates and drawings of all elements
    render(deltaTime: number) {
      // if a 120th of a second has passed
      if (this.timer > this.interval) {
        // update and draw elements
        this.animals.forEach((element) => element.update());
        this.animals.forEach((element) => element.draw());
        this.user.draw(); // since I'm noy drwawing anything its kind of irrelevant
        this.timer = 0;
      }
      this.timer += deltaTime;
    }
  }

  class Sprite {
    loop: Loop;
    animal: Animal;
    internalY: number;
    image: HTMLElement | null;
    frameTimer: number;

    constructor(loop: Loop, animal: Animal) {
      this.loop = loop;
      this.animal = animal;

      // the Y position the sprite is displaced from the center
      this.internalY = 250;

      this.image = document.getElementById("sprite");

      // increased every frame, used to determine point in the movement
      this.frameTimer = 0;
    }

    update() {
      // change increase amount to change speed of movement
      this.frameTimer += 2;
      if (this.frameTimer > 120) {
        // reset to 0 after 1 sec
        this.frameTimer = 0;
      }
      // set position to what the function says
      // ((x - x_axis_offset) * steepness_of_curve) ** 2
      this.internalY = ((this.frameTimer - 60) * 0.1) ** 2;
    }

    draw() {
      // set the image position through css
      this.image!.setAttribute("style", `top: ${this.internalY}px;`);
    }
  }

  class Animal {
    loop: Loop;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    image: HTMLElement | null;
    pointer: HTMLElement | null;
    centerX: number;
    centerY: number;
    collisionRadius: number;
    flipped: boolean;
    spriteWidth: number;
    spriteHeight: number;
    sprite: Sprite;
    speedX: number;
    speedY: number;
    spriteX: number;
    spriteY: number;

    constructor(loop: Loop, name?: string) {
      this.loop = loop;

      // size of box delimiting the animal
      this.width = 250;
      this.height = 250;

      // position of the animal, set to a random location within the screen
      this.positionX =
        Math.random() * (this.loop.width - this.width * 2) + this.width * 0.5;
      this.positionY =
        Math.random() * (this.loop.height - this.height * 2) +
        this.height * 0.5;

      this.image = document.getElementById("animal-container"); // use name to distinguish between different animal files
      //document.getElementById("imageid").src="../template/save.png";e
      this.pointer = document.getElementById("pointer");

      this.centerX = this.positionX + this.width / 2;
      this.centerY = this.positionY + this.height / 2;

      // radius at which it counts an object in as a collision
      this.collisionRadius = 100;

      // false = looking right, true = looking left
      this.flipped = false;

      // sprite size and init
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.sprite = new Sprite(this.loop, this);

      /* for future use in animation and behaviours
      this.state = 0; // state for changing animation
      this.step = 0; // step of animation
      */

      // speed at which animal moves in each axis
      this.speedX = 2;
      this.speedY = 0.75;
    }
    draw() {
      this.image!.setAttribute(
        "style",
        `position: absolute; ${
          this.flipped ? "transform: scaleX(-1);" : "" // if flipped transform otherwise pass
        } top: ${this.positionY}px; left: ${this.positionX}px;`
      ); // set location

      /* for future use in animation and behaviours
      let sx = this.step * this.spriteWidth; //x location is sprite sheet, represents state
      let sy = this.state * this.direction * this.spriteHeight; //y location is sprite sheet, represents step
      */

      // draw the sprite of the animal
      this.sprite.draw();

      // pointer for debugging
      this.pointer!.setAttribute(
        "style",
        `top: ${this.centerY}px; left: ${this.centerX}px;`
      );
    }

    update() {
      // make it move
      this.positionX += this.speedX;
      this.positionY += this.speedY;

      this.centerX = this.positionX + this.width / 2;
      this.centerY = this.positionY + this.height / 2;

      // update the locations of stuff MIGHT BE IRRELEVANT
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

      // update animal sprite after animal location has been decided
      this.sprite.update();
    }
  }

  // initiate the container class Loop
  let loop = new Loop();
  loop.init();

  window.addEventListener('resize', function(event) {
    loop = new Loop();
    loop.init();
    let lastTime = 0;
    animate(0);
  }, true);

  let lastTime = 0;
  function animate(timeStamp: number) {
    // for adjustment of fps
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    // calls update and draw methods
    loop.render(deltaTime);

    // calls itself to establish a loop
    window.requestAnimationFrame(animate);
  }

  // start the loop at time 0
  animate(0);
});
