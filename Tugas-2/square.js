const canvas = document.getElementById('glCanvas');
        const gl = canvas.getContext('webgl');

        if (!gl) {
            alert('WebGL not supported');
        }

        const vertexShaderSource = `
            attribute vec2 a_position;
            uniform vec2 u_translation;
            void main() {
                gl_Position = vec4(a_position + u_translation, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);  // Blue color
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        function createProgram(gl, vertexShader, fragmentShader) {
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            return program;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        const translationLocation = gl.getUniformLocation(program, 'u_translation');

        const vertices = new Float32Array([
            -0.1, -0.3,
             0.3, -0.3,
             0.3,  0.3,
            -0.1,  0.3,
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        function drawScene(x, y) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);

            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(translationLocation, x, y);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }

        function update() {
            const x = parseFloat(document.getElementById('xSlider').value);
            const y = parseFloat(document.getElementById('ySlider').value);
            drawScene(x, y);
        }

        document.getElementById('xSlider').addEventListener('input', update);
        document.getElementById('ySlider').addEventListener('input', update);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);  // White background
        update();  // Initial draw