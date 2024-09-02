var vertexShadertext = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;

var fragmentShadertext = `
    precision mediump float;
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0); // Red color
    }
`;

var demoin = function() {
    console.log('lol');
    var canvas = document.getElementById('swas');
    var gl = canvas.getContext('webgl');
    
    if (!gl) {
        console.log('fail aowkoakwa');
        return;
    }
    
    gl.clearColor(0.68, 0.85, 0.90, 1.0); // Light blue
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShadertext);
    gl.shaderSource(fragmentShader, fragmentShadertext);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex Shader ERROR lol", gl.getShaderInfoLog(vertexShader));
        return;
    }
    
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment Shader ERROR lol", gl.getShaderInfoLog(fragmentShader));
        return;
    }
    
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader Program LINK ERROR lol", gl.getProgramInfoLog(shaderProgram));
        return;
    }
    
    // Define the vertices for the square (two triangles)
    var squarevertices = [
    0.0, 0.45,
    0.65, 0.45,
    0.0, 0.60,

    0.0, 0.60,
    0.65, 0.60,
    0.65, 0.45,

    0.0, 0.60,
    -0.10, 0.60,
    0.0,-0.7,

    0.0,-0.7,
    -0.10, -0.7,
    -0.10, 0.60,

    -0.10,-0.7,
    -0.10,-0.55,
    -0.75, -0.7,

    -0.75, -0.7,
    -0.75, -0.55,
    -0.10, -0.55

    ];
    
    var squareBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squarevertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size
        0 // Offset
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLES, 0, 45); // Draw the square
};
