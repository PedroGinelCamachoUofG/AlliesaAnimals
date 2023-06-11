var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.addEventListener("load", function () {
    // https://www.youtube.com/watch?v=U34l-Xz5ynU&ab_channel=freeCodeCamp.org
    // what if it is a phone wihtout buttons??
    // I need an if
    var User = /** @class */ (function () {
        function User(loop) {
            this.loop = loop;
            // mouse position
            this.positionX;
            this.positionY;
            this.isPressed = false;
        }
        // user doesn't have an update method, its values are updated on mouse press
        // perhaps it is better idea to have an update method here and call it when on mouse press
        User.prototype.draw = function () {
            if (this.isPressed) {
                // so this will run every time the mouse is pressed regardless of wether it is on the pet
            }
        };
        return User;
    }());
    var Particle = /** @class */ (function () {
        function Particle(loop, x, y) {
            this.loop = loop;
            this.positionX = x;
            this.positionY = y;
            this.angle = 0;
            this.lifetime = 60;
            this.duration = 0;
            this.size = 10; // do I want to change its size or make it random??
            this.id = "prtcl".concat(Bap.counter++);
        }
        Particle.prototype.draw = function () {
            //context.drawImage(this.image, this.collisionX, this.collisionY, this.size * Math.random() + 5, this.size * Math.random() + 5);
        };
        Particle.prototype.update = function () {
            this.duration += 1;
        };
        Particle.counter = 0;
        return Particle;
    }());
    var Bap = /** @class */ (function (_super) {
        __extends(Bap, _super);
        function Bap(loop, x, y, name) {
            var _this = _super.call(this, loop, x, y) || this;
            var temp = document.createElement('div');
            temp.setAttribute("id", "".concat(_this.id));
            temp.innerHTML = "<img class=\"bap\" id=\"bap".concat(_this.id, "\"src=\"./assets/bap.png\" />");
            var frag = document.createDocumentFragment().appendChild(temp);
            document.body.insertBefore(frag, document.body.childNodes[0]);
            console.log("bap created");
            // set the image position through css
            _this.image = document.getElementById("bap".concat(_this.id));
            _this.image.setAttribute("style", "opacity: 1; display: block; top: ".concat(_this.positionY, "px; left: ").concat(_this.positionX, "px;"));
            return _this;
        }
        Bap.prototype.update = function () {
            _super.prototype.update.call(this);
            this.image.setAttribute("style", "opacity: ".concat((this.lifetime - this.duration) / this.lifetime, "; top: ").concat(this.positionY, "px; left: ").concat(this.positionX, "px;"));
            //change position and shape of the sprite
        };
        return Bap;
    }(Particle));
    var Loop = /** @class */ (function () {
        function Loop() {
            var _this = this;
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
            window.addEventListener("mousedown", function (e) {
                _this.user.positionX = e.pageX;
                _this.user.positionY = e.pageY;
                _this.user.isPressed = true;
                var collided = _this.checkCollision(_this.animals[0], _this.user);
                if (collided) {
                    _this.particles.push(new Bap(_this, _this.user.positionX, _this.user.positionY, "bap"));
                    _this.animals[0].changeSate();
                }
                //console.table(collided);
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
        Loop.prototype.checkCollision = function (animal, user) {
            var dx = animal.centerX - user.positionX;
            var dy = animal.centerY - user.positionY;
            var distance = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
            // let animalX = animal.centerX;
            // let animalY = animal.centerY;
            // let userX = user.positionX;
            // let userY = user.positionY;
            var collided = distance <= animal.collisionRadius;
            return collided;
        };
        // initializes animals
        Loop.prototype.init = function () {
            for (var i = 0; i < this.numberOfAnimals; i++) {
                this.animals.push(new Animal(this));
            }
        };
        // removes objects
        Loop.prototype.removeObject = function () {
            this.particles.forEach(function (element) {
                if (element.duration == element.lifetime) {
                    console.log("particle died");
                    var elt = document.getElementById(element.id);
                    elt.remove();
                    element.image.setAttribute("style", "display: none;");
                }
            });
            this.particles = this.particles.filter(function (element) { return element.duration < element.lifetime; });
        };
        // calls updates and drawings of all elements
        Loop.prototype.render = function (deltaTime) {
            // if a 120th of a second has passed
            if (this.timer > this.interval) {
                // update and draw elements
                this.animals.forEach(function (element) { return element.update(); });
                this.animals.forEach(function (element) { return element.draw(); });
                this.particles.forEach(function (element) { return element.update(); }); // remove the particles at some point
                this.particles.forEach(function (element) { return element.draw(); });
                this.removeObject();
                // this.user.draw(); // since I'm noy drwawing anything its kind of irrelevant
                this.timer = 0;
            }
            this.timer += deltaTime;
        };
        return Loop;
    }());
    var Sprite = /** @class */ (function () {
        function Sprite(loop, animal) {
            this.loop = loop;
            this.animal = animal;
            // the Y position the sprite is displaced from the center
            this.internalY = 0;
            this.image = document.getElementById("sprite");
            // increased every frame, used to determine point in the movement
            this.frameTimer = 0;
        }
        Sprite.prototype.update = function () {
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
        };
        Sprite.prototype.draw = function () {
            // set the image position through css
            this.image.setAttribute("style", "top: ".concat(this.internalY, "px;"));
        };
        return Sprite;
    }());
    var Animal = /** @class */ (function () {
        function Animal(loop, name) {
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
            // sprite size (never used) and init
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
            // controls when the state changes
            this.stateCounter = 0;
        }
        Animal.prototype.changeSate = function () {
            var choice = Math.floor(Math.random() * 4);
            this.stateCounter = 0;
            if (choice == 0) { // pace
                this.state = 0;
                console.log("pacing");
                // change the animation
                this.sprite.image.setAttribute("src", "./assets/bwh.gif");
                //this.image!.setAttribute("srcset", "./assets/bwh.gif");
                if (this.flipped) {
                    this.speedX = -2;
                }
                else {
                    this.speedX = 2;
                }
                this.speedY = 0.75;
            }
            else if (choice == 1) { // run
                this.state = 1;
                console.log("running");
                // change the animation
                this.sprite.image.setAttribute("src", "./assets/brh.gif");
                //this.image!.setAttribute("srcset", "./assets/brh.gif");
                if (this.flipped) {
                    this.speedX = -4;
                }
                else {
                    this.speedX = 4;
                }
                this.speedY = 1.25;
            }
            else if (choice == 2) { // idle
                console.log("idle");
                this.state = 2;
                this.sprite.image.setAttribute("src", "./assets/bsh.gif");
                this.speedX = 0;
                this.speedY = 0;
            }
            else if (choice == 3) { // sleep
                console.log("sleeping");
                this.state = 3;
                this.sprite.image.setAttribute("src", "./assets/bs.gif");
                this.speedX = 0;
                this.speedY = 0;
            }
        };
        Animal.prototype.draw = function () {
            this.image.setAttribute("style", "position: absolute; ".concat(this.flipped ? "transform: scaleX(-1);" : "" // if flipped transform otherwise pass
            , " top: ").concat(this.positionY, "px; left: ").concat(this.positionX, "px;")); // set location
            /* for future use in animation and behaviours
            let sx = this.step * this.spriteWidth; //x location is sprite sheet, represents state
            let sy = this.state * this.direction * this.spriteHeight; //y location is sprite sheet, represents step
            */
            // draw the sprite of the animal
            this.sprite.draw();
            // pointer for debugging
            /*
            this.pointer!.setAttribute(
              "style",
              `top: ${this.centerY}px; left: ${this.centerX}px;`
            );
            */
        };
        Animal.prototype.update = function () {
            // change state randomly state
            if (this.stateCounter > 500 + Math.random() * 500) {
                this.changeSate();
            }
            else {
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
            }
            else if (this.positionX + this.width + 35 > this.loop.width) {
                // outside the right
                this.speedX = -this.speedX;
                this.flipped = !this.flipped;
            }
            else if (this.positionY + this.height + 30 > this.loop.height) {
                // outside the top
                this.speedY = -this.speedY;
            }
            else if (this.positionY < 0) {
                // outsidde the bottom
                this.speedY = -this.speedY;
            }
            // update animal sprite after animal location has been decided
            this.sprite.update();
        };
        return Animal;
    }());
    // initiate the container class Loop
    var loop = new Loop();
    loop.init();
    window.addEventListener('resize', function (event) {
        loop = new Loop();
        loop.init();
        var lastTime = 0;
        animate(0);
    }, true);
    var lastTime = 0;
    function animate(timeStamp) {
        // for adjustment of fps
        var deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // calls update and draw methods
        loop.render(deltaTime);
        // calls itself to establish a loop
        window.requestAnimationFrame(animate);
    }
    // start the loop at time 0
    animate(0);
});
