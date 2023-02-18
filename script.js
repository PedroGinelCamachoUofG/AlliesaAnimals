window.addEventListener('load', function(){
    // https://www.youtube.com/watch?v=U34l-Xz5ynU&ab_channel=freeCodeCamp.org
    // what if it is a phone wihtout buttons??
    // I need an if
    const canvas =  this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    // ??
    canvas.width = 1000;
    canvas.height = 700;

    class User {
        constructor(loop){
            this.loop = loop;
            this.collisionX;
            this.collisionY;
        }

        update(){
            this.x = this.loop.mouse.x;
            this.y = this.loop.mouse.y;
            // collision
            this.loop.animals.forEach(element => {
                if(this.loop.checkCollision(element, this)){
                    // collision happened
                    // the result of collision depends on whether mouse is clicked
                    // and maybe I can have 2 radii, one of collision and one of awareness
                }
            });
        }

        draw(context){
            if (this.loop.mouse.pressed){
                // draw like some lines of baping or something
            }
        }3
    }

    class Particle {
        constructor(loop, x, y, name){
            this.loop = loop;
            this.collisionX = x;
            this.collisionY = y;
            this.angle = 0;
            this.lifetime = 0;
            this.duration = 60;
            this.image =  document.getElementById('bap');// use name
            this.size = 10;
        }
        
        draw(context){
            context.drawImage(this.image, this.collisionX, this.collisionY, this.size * Math.random() + 5, this.size * Math.random() + 5);
        }
    }

    class Bap extends Particle {

        update(){
            //display movement
            // expand at a slight off angle
        }
    }

    class Loop {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.fps = 120;
            this.timer = 0;
            this.interval = 1000/this.fps;// time increase until it reaches interval and then you change animations
            this.user =  new User(this);
            this.animals = [];
            this.numberOfAnimals = 1;
            this.particles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }
            

            canvas.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });

            canvas.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
        }

        checkCollision(animal, user){
            const dx = animal.collisionX - user.collisionX;
            const dy = animal.collisionY - user.collisionY;
            const distance = Math.hypot(dy, dx);
            return (distance > animal.radius);
        }

        init(){
            for (let i = 0; i < this.numberOfAnimals; i++){
                this.animals.push(new Animal(this));
            }
        }

        removeObject(){
            this.particles = this.particles.filter(element => element.duration > element.lifetime);
        }

        render(context, deltaTime){
            if (this.timer > this.interval){
                context.clearRect(0, 0, this.width, this.height);
                this.animals.forEach(element => element.update());
                this.animals.forEach(element => element.draw(context));
                this.user.draw(context);// since I'm noy drwawing anything its kind of irrelevant
                this.user.update();
                this.timer = 0;
            }
            this.timer += deltaTime;            
        }
    }

    class Animal {
        constructor(loop, name){
            this.loop = loop;
            this.frameWidth = 250;//placeholder values
            this.frameHeight = 250;//placeholder values
            this.width = this.frameWidth;
            this.height = this.frameHeight;
            this.collisionX =  (Math.random() * (this.loop.width - this.width) + this.width*0.5);
            this.collisionY =  (Math.random() * (this.loop.height- this.height) + this.height*0.5);
            this.collisionRadius = 50;
            this.image =  document.getElementById('animals');// use name to distinguish between different animal files
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5;
            this.spriteWidth = 250;
            this.spriteHeight = 250;

            this.state = 0;// state for changing animation
            this.direction = 0;// 1 equal left, 2 equal right
            this.step = 0;// step of animation

            this.speedX = 5;
            this.speedY = 5;

        }
        draw(context){
            let sx = this.step * this.spriteWidth;//x location is sprite sheet, represents state
            let sy = this.state * this.direction * this.spriteHeight;//y location is sprite sheet, represents step
            context.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, this.spriteX, this.spriteY, this.width, this.height);
        }

        update(){
            // make it move
            this.collisionX += this.speedX;
            this.collisionY += this.speedY;
            // update the locations of stuff
            this.spriteX =  this.collisionX - this.width * 0.5;
            this.spriteY =  this.collisionY - this.height * 0.5;
            // update to keep them in the screen 
            if (this.collisionX - this.width * 0.5 < 0){
                // outside left of screen
                this.speedX = -this.speedX;
            } else if (this.collisionX + this.width * 0.5 > this.loop.width){
                // outside the right
                this.speedX = -this.speedX;
            } else if (this.collisionY + this.height * 0.5 > this.loop.height){
                // outside the top
                this.speedY = -this.speedY;
            } else if (this.collisionY - this.height * 0.5 < 0){
                // outsidde the bottom
                this.speedY = -this.speedY;
            }
        }
    }

    const loop =  new Loop(canvas);
    loop.init();

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loop.render(ctx, deltaTime);
        window.requestAnimationFrame(animate);
    }
    animate(0);
});