
"use strict";

var canvas;
var gl;

var maximumBlockAmount = 15;

var motionSpeed = 0.1;
var NumVertices  = 36;
var mainChar = new MainChar();

var points = [];
var colors = [];
var gameStatus = true;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var blocks = [];

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// Bu değerleri nesnenizin döndürme değerleri olarak kullanabilirsiniz
let rotation = {
    x: 0,
    y: 0
};

// Nesneyi döndürmek için bir faktör belirleyin (bu değeri ayarlamak isteyebilirsiniz)
const rotationFactor = 0.3;


let zoomLevel = 5.0;
const zoomSensitivity =2; // Zoom hassasiyetini ayarlamak için


function update(){

   
    
     //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    points= [];
    colors = [];

}
window.onload = function init()
{
    
    mainChar.resize(0.1);

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    update();
    colorCube(mainChar.vertices);
    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.addEventListener('mousedown', function(e) {
        if (e.button !== 2) { // sağ tuş kontrolü
            return;
        }
        isDragging = true;
        
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) {
            return;
        }
    
        const deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        const deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    
        rotation.y = deltaX * rotationFactor;
        rotation.x = deltaY * rotationFactor;
    
        theta[xAxis] += rotation.x;
        theta[yAxis] += rotation.y;
        
    });
    
    document.addEventListener('mouseup', function(e) {
        if (e.button !== 2) {
            return;
        }
        isDragging = false;
    });
    
    // Sağ tıklama menüsünün açılmasını engellemek için
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    

    document.addEventListener('wheel', function(e) {
    // "e.deltaY" değeri, tekerleğin yukarı mı aşağı mı döndüğünü belirtir
    // Yukarı döndüğünde bu değer negatif, aşağı döndüğünde pozitiftir.
    
    if (e.deltaY < 0)
        zoomLevel = zoomSensitivity; // Yakınlaştırma
    else
        zoomLevel = -1*zoomSensitivity; // Uzaklaştırma

    //zoomLevel = Math.min(Math.max(.1, zoomLevel), 1.9); // zoom seviyesini bir aralıkta sınırla

    theta[zAxis] += zoomLevel; 
   
}, false);

    document.addEventListener('keypress', function(event) {
        if(event.key === 'a' ||event.key === 'A' ) {
            mainChar.move(-parseFloat(motionSpeed.toFixed(2)),xAxis)

        }
        if(event.key === 'd' ||event.key === 'D' ) {
            mainChar.move(parseFloat(motionSpeed.toFixed(2)),xAxis)
        }
        if(event.key === 'w' ||event.key === 'W' ) {
            mainChar.move(parseFloat(motionSpeed.toFixed(2)),yAxis)
        }
        if(event.key === 's' ||event.key === 'S' ) {
            mainChar.move(-parseFloat(motionSpeed.toFixed(2)),yAxis)
        }
        if(event.key === ' ' ) {
            mainChar.resetPos();
            gameStatus = true;
        }
       
    });
    
   
    createRandomBlocks(maximumBlockAmount);

    render();
}

function colorCube(vertices)
{
    quad( vertices,1, 0, 3, 2 );
    quad(vertices, 2, 3, 7, 6 );
    quad( vertices,3, 0, 4, 7 );
    quad( vertices,6, 5, 1, 2 );
    quad(vertices, 4, 5, 6, 7 );
    quad(vertices, 5, 4, 0, 1 );
}

function quad(vertices,a, b, c, d)
{
    

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);

    }
}

function moveDownEnvironment(){
   
    for(var i=0; i<blocks.length;i++){
        blocks[i].autoMove();
        if(blocks[i].status===false){
            blocks.splice(i,1);
            createRandomBlocks(1);
        }
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function createRandomBlocks(amount){
    for(var i=0; i<amount; i++){
    var block = new Block();
    block.resize(0.2);
    
    let randomSayi = getRandomArbitrary(-1, 1);
    block.move(randomSayi, xAxis);

    randomSayi = getRandomArbitrary(-1, 1);
    block.move(randomSayi, yAxis);
    if(block.distanceControl(blocks) === false){
        i--;
        continue;
    }
    //randomSayi = getRandomArbitrary(-1, 1);
    //block.move(randomSayi, zAxis);
   
    blocks.push(block);
    }

}
function render()
{
    
   
    if(gameStatus === true){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    update();
    if(mainChar.upDue > 0){
        mainChar.autoMove();
        mainChar.upDue -= 1 ;
        if(mainChar.upDue <= 0){
            mainChar.upDue = 0;
            mainChar.motion.direction = -1;
        }
    }
    else{
        mainChar.autoMove();
    }
    if(mainChar.position.y <= -0.9){
        gameStatus = false;
    }
    colorCube(mainChar.vertices);
    NumVertices = 36;
    for(var i=0; i<blocks.length;i++){
    colorCube(blocks[i].vertices);
    NumVertices+=blocks[i].numVertices;
    }
   
    
    var collisionControl = mainChar.collisionControl(blocks);
    if(collisionControl !== -1){
        if(mainChar.lastHitObject != blocks[collisionControl]){
            
            moveDownEnvironment();
            mainChar.lastHitObject = blocks[collisionControl];
        }
        mainChar.upDue = mainChar.constUpDue;
        mainChar.motion.direction = 1;
    }
    //move(-0.01,xAxis);
    //theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    requestAnimFrame( render );
}
