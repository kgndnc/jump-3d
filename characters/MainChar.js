// MainChar.js
class MainChar extends Character {
    constUpDue = 40;
    upDue = this.constUpDue;
    tolerans = 0.01;
    vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];
    constVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];
    constructor() {
        super();
        this.sizeCalculate();
        //this.move(-0.5,this.yAxis);
    }
    collisionControl(blockList){
        if(this.motion.direction === 1){
            return -1;
        }
        for (let i = 0; i < blockList.length; i++) {
            let obj2 = blockList[i];
    
            if (this.position.y - this.size.height / 2 <=   obj2.position.y + obj2.size.height / 2 + this.tolerans &&
            this.position.y - this.size.height / 2 >=   obj2.position.y + obj2.size.height / 2 - this.tolerans &&
            this.position.x - this.size.width / 2 <= obj2.position.x + obj2.size.width / 2 + this.tolerans &&
            this.position.x + this.size.width / 2 >= obj2.position.x - obj2.size.width / 2 - this.tolerans &&
            this.position.z - this.size.depth / 2 <= obj2.position.z + obj2.size.depth / 2 + this.tolerans &&
            this.position.z + this.size.depth / 2 >= obj2.position.z - obj2.size.depth / 2 - this.tolerans) {
            return i; // çarpışma olan nesnenin indexini döndür
        }
        }
        return -1; // çarpışma yok
    }
    resetPos(){
        this.upDue = this.constUpDue;
        this.motion.direction = 1;
        super.resetPos();
    }
    
}

