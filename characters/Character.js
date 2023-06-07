class Character {
    xAxis = 0;
    yAxis = 1;
    zAxis = 2;
    numVertices = 36;
    lastHitObject = null;
    motion = {
        stat: true,
        axis: 1,
        direction: 1,
        size: 0.015
    };
    posDelete = 2;
    constructor() {
        
    }
    vertices = [
    ];
    constVertices = [
    ];
    position = {
        x: 0,
        y: 0,
        z: 0
    };
    size = {
        width:0,
        height:0,
        depth:0
    };

    getMaxDifference(axis){
        var max = 0;
        for(var i=0; i<this.vertices.length;i++){
            
            for(var j=0; j<this.vertices.length;j++){
                var dif = this.vertices[i][axis]-this.vertices[j][axis];
                if(max < dif)
                {   
                    max = dif;

                }
            }
            
        }
        return max;
    }
    sizeCalculate(){
       this.size.width = this.getMaxDifference(this.xAxis);
       this.size.height = this.getMaxDifference(this.yAxis);
       this.size.depth = this.getMaxDifference(this.zAxis);
    }
    positionControl(){

        // X axis 
        if(this.position.x >= 1){
           
            this.move(-this.posDelete,xAxis);
        }
        if(this.position.x <= -1){
           
            this.move(this.posDelete,xAxis);
        }

        // Y axis
        if(this.position.y >= 1){
           
            //this.move(-this.posDelete,yAxis);
        }
        if(this.position.y <= -1){
           
            this.move(this.posDelete,yAxis);
        }

        // Z axis
        if(this.position.z >= 1){
            
            this.move(-this.posDelete,zAxis);
        }
        
        if(this.position.z <= -1){
            
            this.move(this.posDelete,zAxis);
        }
     
    }
    move(len,axis){

        for(var i=0; i<this.vertices.length;i++){
            
            this.vertices[i][axis] +=len; 
            
        }
        if(axis === this.xAxis){
            this.position.x += len;
        }
        else if(axis === this.yAxis){
            this.position.y += len;
        }
        else{
            this.position.z += len;
        }
        this.positionControl();
    }
    
    resize(ratio){
        for(var i=0; i<this.vertices.length;i++){
            for(var j=0; j<3;j++){
                this.vertices[i][j] = ratio * this.constVertices[i][j]; 
            }
        }
        this.sizeCalculate();
    }

    autoMove(){
        var len = this.motion.direction * this.motion.size;
        this.move(len,this.motion.axis);
    }

    resetPos(){
        this.move(-this.position.x,this.xAxis);
        this.move(-this.position.y,this.yAxis);
        this.move(-this.position.z,this.zAxis);

    }
    resetSize(){
        this.vertices = this.constVertices;
    }
}
