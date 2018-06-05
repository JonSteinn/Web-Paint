class Shape {
    constructor(position, settings) {
        this.position = position;
        this.settings = settings;
    }

    render(ctx) {
        // TODO: apply settings to ctx
        ctx.fillStyle = this.settings.color;
        ctx.strokeStyle = this.settings.color;
        ctx.lineWidth = this.settings.width;
    }

    move(position) {
        this.position = position;
    }

    resize(x, y) {

    }
}

class Rectangle extends Shape {
    constructor(position, settings, width, height) {
        super(position, settings);
        this.width = width;
        this.height = height;
    }

    render(ctx) {
        super.render(ctx);
        if (this.settings.filled) {
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        } else {
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    resize(x, y) {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
}

class Oval extends Shape {
    constructor(position, settings, xRadius, yRadius) {
        super(position, settings);
        this.xRadius = xRadius;
        this.yRadius = yRadius;
    }

    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.xRadius, this.yRadius, 0, 0, 2*Math.PI);
        if (this.settings.filled) {
            ctx.fill();
        } else {
            ctx.stroke();
            ctx.closePath();
        }
    }

    resize(x, y) {
        this.xRadius = Math.abs(x - this.position.x);
        this.yRadius = Math.abs(y - this.position.y);
    }
}

class Circle extends Oval {

    constructor(position, settings, radius) {
        super(position, settings, radius, radius);
    }

    resize(x, y) {
        let radius = Math.max(Math.abs(x - this.position.x), Math.abs(y - this.position.y));
        this.xRadius = radius;
        this.yRadius = radius;
    }
}

class Line extends Shape {
    constructor(startPosition, settings, endPosition) {
        super(startPosition, settings);
        this.endPosition = {x: endPosition.x, y: endPosition.y};
    }

    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.endPosition.x, this.endPosition.y);
        ctx.stroke();
        ctx.closePath();
    }

    resize(x, y) {
        this.endPosition.x = x;
        this.endPosition.y = y;
    }
}

class LineList extends Shape {
    constructor(position, settings) {
        super(position, settings);
        this.xList = [];
        this.yList = [];
    }

    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        for (let i = 0; ; i++) {
            if (i > this.xList.length - 1) {
                ctx.quadraticCurveTo(this.xList[i], this.yList[i], this.xList[i+1], this.yList[i+1]);
                break;
            }
            let center = {x: (this.xList[i] + this.xList[i + 1]) / 2, y: (this.yList[i] + this.yList[i + 1]) / 2};
            ctx.quadraticCurveTo(this.xList[i], this.yList[i], center.x, center.y);
        }
        ctx.stroke();
        ctx.closePath();
    }

    resize(x, y) {
        this.xList.push(x);
        this.yList.push(y);
    }
}