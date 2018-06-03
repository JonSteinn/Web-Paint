(function () {

    let drawer = {
        shapes: [],
        selectedShape: 'rectangle',
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        selectedElement: null,
        availableShapes: {
            RECTANGLE: 'rectangle'
        }
    };

    function drawCanvas() {
        if (drawer.selectedElement) {
            drawer.selectedElement.render(drawer.ctx);
        }

        for (let i = 0; i < drawer.shapes.length; i++) {
            drawer.shapes[i].render(drawer.ctx);
        }
    }

    drawer.canvas.addEventListener('mousedown', function (mouseEvent) {
        switch (drawer.selectedShape) {
            case drawer.availableShapes.RECTANGLE:
                drawer.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0);
                break;

        }
    });


    drawer.canvas.addEventListener('mousemove', function (mouseEvent) {
        if (drawer.selectedElement) {
            drawer.ctx.clearRect(0, 0, drawer.ctx.canvas.width, drawer.ctx.canvas.height);
            drawer.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }
    });

    drawer.canvas.addEventListener('mouseup', function () {
        drawer.shapes.push(drawer.selectedElement);
        drawer.selectedElement = null;
    });

})();