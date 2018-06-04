(function () {

    // The object holding what to draw
    let drawer = {
        shapes: [],
        selectedShape: 'lineList',
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        selectedElement: null,
        availableShapes: {
            RECTANGLE: 'rectangle',
            OVAL: 'oval',
            CIRCLE: 'circle',
            LINE: 'line',
            LINE_LIST: 'lineList',
            TEXT: 'text',
        },
    };

    // Object to simulate unbuffered keyboard io for the keys we need
    let keyDown = {
        ctrl: false,
        shift: false
    };

    document.querySelectorAll('#shape-list li').forEach(function (elem) {
        elem.addEventListener('click', function (evt) {
            var clickedShape = elem.dataset.shape;
            if (clickedShape !== drawer.selectedShape) {
                drawer.selectedElement = null;
                drawer.selectedShape = clickedShape;

                document.querySelectorAll('#shape-list li.active')[0].classList.toggle('active');
                elem.classList.toggle('active');
            }
        });
    });

    /**
     * Wipes the canvas and redraws everything
     */
    function redraw() {
        drawer.ctx.clearRect(0, 0, drawer.ctx.canvas.width, drawer.ctx.canvas.height);

        if (drawer.selectedElement) {
            drawer.selectedElement.render(drawer.ctx);
        }


        for (let i = 0; i < drawer.shapes.length; i++) {
            if (drawer.shapes[i]) {
                drawer.shapes[i].render(drawer.ctx);
            }
        }
    }

    drawer.canvas.addEventListener('mousedown', function (mouseEvent) {
        var pos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
        switch (drawer.selectedShape) {
            case drawer.availableShapes.RECTANGLE:
                drawer.selectedElement = new Rectangle(pos, 0, 0);
                break;
            case drawer.availableShapes.OVAL:
                drawer.selectedElement = new Oval(pos, 0, 0);
                break;
            case drawer.availableShapes.CIRCLE:
                drawer.selectedElement = new Circle(pos, 0);
                break;
            case drawer.availableShapes.LINE:
                drawer.selectedElement = new Line(pos, pos);
                break;
            case drawer.availableShapes.LINE_LIST:
                drawer.selectedElement = new LineList(pos);
                break;
            case drawer.availableShapes.TEXT:
                break;
        }
    });

    drawer.canvas.addEventListener('mousemove', function (mouseEvent) {
        if (drawer.selectedElement) {
            drawer.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            redraw();
        }
    });

    document.addEventListener('mouseup', function (mouseEvent) {
        if (drawer.selectedElement) {
            drawer.shapes.push(drawer.selectedElement);
            drawer.selectedElement = null;
        }
    });

    document.addEventListener('keypress', function (evt) {

        if (evt.ctrlKey) {
            keyDown.ctrl = true;
        }
        if (evt.shiftKey) {
            keyDown.shift = true;
        }

        if (evt.key === 'z' && keyDown.ctrl) {
            if (keyDown.shift) {
                // TODO: redo
            } else {
                if (drawer.shapes.length > 0) {
                    drawer.shapes.pop();
                    redraw();
                }
            }
        }
    });

    document.addEventListener('keyup', function (evt) {
        if (evt.ctrlKey) {
            keyDown.ctrl = false;
        }
        if (evt.shiftKey) {
            keyDown.shift = false;
        }
    });

})();