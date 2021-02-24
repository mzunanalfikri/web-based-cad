var gl;
var points;

var array_points=[];
var colors=[];
var hexcolor;

var line_array = [
    new Float32Array([
        0, 0,
        -1.7, 1.5
    ])
]

var colors_array = [
    new Float32Array([
        1.0,  0.0,  0.0,  1.0, // red
        1.0,  0.0,  0.0,  1.0, 
        1.0,  0.0,  0.0,  1.0,  
        1.0,  0.0,  0.0,  1.0, 
        1.0,  0.0,  0.0,  1.0,
        1.0,  0.0,  0.0,  1.0
    ])
]

var ver = line_array[0];
var col = colors_array[0];

window.onload = function init() {
    var or_ver =  Object.assign({}, ver);
    var drag = false;

    // load dari file
    var fs = document.getElementById("myfile");
    fs.addEventListener('change', (event) => {
        fs.files[0].text().then((text) => {

            loadXml(text);
            // get points & color
            or_ver = Object.assign({}, ver);
            webGL(ver, col);
            render_LINE();
        })
    })

    // simpan file
    document.getElementById('s').addEventListener("click", function() {
        console.log("masuk save");
        saveXml();
    })

    /* -- Default -- */
    // LINES
    currVer = 2; 
    webGL(ver, col);
    render_LINE();

    var range = document.getElementById("adjust_line");

    range.addEventListener("change", function(event){
        value = range.value / 100;

        x1 = or_ver[0]; y1 = or_ver[1];
        x2 = or_ver[2]; y2 = or_ver[3];
        if (x1 > x2) {
            x2 = or_ver[0]; y2 = or_ver[1];
            x1 = or_ver[2]; y1 = or_ver[3];
        }
        console.log("x1 y1 :" + x1 + "," + y1);
        console.log("x1 y2 :" + x2 + "," + y2);
        m = (y2-y1)/(x2-x1);

        if (value > 1){
            value = value -1;
            // diperbesar
            ver[2] = x2 + (Math.abs(2 - x2) * value);
            ver[0] = x1 - (Math.abs(-2 - x1) * value);
            ver[3] = m * (ver[2] - x1) + y1;
            ver[1] = m * (ver[0] - x1) + y1;
            webGL(ver, col);
            render_LINE();
        } else {
            value = 1-value;
            // diperkecil
            jarak = (x2 - x1) / 2
            ver[2] = x2 - (jarak * value);
            ver[0] = x1 + (jarak * value);
            ver[3] = m * (ver[2] - x1) + y1;
            ver[1] = m * (ver[0] - x1) + y1;
            webGL(ver, col);
            render_LINE();
        }

    })

    var canvas = document.getElementById("gl-canvas");
    
    canvas.addEventListener("mousedown", function(event){
        drag = true;
    })

    canvas.addEventListener("mousemove", function(event){
        var mousePos = getMousePosRelative(canvas, event);

        // change cursor
        if (isNearThePoint({x:ver[0], y:ver[1]}, mousePos)){
            canvas.style.cursor = 'pointer';
            if (drag){
                ver[0] = mousePos.x;
                ver[1] = mousePos.y;
                or_ver = Object.assign({}, ver);
                range.value = 100;
                webGL(ver, col);
                render_LINE();
            }
        } else if (isNearThePoint({x:ver[2], y:ver[3]}, mousePos)){
            canvas.style.cursor = 'pointer';
            if (drag){
                ver[2] = mousePos.x;
                ver[3] = mousePos.y;
                or_ver = Object.assign({}, ver);
                range.value = 100;
                webGL(ver, col);
                render_LINE();
            }
        } else {
            canvas.style.cursor = 'default';
        }
        
    })

    canvas.addEventListener("mouseup", function(event){
        drag = false;
        canvas.style.cursor = 'default';
    })
};

function isNearThePoint(point1, mousePos){
    var r = Math.sqrt(Math.pow(Math.abs(point1.x) - Math.abs(mousePos.x), 2) + Math.pow(Math.abs(point1.y) - Math.abs(mousePos.y), 2));

    if (r < 0.1){
        return true
    }
    return false
}


function getMousePosRelative(canvas, event){
    var rect = canvas.getBoundingClientRect();
    return {
        x : (event.clientX - rect.left - canvas.width/2) / (canvas.width/4) ,
        y : ((event.clientY - rect.top - canvas.height/2) * -1) / (canvas.height/4)
    }
}

function webGL(vertices, colors) {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the vertices data into the GPU
    var bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Load the colors data into the GPU
    var bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function render_LINE() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, 2);
}

function loadXml(xmlText) {
    xmlDocument = (new DOMParser()).parseFromString(xmlText, "text/xml");
    shapes = []
    console.log("Loading from XML...");
  
    let xmlSquare = xmlDocument.getElementsByTagName("line");
    for (let i = 0; i < xmlSquare.length; i++) {
        shapes.push(fromXML(xmlSquare[i]));
    }
}

function hexToRGB(hex){
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      let c = hex.substring(1).split('');
      if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return [((c>>16)&255)/255, ((c>>8)&255)/255, (c&255)/255];
    }
    throw new Error('Invalid hex code!');
  }


function fromXML(xmlObject){
    // let polygon = new polygon([], xmlObject.getAttribute("color"));
    let color = xmlObject.getAttribute("color");
    hexcolor = color;
    console.log(color);
    let rgb =hexToRGB(color);
    let xmlPoints = xmlObject.childNodes;
    console.log(xmlPoints);
    for(let i=0; i<xmlPoints.length; i++){
        if(xmlPoints[i].nodeType !==Node.TEXT_NODE){
            let x = parseFloat(xmlPoints[i].getAttribute("x"));
            let y = parseFloat(xmlPoints[i].getAttribute("y"));
            // let color = xmlPoints[i].getAttribute("color");
            console.log("ini titik");
            console.log(x,y);
            array_points.push(x);
            array_points.push(y);
            colors.push(rgb[0]);
            colors.push(rgb[1]);
            colors.push(rgb[2]);
            colors.push(1);
        }
    }
    console.log(array_points);
    ver = new Float32Array(array_points);
    col = new Float32Array(colors);
    return array_points;
}

function toXML(){
    var xmlDoc = document.createElement('line');
    xmlDoc.setAttribute('color', hexcolor);
    for(let i=0; i<ver.length; i+=2){
        var p = document.createElement("points");
        p.setAttribute('x', ver[i]);
        p.setAttribute('y', ver[i+1]);
        xmlDoc.appendChild(p);
    }
    console.log(xmlDoc);
    return xmlDoc;
}

function saveXml(){
    var doc = document.implementation.createDocument('','',null);
    console.log("Saving to XML...");
    var shapesDocument = doc.createElement('shapes');
    shapesDocument.appendChild(toXML());
    doc.appendChild(shapesDocument);

    var data = new Blob([(new XMLSerializer()).serializeToString(doc)], {type: 'text/xml'});
    var url = URL.createObjectURL(data);

    document.getElementById('s').href = url;
}