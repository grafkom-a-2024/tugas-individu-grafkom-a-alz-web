var vertexShadertext = `
    precision mediump float;
    attribute vec3 vertPosition;
    attribute vec2 vertTexCoord;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    varying vec2 fragTexCoord;
    varying vec3 fragNormal;
    varying vec3 fragPosition;
    void main() {
        fragTexCoord = vertTexCoord;
        fragPosition = (mWorld * vec4(vertPosition, 1.0)).xyz;
        gl_Position = mProj * mView * vec4(fragPosition, 1.0);
    }
`;

var fragmentShadertext = `
    precision mediump float;
    varying vec2 fragTexCoord;
    varying vec3 fragPosition;
    uniform sampler2D sampler;
    uniform vec3 lightPosition;
    uniform vec3 ambientLight;
    uniform vec3 directionalLightColor;

    void main() {
        vec4 texelColor = texture2D(sampler, fragTexCoord);

        // Calculate the light direction
        vec3 lightDirection = normalize(lightPosition - fragPosition);
        float lightIntensity = max(dot(normalize(fragPosition), lightDirection), 0.0);
        vec3 diffuse = lightIntensity * directionalLightColor;

        // Final color
        vec3 finalColor = (ambientLight + diffuse) * texelColor.rgb;
        gl_FragColor = vec4(finalColor, texelColor.a);
    }
`;

var demoin = function() {
    console.log('3D rendering demo');
    var canvas = document.getElementById('swas');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, using experimental WebGL');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
        return;
    }

    gl.clearColor(0.68, 0.85, 0.90, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShadertext);
    gl.shaderSource(fragmentShader, fragmentShadertext);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex Shader ERROR", gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment Shader ERROR", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader Program LINK ERROR", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    var boxVertices = [
        // X, Y, Z        U, V (Texture coordinates)
        // Back face
        -1.0, -1.0,  1.0,   0.0, 0.0,
         1.0, -1.0,  1.0,   1.0, 0.0,
         1.0,  1.0,  1.0,   1.0, 1.0,
        -1.0,  1.0,  1.0,   0.0, 1.0,
    
        // Front face
        -1.0, -1.0, -1.0,   0.0, 0.0,
        -1.0,  1.0, -1.0,   0.0, 1.0,
         1.0,  1.0, -1.0,   1.0, 1.0,
         1.0, -1.0, -1.0,   1.0, 0.0,
    
        // Top face
        -1.0,  1.0, -1.0,   0.0, 0.0,
        -1.0,  1.0,  1.0,   0.0, 1.0,
         1.0,  1.0,  1.0,   1.0, 1.0,
         1.0,  1.0, -1.0,   1.0, 0.0,
    
        // Bottom face
        -1.0, -1.0, -1.0,   0.0, 0.0,
         1.0, -1.0, -1.0,   1.0, 0.0,
         1.0, -1.0,  1.0,   1.0, 1.0,
        -1.0, -1.0,  1.0,   0.0, 1.0,
    
        // Right face
         1.0, -1.0, -1.0,   0.0, 0.0,
         1.0,  1.0, -1.0,   0.0, 1.0,
         1.0,  1.0,  1.0,   1.0, 1.0,
         1.0, -1.0,  1.0,   1.0, 0.0,
    
        // Left face
        -1.0, -1.0, -1.0,   1.0, 0.0,
        -1.0, -1.0,  1.0,   0.0, 0.0,
        -1.0,  1.0,  1.0,   0.0, 1.0,
        -1.0,  1.0, -1.0,   1.0, 1.0,
    ];
    

    
    var boxIndices = [
        0, 1, 2, 0, 2, 3, 
        4, 5, 6, 4, 6, 7, 
        8, 9, 10, 8, 10, 11, 
        12, 13, 14, 12, 14, 15, 
        16, 17, 18, 16, 18, 19, 
        20, 21, 22, 20, 22, 23  
    ];
    
    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
    var texCoordAttribLocation = gl.getAttribLocation(shaderProgram, 'vertTexCoord');

    gl.vertexAttribPointer(
        positionAttribLocation, 
        3, gl.FLOAT, gl.FALSE, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, 
        2, gl.FLOAT, gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    gl.useProgram(shaderProgram);

    var mat4 = glMatrix.mat4;
    var worldMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();

    var matWorldUniformLocation = gl.getUniformLocation(shaderProgram, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(shaderProgram, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(shaderProgram, 'mProj');

    var lightPositionUniformLocation = gl.getUniformLocation(shaderProgram, 'lightPosition');
    var ambientLightUniformLocation = gl.getUniformLocation(shaderProgram, 'ambientLight');
    var directionalLightColorUniformLocation = gl.getUniformLocation(shaderProgram, 'directionalLightColor');

    gl.uniform3f(directionalLightColorUniformLocation, 0.8, 0.8, 0.8);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    var image = new Image();
    image.src = 'texture/rubix.png';  
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        var loop = function() {
            // Sliders
            var xRotation = document.getElementById('xRotation').value * Math.PI / 180;
            var yRotation = document.getElementById('yRotation').value * Math.PI / 180;
            var scaleX = document.getElementById('scaleX').value;
            var scaleY = document.getElementById('scaleY').value;
            var scaleZ = document.getElementById('scaleZ').value;
            var translateX = document.getElementById('translateX').value;
            var translateY = document.getElementById('translateY').value;
            var translateZ = document.getElementById('translateZ').value;
            var cameraDistance = document.getElementById('cameraDistance').value;
            var projectionType = document.getElementById('projectionType').value;
            var ambientLightIntensity = document.getElementById('ambientLight').value;

            // Light position
            var lightX = document.getElementById('lightX').value;
            var lightY = document.getElementById('lightY').value;
            var lightZ = document.getElementById('lightZ').value;

            // Apply transformations
            mat4.identity(worldMatrix);
            mat4.translate(worldMatrix, worldMatrix, [translateX, translateY, translateZ]);
            mat4.rotate(worldMatrix, worldMatrix, xRotation, [1, 0, 0]);
            mat4.rotate(worldMatrix, worldMatrix, yRotation, [0, 1, 0]);
            mat4.scale(worldMatrix, worldMatrix, [scaleX, scaleY, scaleZ]);

            // Set camera position
            mat4.lookAt(viewMatrix, [0, 0, -cameraDistance], [0, 0, 0], [0, 1, 0]);

            // Apply projection type (orthographic or perspective)
            if (projectionType == 1) {
                mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
            } else {
                mat4.ortho(projMatrix, -cameraDistance, cameraDistance, -cameraDistance, cameraDistance, 0.1, 1000.0);
            }

            // Set ambient light intensity
            gl.uniform3f(ambientLightUniformLocation, ambientLightIntensity, ambientLightIntensity, ambientLightIntensity);

            // Set light position
            gl.uniform3f(lightPositionUniformLocation, lightX, lightY, lightZ);

            // Apply matrices and draw
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
            gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE0);
            gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    };
};
window.onload = demoin;