/**
 *
 */
class Shape {
    /**
     *
     * @param position
     */
    constructor(position) {
        this.position = position;
    }

    /**
     *
     * @param ctx
     */
    render(ctx) {

    }

    /**
     *
     * @param position
     */
    move(position) {
        this.position = position;
    }

    /**
     *
     * @param x
     * @param y
     */
    resize(x, y) {

    }
}

/**
 *
 */
class Rectangle extends Shape {
    /**
     *
     * @param position
     * @param width
     * @param height
     */
    constructor(position, width, height) {
        super(position);
        this.width = width;
        this.height = height;
    }

    /** @inheritdoc */
    render(ctx) {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    /** @inheritdoc */
    resize(x, y) {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
}

/**
 *
 */
class Oval extends Shape {
    /**
     *
     * @param position
     * @param xRadius
     * @param yRadius
     */
    constructor(position, xRadius, yRadius) {
        super(position);
        this.xRadius = xRadius;
        this.yRadius = yRadius;
    }

    /** @inheritdoc */
    render(ctx) {
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.xRadius, this.yRadius, 0, 0, 2*Math.PI);
        ctx.fill();
    }

    /** @inheritdoc */
    resize(x, y) {
        this.xRadius = Math.abs(x - this.position.x);
        this.yRadius = Math.abs(y - this.position.y);
    }
}

/**
 *
 */
class Circle extends Oval {
    /**
     *
     * @param position
     * @param radius
     *
     *
     */
    constructor(position, radius) {
        super(position, radius, radius);
    }

    /** @inheritdoc */
    resize(x, y) {
        this.xRadius = Math.max(Math.abs(x - this.position.x), Math.abs(y - this.position.y));
        this.yRadius = this.xRadius;
    }
}

class Line extends Shape {
    constructor(startPosition, endPosition) {
        super(startPosition);
        this.endPosition = {x: endPosition.x, y: endPosition.y};
    }

    render(ctx) {
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
    constructor(position) {
        super(position);
        this.xList = [];
        this.yList = [];
    }

    render(ctx) {
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