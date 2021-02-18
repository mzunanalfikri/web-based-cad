var gl;
var points;

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

window.onload = function init() {
    var ver = square_array[0];
    var col = colors_array[0];

    /* -- Default -- */
    // PERSEGI
    ver = square_array[0]; currVer = 2; 
    webGL(square_array[0], colors_array[0]);
    render_SQUARE();

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