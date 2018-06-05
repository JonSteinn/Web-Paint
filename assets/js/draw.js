(function () {

    //region draw-object
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
            DrawnText: 'text',
            MOVE: 'move'
        },
        settings: {
            color: '#000000',
            filled: false,
            width: 1,
            font: '12pt sans-serif'
        },
        currentSettings: function () {
            return {
                color: drawer.settings.color.slice(0, drawer.settings.color.length),
                filled: drawer.settings.filled,
                width: drawer.settings.width,
                font: drawer.settings.font.slice(0, drawer.settings.font.length)
            };
        }
    };
    //endregion

    //region refresh canvas
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
    //endregion

    //region Mouse Events
    drawer.canvas.addEventListener('mousedown', function (mouseEvent) {
        let pos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
        switch (drawer.selectedShape) {
            case drawer.availableShapes.RECTANGLE:
                drawer.selectedElement = new Rectangle(pos, drawer.currentSettings(), 0, 0);
                break;
            case drawer.availableShapes.OVAL:
                drawer.selectedElement = new Oval(pos, drawer.currentSettings(), 0, 0);
                break;
            case drawer.availableShapes.CIRCLE:
                drawer.selectedElement = new Circle(pos, drawer.currentSettings(), 0);
                break;
            case drawer.availableShapes.LINE:
                drawer.selectedElement = new Line(pos, drawer.currentSettings(), pos);
                break;
            case drawer.availableShapes.LINE_LIST:
                drawer.selectedElement = new LineList(pos, drawer.currentSettings());
                break;
            case drawer.availableShapes.DrawnText:
                if (drawer.selectedElement) {
                    drawer.shapes.push(drawer.selectedElement);
                    drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
                }
                drawer.selectedElement = new DrawnText(pos, drawer.currentSettings());
                break;
            case drawer.availableShapes.MOVE:
                break;
        }

        console.log(drawer.selectedElement);
    });

    drawer.canvas.addEventListener('mousemove', function (mouseEvent) {
        if (drawer.selectedElement && drawer.selectedShape !== drawer.availableShapes.DrawnText) {
            drawer.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            redraw();
        }
    });

    document.addEventListener('mouseup', function (mouseEvent) {
        if (drawer.selectedElement && drawer.selectedShape !== drawer.availableShapes.DrawnText) {
            drawer.shapes.push(drawer.selectedElement);
            drawer.selectedElement = null;
            drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
        }
    });
    //endregion

    //region UNDO REDO
    function redo() {
        if (drawer.undoneShapes.length > 0) {
            drawer.shapes.push(drawer.undoneShapes.pop());
            redraw();
        }
    }
    function undo() {
        if (drawer.shapes.length > 0) {
            drawer.undoneShapes.push(drawer.shapes.pop());
            redraw();
        }
    }
    document.addEventListener('keypress', function (evt) {
        if (drawer.selectedShape === drawer.availableShapes.DrawnText) {
            if (evt.key === 'Enter') {
                drawer.shapes.push(drawer.selectedElement);
                drawer.selectedElement = null;
                drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
            } else {
                drawer.selectedElement.resize(evt.key);
                redraw();
            }
        }
        if (evt.key.toUpperCase() === 'Z' && evt.ctrlKey) {
            if (evt.shiftKey) {
                redo();
            } else {
                undo();
            }
        }
    });
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);
    //endregion

    //region Shape-selecting
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
    //endregion

    //region Set-filled
    let filled = document.getElementById('fill-toggle');
    filled.addEventListener('click', function (evt) {
        filled.firstChild.classList.toggle('far');
        filled.firstChild.classList.toggle('fas');
        if (filled.dataset['filled'] === 'no') {
            filled.dataset['filled'] = 'yes';
            drawer.settings.filled = true;
        } else {
            filled.dataset['filled'] = 'no';
            drawer.settings.filled = false;
        }
    });
    //endregion

    //region Color-picking
    let colorPicker = document.getElementById('color-selector');
    colorPicker.value = '#000000';
    colorPicker.addEventListener('change', function (evt) {
        drawer.settings.color = colorPicker.value;
    });
    //endregion

    //region Size-settings
    let widthSetting = document.getElementById('width-row');
    let widthDecrease = widthSetting.querySelectorAll('td > a.decrease')[0];
    let widthIncrease = widthSetting.querySelectorAll('td > a.increase')[0];
    let widthValue = widthSetting.querySelectorAll('td.value-data')[0];
    widthDecrease.addEventListener('click', function (evt) {
        widthValue.innerHTML = Math.max(1, parseInt(widthValue.innerHTML) - 1);
    });
    widthIncrease.addEventListener('click', function (evt) {
        widthValue.innerHTML = Math.min(50, parseInt(widthValue.innerHTML) + 1);
    });

    let fontSetting = document.getElementById('font-row');
    let fontDecrease = fontSetting.querySelectorAll('td > a.decrease')[0];
    let fontIncrease = fontSetting.querySelectorAll('td > a.increase')[0];
    let fontValue = fontSetting.querySelectorAll('td.value-data')[0];
    fontDecrease.addEventListener('click', function (evt) {
        fontValue.innerHTML = ((s) => Math.max(6, parseInt(s.slice(0, s.length - 2)) - 1) + 'pt')(fontValue.innerHTML);
    });
    fontIncrease.addEventListener('click', function (evt) {
        fontValue.innerHTML = ((s) => Math.min(42, parseInt(s.slice(0, s.length - 2)) + 1) + 'pt')(fontValue.innerHTML);
    });

    let sizeModal = document.getElementById('size-modal');
    let sizeAbort = sizeModal.querySelectorAll('button.abort');
    for (let i = 0; i < sizeAbort.length; i++) {
        sizeAbort[i].addEventListener('click', function (evt) {
            widthValue.innerHTML = widthSetting.dataset['value'];
            fontValue.innerHTML = fontSetting.dataset['value'];
        });
    }
    sizeModal.querySelectorAll('button.confirm')[0].addEventListener('click', function (evt) {
        widthSetting.dataset['value'] = widthValue.innerHTML;
        drawer.settings.width = parseInt(widthValue.innerHTML);
        fontSetting.dataset['value'] = fontValue.innerHTML;
        drawer.settings.font =  fontValue.innerHTML + ' ' + drawer.settings.font.split(' ')[1];
    });
    //endregion

    //region FILE-IO
    document.getElementById('img-save').addEventListener('click', function (evt) {
        let lst = [];
        for (let i = 0; i < drawer.shapes.length; i++) {
            let tmp = JSON.parse(JSON.stringify(drawer.shapes[i]));
            tmp['type'] = drawer.shapes[i].__proto__.constructor.name;
            lst.push(tmp);
        }

        let tmp = window.document.createElement('a');
        tmp.href = window.URL.createObjectURL(new Blob([JSON.stringify(lst)], {type: 'application/json'}));
        tmp.download = 'image.json';
        document.body.appendChild(tmp);
        tmp.click();
        document.body.removeChild(tmp);

    });

    function constructShapesFromFile(e) {
        let contents = e.target.result;
        let tmpList = JSON.parse(contents);
        drawer.selectedElement = null;
        drawer.shapes.splice(0, drawer.shapes.length);
        drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
        for (let i = 0; i < tmpList.length; i++) {
            let curr = tmpList[i];
            switch (curr.type) {
                case 'Rectangle':
                    drawer.shapes.push(new Rectangle(
                        curr.position,
                        curr.settings,
                        curr.width,
                        curr.height
                    ));
                    break;
                case 'Oval':
                    drawer.shapes.push(new Oval(
                        curr.position,
                        curr.settings,
                        curr.xRadius,
                        curr.yRadius
                    ));
                    break;
                case 'Circle':
                    drawer.shapes.push(new Circle(
                        curr.position,
                        curr.settings,
                        curr.xRadius
                    ));
                    break;
                case 'Line':
                    drawer.shapes.push(new Line(
                        curr.position,
                        curr.settings,
                        curr.endPosition
                    ));
                    break;
                case 'LineList':
                    let ll = new LineList(curr.position, curr.settings);
                    for (let j = 0; j < curr.xList.length; j++) {
                        ll.resize(curr.xList[j], curr.yList[j]);
                    }
                    drawer.shapes.push(ll);
                    break;
            }
        }
        redraw();
    }

    document.getElementById('img-load').addEventListener('click', function (evt) {
        let inp = window.document.createElement('input');//<input type="file">
        inp.type = 'file';
        document.body.appendChild(inp);
        inp.style.visibility = "hidden";
        inp.addEventListener('change', function (evt) {
            let file = evt.target.files[0];
            if (!file) {
                return;
            }
            let reader = new FileReader();
            reader.addEventListener('load', constructShapesFromFile);
            reader.readAsText(file);
        }, false);
        inp.click();
        document.body.removeChild(inp);
    });

    document.getElementById('img-clear').addEventListener('click', function (evt) {
        drawer.selectedElement = null;
        drawer.shapes.splice(0, drawer.shapes.length);
        drawer.undoneShapes.splice(0, drawer.undoneShapes.length);
        redraw();
    });
    //endregion

})();