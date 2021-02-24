var gl;
var points;

var array_points=[];
var colors=[];

var square_array = [
    new Float32Array([
        -1, 1,
        1, 1,
        1,-1,
        -1,-1
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

var ver = square_array[0];
var col = colors_array[0];

window.onload = function init() {
    /* -- Default -- */
    // PERSEGI
    webGL(ver, col);
    render_SQUARE();

    // load dari file
    var fs = document.getElementById("myfile");
    fs.addEventListener('change', (event) => {
        fs.files[0].text().then((text) => {
            loadXml(text);
            // get points & color
            webGL(ver, col);
            render_SQUARE();
        })
    })

    // opsi ubah ukuran
    document.addEventListener("change", function() {
        var val = document.getElementById('valueInput').value;
        val *= 0.01;
        var update_array = ver.map(x => x * val);
        webGL(update_array, col);
        render_SQUARE();
    })


};

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

function render_SQUARE() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function loadXml(xmlText) {
    xmlDocument = (new DOMParser()).parseFromString(xmlText, "text/xml");
    shapes = []
    console.log("Loading from XML...");
  
    let xmlSquare = xmlDocument.getElementsByTagName("square");
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
    var xmlDoc = document.createElement('square');
    xmlDoc.setAttribute('color', this.color);
    for(let i=0; i<this.points.length; i++){
        xmlDoc.appendChild(this.points[i].toXML());
    }
    return xmlDoc;
}