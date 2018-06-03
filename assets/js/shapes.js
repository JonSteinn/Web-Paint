

class Shape {
    constructor(position) {
        this.position = position;
    }

    render(ctx) {

    }

    move(position) {
        this.position = position;
    }

    resize(x, y) {

    }
}


class Rectangle extends Shape {
    constructor(position, width, height) {
        super(position);
        this.width = width;
        this.height = height;
    }

    render(ctx) {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    resize(x, y) {
        this.width = x - this.position.x;
        this.height = y - this.position.y;
    }
}