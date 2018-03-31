export class Duck{

    constructor(speed,color,health){
        this.speed = speed;
        this.color = color;
        this.health = health;
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

    display(){
        return "<button></button>"
    }


}