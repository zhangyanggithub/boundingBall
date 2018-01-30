let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let balls = [];
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let p = document.querySelector('.p');
let ballCount = 20;

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY, true);
    this.color = color;
    this.size = size;
}

Ball.constructor = Shape;

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
};

function EvilCircle(x, y, exist) {
    Shape.call(this, x, y, 20, 20, exist);
    this.size = 10;
    this.color = 'white';
}

EvilCircle.constructor = Shape;

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width || (this.y + this.size) >= height) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0 || (this.y - this.size) <= 0) {
        this.x += this.size;
    }

    this.x += this.velX;
    this.y += this.velY;
};

EvilCircle.prototype.setControls = function () {
    var _this = this;
    document.addEventListener('keydown',function (e) {
        if (e.keyCode === 65) {//A左
            console.log('A pressed',_this.x);
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {//D右移
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {//W减速
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {//S加速
            _this.y += _this.velY;
        }
    });
};

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if(balls[j].exists){
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
            }
        }
    }
};

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    let evilCircle = new EvilCircle(100,300,true);
    evilCircle.draw();
    evilCircle.setControls();
    evilCircle.checkBounds();//move
    evilCircle.collisionDetect();
    while (balls.length < 25) {
        let ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            random(10, 20)
        );
        balls.push(ball);
    }
    ballCount = 0;
    for (let i = 0; i < balls.length; i++) {
        if(balls[i].exists){
            ballCount++;
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    p.innerHTML = 'balls count:'+ballCount;
    requestAnimationFrame(loop);
}

loop();
