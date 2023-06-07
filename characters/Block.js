// Block.js
class Block extends Character {
    constUpDue = 50;
    upDue = this.constUpDue;
    necessaryDistance = 0.6;
    status = true;
    vertices = [
        vec4( -0.5, -0.25,  0.5, 1.0 ),
        vec4( -0.5,  0.25,  0.5, 1.0 ),
        vec4(  0.5,  0.25,  0.5, 1.0 ),
        vec4(  0.5, -0.25,  0.5, 1.0 ),
        vec4( -0.5, -0.25, -0.5, 1.0 ),
        vec4( -0.5,  0.25, -0.5, 1.0 ),
        vec4(  0.5,  0.25, -0.5, 1.0 ),
        vec4(  0.5, -0.25, -0.5, 1.0 )
    ];
    constVertices = [
        vec4( -0.5, -0.25,  0.5, 1.0 ),
        vec4( -0.5,  0.25,  0.5, 1.0 ),
        vec4(  0.5,  0.25,  0.5, 1.0 ),
        vec4(  0.5, -0.25,  0.5, 1.0 ),
        vec4( -0.5, -0.25, -0.5, 1.0 ),
        vec4( -0.5,  0.25, -0.5, 1.0 ),
        vec4(  0.5,  0.25, -0.5, 1.0 ),
        vec4(  0.5, -0.25, -0.5, 1.0 )
    ];
    constructor() {
        super();
        this.motion.direction = -1;
        this.motion.size =0.4;
        this.sizeCalculate();
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
           
            this.move(-this.posDelete,yAxis);
        }
        if(this.position.y <= -1){
           
            this.status = false;
        }

        // Z axis
        if(this.position.z >= 1){
            
            this.move(-this.posDelete,zAxis);
        }
        
        if(this.position.z <= -1){
            
            this.move(this.posDelete,zAxis);
        }
     
    }
    resetPos(){
        this.upDue = this.constUpDue;
        this.motion.direction = -1;
        super.resetPos();
    }
    distanceControl(blockList){
        if(blockList.length === 0){
            return true;
        }
        var len = 0;
        var lenMin = 10;
        for(var i=0; i<blockList.length; i++){
            len = Math.abs(blockList[i].position.x - this.position.x)+
            Math.abs(blockList[i].position.y - this.position.y)+
            Math.abs(blockList[i].position.z - this.position.z);
            if(len < lenMin){
                lenMin = len;
            }
        }
        
        if(lenMin < this.necessaryDistance){
          
            return false;
        }
        
        return true;
    }
    
}
