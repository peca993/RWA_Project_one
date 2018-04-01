export class Duck{

    constructor(id,speed,color,health,xPosition,yPosition){
        this.id = id;
        this.speed = speed;
        this.color = color;
        this.health = health;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    speedUp(){
        if(this.speed < 10){
            this.speed++;
        }
    }

    slowDown(){
        if(this.speed >1){
            this.speed--;
        }
    }

    shot(){
        this.health--;
    }

    static display(){
        return console.log("Duck(speed = "+this.speed+",color = "+this.color+",health = "+this.health);
    }

    fly(x,y){
        this.xPosition = x;
        this.yPosition = y;
    }


}