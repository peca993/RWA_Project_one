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
let x = Math.random()*witdh;
let y = Math.random()*height;
ducks.push(new Duck(numOfCreatedDucks,10,1,step,x,y));
numOfCreatedDucks++;

const app = document.getElementById('app');

const r1 = document.createElement("div");
app.appendChild(r1);
r1.className = "row card";

const c11 = document.createElement("div");
r1.appendChild(c11);
c11.className = "col-lg-6"

const startBtn = document.createElement("button");
c11.appendChild(startBtn);
startBtn.className = "btn-lg btn-warning";
startBtn.innerHTML = "START";
const startBtn$ = Rxjs.Observable.fromEvent(startBtn,"click");
startBtn$.subscribe(
    (e) => {
        startBtn.innerHTML = "Restart";
        console.log(e);
    },
    (err) => {
        console.log(err);
    },
    () => {
        alert('cu uradim nesto!');
    }    
);


const gameScreen = document.createElement('div');
app.appendChild(gameScreen);
gameScreen.className = "gameScreen";



/**
 * -------------------------------------------------------
 */
const timer$ = Rxjs.Observable.timer(0, 100)
    .timeInterval();    // testirati moze li bez ovoaga <<---

const movement$$ = timer$.subscribe(    
    () => {
        ducks.map(
            (duck) => {
                let x = Math.random() >= 0.5;
                let y = Math.random() >= 0.5;
                if(x == true){
                    x = step;   //up
                }else{
                    x = -step;  //down
                }
                if(y == true){
                    y = step;   //right
                }else{
                    y = -step;  //left
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
                    yy = 0;
                }
                if(yy < 0){
                    yy = 0;
                }

                duck.fly(xx,yy);   
            }    
        );

        }

    );



    timer$.subscribe(
    () => {
        clock++;
        if(clock === 20){
            gameTime++;
            clock = 0;
            step++;
            let x = Math.random()*witdh;
            let y = Math.random()*height
            ducks.push(new Duck(numOfCreatedDucks,10,1,step,x,y));
            numOfCreatedDucks++;
        }

        let rest = gameTime % 10;
        if(rest == 0){
            
        }
    }
);

const display$$ = timer$.subscribe(
    () => {
        gameScreen.innerHTML = "";  //  Clear screen
        ducks.map(
            duck => {
                    
                    const btnDuck = document.createElement("button");
                    gameScreen.appendChild(btnDuck);
                    btnDuck.className = "duck btn btn-info",
                    btnDuck.innerHTML = '<i class="fa fa-twitter"></i>';
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

const game$$ = timer$.subscribe(
    () => {
        if(ducks.length > 150){
            movement$$.unsubscribe();
            display$$.unsubscribe();
            gameScreen.innerHTML = "";
            const gameOverH1 = document.createElement("h1");
            gameScreen.appendChild(gameOverH1);
            gameOverH1.innerHTML = "GAME OVER!";
        }
    }
);
