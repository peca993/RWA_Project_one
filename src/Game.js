export class Game{

    constructor(){
        this.status = false;


    }

    static start(){
        this.status = true;
    }

    static stop(){
        this.status = false;
    }

}
