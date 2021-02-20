var gl;
var points;

var polygon_array = [
    new Float32Array([
        0, 2,
        2, 0,
        1, -1,
        -1, -1,
        -2, 0
    ])
]

var colors_array = [
    new Float32Array([
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0, 
        0.0,  0.0,  0.0,  1.0,  
        0.0,  0.0,  0.0,  1.0,
        0.0,  0.0,  0.0,  1.0,
    ])
]

window.onload = function init() {
    var ver = polygon_array[0];
    var col = colors_array[0];

    /* -- Default -- */
    // POLYGON
    ver = polygon_array[0]; currVer = 2; 
    webGL(polygon_array[0], colors_array[0]);
    render_POLYGON();

    // opsi ubah warna
    document.getElementById('colorForm').addEventListener("change", function() {
        var red = document.getElementById('redValue').value;
        var green = document.getElementById('greenValue').value;
        var blue = document.getElementById('blueValue').value;
        console.log(red, green, blue);
        // console.log(col[10]);
        // val *= 0.01;
        var newcol_array = col.map( (val,idx) => (idx % 4 === 0) ? red : val);
        newcol_array = newcol_array.map( (val,idx) => (idx % 4 === 1) ? green : val);
        newcol_array= newcol_array.map( (val,idx) => (idx % 4 === 2) ? blue : val);
        webGL(ver, newcol_array);
        render_POLYGON();
   
    // return data;   
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

function render_POLYGON() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
}