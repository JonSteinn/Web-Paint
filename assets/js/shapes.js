// region Shape
/**
 * The parent class for anything drawn on the canvas.
 */
class Shape {
    /**
     * Create a new Shape.
     *
     * @param position The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     */
    constructor(position, settings) {
        this.position = position;
        this.settings = settings;
    }

    /**
     * Draw the shape.
     *
     * @param ctx A 2d context for the canvas to which the Shape should be drawn to
     */
    render(ctx) {
        ctx.fillStyle = this.settings.color;
        ctx.strokeStyle = this.settings.color;
        ctx.lineWidth = this.settings.width;
        ctx.font = this.settings.font;
    }

    /**
     * Move the shape's position by a provided new one.
     *
     * @param position A 2d position
     */
    move(position) {
        this.position = position;
    }

    /**
     * Resize the object, from its position to the new one
     *
     * @param x Horizontal coordinate
     * @param y Vertical coordinate
     */
    resize(x, y) {

    }
}
// endregion

// region Rectangle
/**
 * A drawable rectangular shape.
 */
class Rectangle extends Shape {
    /**
     * Create a new rectangle.
     *
     * @param position The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     * @param width Horizontal length of rectangle
     * @param height Vertical length of rectangle
     */
    constructor(position, settings, width, height) {
        super(position, settings);
        this.width = width;
        this.height = height;
    }

    /** @inheritDoc */
    render(ctx) {
        super.render(ctx);
        if (this.settings.filled) {
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        } else {
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    /** @inheritDoc */
    resize(x, y) {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
}
// endregion

// region Oval
/**
 * A drawable ellipse.
 */
class Oval extends Shape {
    /**
     * Create a new Oval.
     *
     * @param position The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     * @param xRadius The horizontal half width of the oval
     * @param yRadius The vertical half width of the oval
     */
    constructor(position, settings, xRadius, yRadius) {
        super(position, settings);
        this.xRadius = xRadius;
        this.yRadius = yRadius;
        // The width and height of the oval is determined by
        // the distance from position to (x,y). The center
        // of the oval is their mid point.
        this.x = position.x;
        this.y = position.y;
    }

    /** @inheritDoc */
    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        let c_x = (this.position.x + this.x) / 2;
        let c_y = (this.position.y + this.y) / 2;
        ctx.ellipse(c_x, c_y, this.xRadius, this.yRadius, 0, 0, 2 * Math.PI);
        if (this.settings.filled) {
            ctx.fill();
        } else {
            ctx.stroke();
            ctx.closePath();
        }
    }

    /** @inheritDoc */
    resize(x, y) {
        this.x = x;
        this.y = y;
        this.xRadius = Math.abs(x - this.position.x) / 2;
        this.yRadius = Math.abs(y - this.position.y) / 2;
    }
}
// endregion

// region Circle
/**
 * A drawable circle.
 */
class Circle extends Oval {
    /**
     * Create a new Circle.
     *
     * @param position The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     * @param radius The half width of the circle
     */
    constructor(position, settings, radius) {
        super(position, settings, radius, radius);
    }

    /** @inheritDoc */
    resize(x, y) {
        this.x = x;
        this.y = y;
        let radius = Math.max(Math.abs(x - this.position.x), Math.abs(y - this.position.y)) / 2;
        this.xRadius = radius;
        this.yRadius = radius;
    }
}
// endregion

// region Line
/**
 * A drawable line segment.
 */
class Line extends Shape {
    /**
     * Create a new Line.
     *
     * @param startPosition The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     * @param endPosition The end point of the line segment
     */
    constructor(startPosition, settings, endPosition) {
        super(startPosition, settings);
        this.endPosition = {x: endPosition.x, y: endPosition.y};
    }

    /** @inheritDoc */
    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.endPosition.x, this.endPosition.y);
        ctx.stroke();
        ctx.closePath();
    }

    /** @inheritDoc */
    resize(x, y) {
        this.endPosition.x = x;
        this.endPosition.y = y;
    }
}
// endregion

// region LineList
/**
 * A drawable list of smoothed line segments.
 */
class LineList extends Shape {
    /**
     * Create a new LineList.
     *
     * @param position The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     */
    constructor(position, settings) {
        super(position, settings);
        // All coordinates are kept in two separated arrays
        this.xList = [];
        this.yList = [];
    }

    /** @inheritDoc */
    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        // Segments are smoothed using quadratic curves
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

    /** @inheritDoc */
    resize(x, y) {
        this.xList.push(x);
        this.yList.push(y);
    }
}
// endregion

// region DrawnText
/**
 * A drawable text.
 */
class DrawnText extends Shape {
    /**
     * Create a new DrawnText.
     *
     * @param position The x and y position of the shape
     * @param settings Various settings for drawing the shape {color, filled, width, font}
     */
    constructor(position, settings) {
        super(position, settings);
        // Letters are stored as internal char array.
        this.chars = [];
    }

    /** @inheritDoc */
    render(ctx) {
        super.render(ctx);
        if (this.settings.filled) {
            ctx.fillText(this.chars.join(''), this.position.x, this.position.y);
        } else {
            ctx.strokeText(this.chars.join(''), this.position.x, this.position.y);
        }
    }

    /**
     * @inheritDoc
     *
     * @param key The button which was pressed to add to the text
     */
    resize(key) {
        // Delete last character if backspace
        if (key === 'Backspace') {
            if (this.chars.length > 0) {
                this.chars.pop();
            }
            return;
        }

        // Discard all non-single-character-keys
        if (key.length === 1) {
            this.chars.push(key);
        }
    }
}
// endregion
