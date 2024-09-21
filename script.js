// Vertex shader program
const vertexShaderSource = `
attribute vec2 aPosition;
uniform mat4 uRotationMatrix;
void main() {
    gl_Position = uRotationMatrix * vec4(aPosition, 0.0, 1.0);
}`;

// Fragment shader program
const fragmentShaderSource = `
precision mediump float;
uniform vec4 uColor;
void main() {
    gl_FragColor = uColor;
}`;

// Create and compile shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

// Create program
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
}

const canvas = document.getElementById('myCanvas');
const gl = canvas.getContext('webgl');

// Compile shaders and link program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Define pentagon vertices
const vertices = new Float32Array([
    0.0,  0.5,
    0.47, 0.15,
    0.29, -0.4,
   -0.29, -0.4,
   -0.47, 0.15
]);

// Create buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Look up attribute and uniform locations
const aPosition = gl.getAttribLocation(program, 'aPosition');
const uColor = gl.getUniformLocation(program, 'uColor');
const uRotationMatrix = gl.getUniformLocation(program, 'uRotationMatrix');

let angle = 0;
const rotationSpeed = 0.01;

function render() {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use the program
    gl.useProgram(program);

    // Set the color to blue
    gl.uniform4f(uColor, 0.0, 0.0, 1.0, 1.0);  // Blue color

    // Bind the position buffer and enable the attribute
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Create rotation matrix
    angle += rotationSpeed;
    const rotationMatrix = mat4.create();
    mat4.rotateZ(rotationMatrix, rotationMatrix, angle);

    // Send the rotation matrix to the shader
    gl.uniformMatrix4fv(uRotationMatrix, false, rotationMatrix);

    // Draw the pentagon
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);

    // Call render again for the next frame
    requestAnimationFrame(render);
}

// Start the render loop
render();