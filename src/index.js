import 'bootstrap';
import './main.scss';
import $ from 'jquery';
import { Navbar } from './pageParts/navbar';
import * as Rxjs from "rxjs";
import { Duck } from './Duck';
import { Game } from './Game';

const height = 490;   
const witdh = 890;

let gameTime = 1;
let clock = 0;
let step = 1;
let numOfCreatedDucks = -1;
let ducks = [];
let x;
let y;

let timer$$;
let display$$;
let game$$;
let movement$$;

const app = document.getElementById('app');

const r1 = document.createElement("div");
app.appendChild(r1);
r1.className = "row card";

const c11 = document.createElement("div");
r1.appendChild(c11);
c11.className = "col-lg-6"

const startBtn = document.createElement("button");
const startBtnDiv = document.getElementById('startBtnDiv');
startBtnDiv.appendChild(startBtn);
startBtn.className = "btn-lg btn-warning";
startBtn.innerHTML = "START";


const gameScreen = document.createElement('div');
c11.appendChild(gameScreen);
gameScreen.className = "gameScreen";

const scoreH1 = document.createElement("h3");
app.appendChild(scoreH1);


const startBtn$ = Rxjs.Observable.fromEvent(startBtn,"click");
startBtn$.subscribe(
    () => {

        if(timer$$ != null){
            timer$$.unsubscribe();
            movement$$.unsubscribe();
            display$$.unsubscribe();
            game$$.unsubscribe();
        }
        

        gameScreen.className = "gameScreen";
        startBtn.innerHTML = "RESTART";
        gameScreen.innerHTML = "";
        ducks.splice(0,ducks.length);
        gameTime = 1;
        clock = 0;
        step = 1;
        numOfCreatedDucks = -1;
        //ducks = [];
        x = Math.random()*witdh;
        y = Math.random()*height;
        ducks.push(new Duck(numOfCreatedDucks,step,1,step,x,y));
        numOfCreatedDucks++;

        const timer$ = Rxjs.Observable.timer(0, 100);

        movement$$ = timer$.subscribe(    
            () => {
                ducks.map(
                    (duck) => {
                        let x = Math.random() >= 0.5;
                        let y = Math.random() >= 0.5;
                        if(x == true){
                            x = duck.speed;   //right
                        }else{
                            x = -duck.speed;  //left
                        }
                        if(y == true){
                            y = duck.speed;   //up
                        }else{
                            y = -duck.speed;  //down
                        }
                        let xx = duck.xPosition + x;
                        let yy = duck.yPosition + y;
        
                        /**
                         * Borders
                         */
                        if(xx > witdh){
                            xx = witdh;
                        }
                        if(xx < 0){
                            xx = 0;
                        }
                        if(yy > height){
                            yy = height;
                        }
                        if(yy < 0){
                            yy = 0;
                        }
        
                        duck.fly(xx,yy);   
                    }    
                );
        
                }
            );
        
        
        
        timer$$ =  timer$.subscribe(
            () => {
                clock++;
                if(clock === 20){
                    scoreH1.innerHTML = gameTime;
                    gameTime++;
                    clock = 0;
                    step++;
                    let x = Math.random()*witdh;
                    let y = Math.random()*height
                    ducks.push(new Duck(numOfCreatedDucks,step,1,step,x,y));
                    numOfCreatedDucks++;
                }
                let rest = gameTime % 10;
                if(rest == 0){       
                }
            }
        );
        display$$ = timer$.subscribe(
            () => {
                gameScreen.innerHTML = "";  //  Clear screen
                ducks.map(
                    duck => {
                            
                            const btnDuck = document.createElement("button");
                            gameScreen.appendChild(btnDuck);
                            btnDuck.className = "duck btn btn-info",
                            btnDuck.innerHTML = '<i class="fa fa-twitter"></i>'+duck.health;
                            btnDuck.style.left =  duck.xPosition +"px";
                            btnDuck.style.top = duck.yPosition+"px";
        
                            const btnClick$ = Rxjs.Observable.fromEvent(btnDuck,"click");
        
                            btnClick$.subscribe(
                                () => {
                                    duck.health -= 10;
                                }
                            );
           
                    }
                );    
        
                let filteredDucks = ducks.filter(
                    (duck) => {
                        return (duck.health > 0);
                    }
                );
        
                ducks = filteredDucks;
            
            }
        
            
        );
        game$$ = timer$.subscribe(
            () => {
                if(ducks.length > 15){
                    movement$$.unsubscribe();
                    display$$.unsubscribe();
                    timer$$.unsubscribe();
                    gameScreen.innerHTML = "";
                    const gameOverH1 = document.createElement("h1");
                    gameOverH1.className = "gameOverH1";
                    gameScreen.appendChild(gameOverH1);
                    gameScreen.className = "gameOverScreen";
                    gameOverH1.innerHTML = "GAME OVER!";
                    const gameOverScoreH4 = document.createElement("h4");
                    gameScreen.appendChild(gameOverScoreH4);
                    gameOverScoreH4.innerHTML = "Your score is "+(gameTime-1);
                                      
                    const inputScore = document.createElement("input");
                    gameScreen.appendChild(inputScore);
                    const inputScoreSbmtBtn = document.createElement("button");
                    gameScreen.appendChild(inputScoreSbmtBtn);
                    inputScoreSbmtBtn.className = "btn btn-primary";
                    inputScoreSbmtBtn.innerHTML = "Submit";
                    /*
                        Ovde
                    */                    
                    timer$.unsubscribe();
                }
            }
        );

    }    
);


