(function () {

    // The object holding what to draw
    let drawer = {
        shapes: [],
        undoneShapes: [],
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
        settings: {
            color: '#000000',
            filled: false,
            width: 1,
            font: 'sans-serif'
        },
    };

    function currentSettings() {
        return {
            color: drawer.settings.color.slice(0, drawer.settings.color.length),
            filled: drawer.settings.filled,
            width: drawer.settings.width,
            font: drawer.settings.font.slice(0, drawer.settings.font.length)
        };
    }

    /**
     * Wipes the canvas and redraws everything
     */
    function redraw() {
        drawer.ctx.clearRect(0, 0, drawer.ctx.canvas.width, drawer.ctx.canvas.height);

        for (let i = 0; i < drawer.shapes.length; i++) {
            if (drawer.shapes[i]) {
                drawer.shapes[i].render(drawer.ctx);
            }
        }


        if (drawer.selectedElement) {
            drawer.selectedElement.render(drawer.ctx);
        }
    }

    drawer.canvas.addEventListener('mousedown', function (mouseEvent) {
        let pos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
        switch (drawer.selectedShape) {
            case drawer.availableShapes.RECTANGLE:
                drawer.selectedElement = new Rectangle(pos, currentSettings(), 0, 0);
                break;
            case drawer.availableShapes.OVAL:
                drawer.selectedElement = new Oval(pos, currentSettings(), 0, 0);
                break;
            case drawer.availableShapes.CIRCLE:
                drawer.selectedElement = new Circle(pos, currentSettings(), 0);
                break;
            case drawer.availableShapes.LINE:
                drawer.selectedElement = new Line(pos, currentSettings(), pos);
                break;
            case drawer.availableShapes.LINE_LIST:
                drawer.selectedElement = new LineList(pos, currentSettings());
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
            drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
        }
    });

    document.addEventListener('keypress', function (evt) {
        if (evt.key.toUpperCase() === 'Z' && evt.ctrlKey) {
            if (evt.shiftKey) {
                if (drawer.undoneShapes.length > 0) {
                    drawer.shapes.push(drawer.undoneShapes.pop());
                    redraw();
                }
            } else {
                if (drawer.shapes.length > 0) {
                    drawer.undoneShapes.push(drawer.shapes.pop());
                    redraw();
                }
            }
        }
    });

    document.querySelectorAll('#shape-list li').forEach(function (elem) {
        elem.addEventListener('click', function (evt) {
            let clickedShape = elem.dataset.shape;
            if (clickedShape !== drawer.selectedShape) {
                drawer.selectedElement = null;
                drawer.selectedShape = clickedShape;

                document.querySelectorAll('#shape-list li.active')[0].classList.toggle('active');
                elem.classList.toggle('active');
            }
        });
    });

    let colorPicker = document.getElementById('color-selector');
    colorPicker.value = '#000000';
    colorPicker.addEventListener('change', function (evt) {
        drawer.settings.color = colorPicker.value;
    });

})();