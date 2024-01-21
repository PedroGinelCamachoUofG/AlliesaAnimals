window.addEventListener("load", function () {
  // https://www.youtube.com/watch?v=U34l-Xz5ynU&ab_channel=freeCodeCamp.org
  // what if it is a phone wihtout buttons??
  // I need an if

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
        // so this will run every time the mouse is pressed regardless of wether it is on the pet
      }
    }
  }

  class Particle {
    static counter = 0;
    loop: Loop;
    positionX: number;
    positionY: number;
    angle: number;
    lifetime: number;
    duration: number;
    image: HTMLElement | null;
    size: number;
    id: string;

    constructor(loop: Loop, x: number, y: number) {
      this.loop = loop;
      this.positionX = x;
      this.positionY = y;
      this.angle = 0;
      this.lifetime = 60;
      this.duration = 0;
      this.size = 10;// do I want to change its size or make it random??
      this.id = `prtcl${Bap.counter++}`;
    }

    draw() {
      //context.drawImage(this.image, this.collisionX, this.collisionY, this.size * Math.random() + 5, this.size * Math.random() + 5);
    }

    update(){
      this.duration += 1;
    }
  }

  class Bap extends Particle {


    constructor(loop: Loop, x: number, y: number, name: string){
      super(loop, x, y);
      var temp = document.createElement('div');
      temp.setAttribute("id", `${this.id}`);
      temp.innerHTML = `<img class="bap" id="bap${this.id}"src="./assets/bap.png" />`;
      var frag = document.createDocumentFragment().appendChild(temp);
      document.body.insertBefore(frag, document.body.childNodes[0]);
      console.log("bap created");
      // set the image position through css
      this.image = document.getElementById(`bap${this.id}`);
      this.image!.setAttribute("style", `opacity: 1; display: block; top: ${this.positionY}px; left: ${this.positionX}px;`);
    }

    update() {
      super.update();
      this.image!.setAttribute("style", `opacity: ${(this.lifetime-this.duration)/this.lifetime}; top: ${this.positionY}px; left: ${this.positionX}px;`);
      //change position and shape of the sprite
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
        if (collided) {
          this.particles.push(new Bap(this, this.user.positionX, this.user.positionY, "bap"));
          this.animals[0].brain.bapped;
        }
        //console.table(collided);
      });
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
    removeObject() {
      this.particles.forEach(element => {
        if (element.duration == element.lifetime){
          console.log("particle died");
          const elt = document.getElementById(element.id);
          elt.remove();
          element.image!.setAttribute("style", `display: none;`);
        }
      });
      this.particles = this.particles.filter(
        (element) => element.duration < element.lifetime
      );
    }

    // calls updates and drawings of all elements
    render(deltaTime: number) {
      // if a 120th of a second has passed
      if (this.timer > this.interval) {
        // update and draw elements
        this.animals.forEach((element) => element.update());
        this.animals.forEach((element) => element.draw());
        this.particles.forEach((element) => element.update());// remove the particles at some point
        this.particles.forEach((element) => element.draw());
        this.removeObject();
        // this.user.draw(); // since I'm noy drwawing anything its kind of irrelevant
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
      this.internalY = 0;

      this.image = document.getElementById("sprite");

      // increased every frame, used to determine point in the movement
      this.frameTimer = 0;
    }

    update() {
      /*
      // change increase amount to change speed of movement
      this.frameTimer += 2;
      if (this.frameTimer > 120) {
        // reset to 0 after 1 sec
        this.frameTimer = 0;
      }
      // set position to what the function says
      // ((x - x_axis_offset) * steepness_of_curve) ** 2
      this.internalY = ((this.frameTimer - 60) * 0.1) ** 2;
      */
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
    goingUp: boolean;
    spriteWidth: number;
    spriteHeight: number;
    sprite: Sprite;
    speedX: number;
    speedY: number;
    spriteX: number;
    spriteY: number;
    // there are 4 states: pace (0), run (1), idle (2), and sleep (3)
    state: number;
    stateCounter: number;
    nextChangeModifier: number;
    brain: Brain;

    constructor(loop: Loop, name?: string) {
      this.loop = loop;

      // size of box delimiting the animal
      this.width = 40;
      this.height = 40;

      // position of the animal, set to a random location within the screen
      this.positionX =
        Math.random() * (this.loop.width - this.width * 2) + this.width * 0.5;
      this.positionY =
        Math.random() * (this.loop.height - this.height * 2) +
        this.height * 0.5;

      this.image = document.getElementById("animal-container"); // use name to distinguish between different animal files
      //document.getElementById("imageid").src="../template/save.png";e
      //this.pointer = document.getElementById("pointer");

      this.centerX = this.positionX + this.width / 2;
      this.centerY = this.positionY + this.height / 2;

      // radius at which it counts an object in as a collision
      this.collisionRadius = 50;

      // false = looking right, true = looking left
      this.flipped = false;

      // false = going down, true = going up
      this.goingUp = false;

      // sprite size (never used) and init
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.sprite = new Sprite(this.loop, this);

      // speed at which animal moves in each axis
      this.speedX = 1;
      this.speedY = -0.75;

      // the initial state is pacing
      this.state = 0;

      // controls when the state changes
      this.stateCounter = 0;

      // controls how long the animal stays in a state
      this.nextChangeModifier = Math.random() * 500;

      this.brain = new Brain(this);

    }

    changeSate(choice: number, direction: number) {
      // choices are 0: pace, 1: run, 2: idle, 3: sleep
      // directions are 0: left-up, 1: right-up, 2: left-down, 3: right-down

      this.stateCounter = 0;

      if (direction == 0 || direction == 2)  {
        console.log("left");
        this.flipped = true;
      } else {
        console.log("right");
        this.flipped = false;
      }
      if (direction == 0 || direction == 1) {
        console.log("up");
        this.goingUp = true;
      } else {
        console.log("down");
        this.goingUp = false;
      }

      if (choice == 0) {// pace
        this.state = 0;
        console.log("pacing");
        // change the animation
        this.sprite.image!.setAttribute("src", "./assets/bwh.gif");
        //this.image!.setAttribute("srcset", "./assets/bwh.gif");

        if (this.flipped) {
          this.speedX = -1;
        } else {
          this.speedX = 1;
        }
        if (this.goingUp) {
          this.speedY = -0.75;
        } else {
          this.speedY = 0.75;
        }

      } else if (choice == 1) {// run
        this.state = 1;
        console.log("running");
        // change the animation
        this.sprite.image!.setAttribute("src", "./assets/brh.gif");
        //this.image!.setAttribute("srcset", "./assets/brh.gif");

        if (this.flipped) {
          this.speedX = -2;
        } else {
          this.speedX = 2;
        }
        if (this.goingUp) {
          this.speedY = -1.25;
        } else {
          this.speedY = 1.25;
        }

      } else if (choice == 2) {// idle
        console.log("idle");
        this.state = 2;
        this.sprite.image!.setAttribute("src", "./assets/bsh.gif");
        this.speedX = 0;
        this.speedY = 0;
      } else if (choice == 3){// sleep
        console.log("sleeping");
        this.state = 3;
        this.sprite.image!.setAttribute("src", "./assets/bs.gif");
        this.speedX = 0;
        this.speedY = 0;
      }
    }

    triggerChangeState(version: number) {
      if (version == 0){ // random
        this.changeSate(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
        return;
      }
      // using brain
      // first lets memorize the current state
      this.brain.memorize(this.state, this.flipped, this.goingUp);
      // now we learn again
      this.brain.learn()
      // and now we make a choice
    }

    draw() {
      this.image!.setAttribute(
        "style",
        `position: absolute; ${
          this.flipped ? "transform: scaleX(-1);" : "" // if flipped transform otherwise pass
        } top: ${this.positionY}px; left: ${this.positionX}px;`
      ); // set location

      // draw the sprite of the animal
      this.sprite.draw();

      // pointer for debugging
      /*
      this.pointer!.setAttribute(
        "style",
        `top: ${this.centerY}px; left: ${this.centerX}px;`
      );
      */
    }

    update() {
      // change state randomly state
      if (this.stateCounter > 500 + this.nextChangeModifier) {
        this.triggerChangeState(0); // change to 1 for brain
        this.nextChangeModifier = Math.random() * 500;
      } else {
        this.stateCounter++;
      }

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
      } else if (this.positionX + this.width + 35 > this.loop.width) {
        // outside the right
        this.speedX = -this.speedX;
        this.flipped = !this.flipped;
      } else if (this.positionY + this.height + 30 > this.loop.height) {
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

  class Brain{
    net: any;
    animal: Animal;
    baps: number;
    bapThreshold: number;
    memory: any[]; // CHANGE THIS TO ITS ACTUAL TYPE WHICH IS A DICTIONARY OF SORTS
    batchSize: number;

    constructor(animal: Animal){
      this.net = new brain.NeuralNetwork({ hiddenLayers: [3] });
      this.animal = animal;

      this.bapThreshold = 30;
      this.baps = 0;

      this.memory = [];
      this.batchSize = 10;
    }

    bapped(){ 
      this.baps++;
      if (this.baps > this.bapThreshold)  {
        this.animal.triggerChangeState(1);
      }
    }

    memorize(state: number, flipped: boolean, goingUp: boolean){
      this.memory.push({input: [state, flipped, goingUp], output: [this.baps]});
      if (this.memory.length > this.batchSize){
        this.memory.shift
      }
      this.baps = 0;
    }

    learn(){
      this.net.train(this.memory);
    }

    predict(){
  
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
