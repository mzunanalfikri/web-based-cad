var gl;
var array_points=[];
var colors=[];
var hexcolor;
var shapes;

var polygon_array = [
    new Float32Array([
        // 0, 2,
        // 2, 0,
        // 1, -1,
        // -1, -1,
        // -2, 0
    ])
]

var colors_array = [
    new Float32Array([
        // 0.0,  0.0,  0.0,  1.0,
        // 0.0,  0.0,  0.0,  1.0, 
        // 0.0,  0.0,  0.0,  1.0,  
        // 0.0,  0.0,  0.0,  1.0,
        // 0.0,  0.0,  0.0,  1.0,
        // 0.0,  0.0,  0.0,  1.0,
    ])
]

var ver = polygon_array[0];
var col = colors_array[0];

window.onload = function init() {
    /* -- Default -- */
    // POLYGON
    var fs = document.getElementById("myfile");
    fs.addEventListener('change', (event) => {
        fs.files[0].text().then((text) => {
            loadXml(text);
            render_POLYGON();
        })
    })
    // webGL(polygon_array[0], colors_array[0]);
    // render_POLYGON();

    // opsi ubah warna
    document.getElementById('colorValue').addEventListener("change", function() {
        hexcolor = document.getElementById('colorValue').value;
        let rgb =hexToRGB(hexcolor);
        // console.log(rgb);
        col = col.map( (val,idx) => (idx % 4 === 0) ? rgb[0] : val);
        col = col.map( (val,idx) => (idx % 4 === 1) ? rgb[1] : val);
        col= col.map( (val,idx) => (idx % 4 === 2) ? rgb[2] : val);
        render_POLYGON();
    })

    document.getElementById('s').addEventListener("click", function() {
        console.log("masuk save");
        saveXml();
    })
};

function loadXml(xmlText) {
    xmlDocument = (new DOMParser()).parseFromString(xmlText, "text/xml");
    shapes = []
    console.log("Loading from XML...");
  
    // let xmlLines = xmlDocument.getElementsByTagName("line");
    // for (let i = 0; i < xmlLines.length; i++) {
    //   shapes.push(Line.fromXML(xmlLines[i]));
    // }
  
    // let xmlSquares = xmlDocument.getElementsByTagName("square");
    // for (let i = 0; i < xmlSquares.length; i++) {
    //   shapes.push(Square.fromXML(xmlSquares[i]));
    // }
  
    let xmlPolygons = xmlDocument.getElementsByTagName("polygon");
    for (let i = 0; i < xmlPolygons.length; i++) {
        shapes.push(fromXML(xmlPolygons[i]));
    }
    // console.log(shapes)
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
    hexcolor = xmlObject.getAttribute("color");
    console.log(hexcolor);
    let rgb =hexToRGB(hexcolor);
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
    var xmlDoc = document.createElement('polygon');
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
    if(!shapes){
        shapes=[];
    }
    console.log("Saving to XML...");
    var shapesDocument = doc.createElement('shapes');
    shapesDocument.appendChild(toXML());
    doc.appendChild(shapesDocument);

    var data = new Blob([(new XMLSerializer()).serializeToString(doc)], {type: 'text/xml'});
    var url = URL.createObjectURL(data);

    document.getElementById('s').href = url;
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

function render_POLYGON() {
    webGL(ver, col);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ver.length/2);
}