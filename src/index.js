import 'bootstrap';
import './main.scss';
import $ from 'jquery';
import * as Rxjs from "rxjs";
import { Duck } from './Duck';
const height = 490;   
const witdh = 890;

let gameTime = 1;
let clock = 0;
let clock5 = 0;
let clock10 = 0;
let step = 1;
let numOfCreatedDucks = -1;
let ducks = [];
let x;
let y;
let speedUp = 1;
let level = 1;

let timer$$;
let display$$;
let gameOver$$;
let movement$$;
const url = "http://localhost:4123/gamer";
const gameSong = new Audio('./sound/gameSong.mp3');
const gameOverSong = new Audio('./sound/gameOver.wav');
const app = document.getElementById('app');

const r1 = document.createElement("div");
app.appendChild(r1);
r1.className = "row card";

const c11 = document.createElement("div");
r1.appendChild(c11);
c11.className = ""

const instructionsBtn = document.getElementById("instructionsBtn");
Rxjs.Observable.fromEvent(instructionsBtn,"click")
    .subscribe(
        () => {
            const instructions = "GAME INSTRUCTIONS\n\n Put your mouse over the Twitter to shoot it.\n Try to get a high score. \n Enjoy!";
            
            alert(instructions);
        }
    );

const startBtn = document.createElement("button");
const startBtnDiv = document.getElementById('startBtnDiv');
startBtnDiv.appendChild(startBtn);
startBtn.className = "btn-lg btn-primary";
startBtn.innerHTML = '<i class="fa fa-play"></i> START';

const sourceCodeBtn = document.createElement("button");
const sourceCodeDiv = document.getElementById('sourceCodeDiv');
sourceCodeDiv.appendChild(sourceCodeBtn);
sourceCodeBtn.className = "btn-lg  btn-success";
sourceCodeBtn.innerHTML = '<i class="fa fa-github-alt"></i>Source code';
sourceCodeBtn.onclick = () => {
    location.href = "https://github.com/peca993/RWA_Project_one";
};

const highScoreLink = document.getElementById("highScoresLink");
highScoreLink.className = "btn-lg  btn-danger";
const highScoreBtnIcon = document.createElement("i");
highScoreLink.appendChild(highScoreBtnIcon);
//highScoreLink.className = "fa fa-list-ol"; 

const gameScreen = document.createElement('div');
c11.appendChild(gameScreen);
//gameScreen.backgroundImage = "url('/images/background-mac.jpg')"; 
gameScreen.className = "gameScreen text-center pagination-centered center-block";


const gameScreenBottom = document.createElement('div');
c11.appendChild(gameScreenBottom);
gameScreenBottom.className = "row";

const scoreH1 = document.createElement("h1");
const scoreSpan = document.createElement("span");
gameScreenBottom.appendChild(scoreH1);
scoreH1.className = "col-md-6";
scoreH1.appendChild(scoreSpan);
scoreSpan.classList = "badge badge-pill badge-primary";

/**
 * High scores
 */
const highScoreLink$ = Rxjs.Observable.fromEvent(highScoreLink,"click");
highScoreLink$.subscribe(
    () => {

        const postsObservable =  Rxjs.Observable.fromPromise(
            fetch(url)
            .then(response => response.json())
        )
        .subscribe(players => {

            let topPlayers = players.sort((a, b) => b.score - a.score).slice(0,10);

            let scoreList = "TOP 10\n\n";
            
            topPlayers.map(
                (player,index) => {
                    scoreList += index+1+". "+player.name+" "+player.score+"\n";
                }
            );
                alert(scoreList);
        });

    }
);

/**
 * Start game
 */
const startBtn$ = Rxjs.Observable.fromEvent(startBtn,"click");
startBtn$.subscribe(
    () => {

        if(timer$$ != null){
            timer$$.unsubscribe();
            movement$$.unsubscribe();
            display$$.unsubscribe();
            gameOver$$.unsubscribe();
        }
        
        gameSong.currentTime = 0;
        gameSong.play();
        gameSong.loop = true;

        gameScreen.className = "gameScreen text-center pagination-centered center-block";
        startBtn.innerHTML = '<i class="fa fa-repeat"></i> RESTART';
        gameScreen.innerHTML = "";
        ducks.splice(0,ducks.length);
        gameTime = 1;
        clock = 0;
        clock5 = 0;
        speedUp = 1;
        step = 1;
        numOfCreatedDucks = -1;
        //ducks = [];
        x = Math.random()*witdh - 70;
        y = Math.random()*height - 70;
        ducks.push(new Duck(numOfCreatedDucks,speedUp,1,speedUp,x,y));
        numOfCreatedDucks++;

        const timer$ = Rxjs.Observable.timer(0, 100);

        /**
         * Movement
         */
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
                        if(xx > witdh-35){
                            xx = witdh-35;
                        }
                        if(xx < 0){
                            xx = 0;
                        }
                        if(yy > height-70){
                            yy = height-70;
                        }
                        if(yy < 0){
                            yy = 0;
                        }
        
                        duck.fly(xx,yy);   
                    }    
                );
        
                }
            );
        
        
         /**
         * Game timer
         */
        
            timer$$ =  timer$.subscribe(
            () => {
                clock++;
                clock5++;
                clock10++;
                if(clock === 20){
                    scoreSpan.innerHTML ="Score: "+gameTime+" Level: "+level;
                    gameTime++;
                    clock = 0;
                    step++;
                    let x = Math.random()*witdh - 70;
                    let y = Math.random()*height - 70;
                    ducks.push(new Duck(numOfCreatedDucks,speedUp,1,speedUp,x,y));
                    numOfCreatedDucks++;
                }

                if(clock5 == 100){
                    clock5 = 0;
                    speedUp++;  //Speed up
                }

                if(clock10 == 200){
                    clock10 = 0;
                    level++;  //Speed up
                }
            }
        );
        /**
         * Dispaly
         */
        display$$ = timer$.subscribe(
            () => {

                let filteredDucks = ducks.filter(
                    (duck) => {
                        return (duck.health > 0);
                    }
                );
        
                ducks = filteredDucks;
                gameScreen.innerHTML = "";  //  Clear screen
                ducks.map(
                    duck => {
                            
                            const btnDuck = document.createElement("button");
                            gameScreen.appendChild(btnDuck);
                            btnDuck.className = "duck btn-lg btn-info btn-circle btn-xl",
                            btnDuck.innerHTML = '<i class="fa fa-twitter"></i><p class="health"><i class="fa fa-heart"><i>'+duck.health+'</i><p></i>';
                            btnDuck.style.left =  duck.xPosition +"px";
                            btnDuck.style.top = duck.yPosition+"px";
        
                            const btnClick$ = Rxjs.Observable.fromEvent(btnDuck,"mouseover");
                            //const btnClick$ = Rxjs.Observable.fromEvent(btnDuck,"click");

                            btnClick$.subscribe(
                                () => {
                                    duck.health -= level;
                                }
                            );
                    }
                );    
        
                
            
            }
        
            
        );
        /**
         * Game over
         */
        gameOver$$ = timer$.subscribe(
            () => {
                if(ducks.length > 15){
                    gameSong.pause();
                    gameSong.currentTime = 0;
                    gameOverSong.play();
                    movement$$.unsubscribe();
                    display$$.unsubscribe();
                    timer$$.unsubscribe();
                    gameScreen.innerHTML = "";
                    
                    gameScreen.className = "gameOverScreen text-center pagination-centered center-block";
                   
                    
                    const submitScoreDiv = document.createElement("div");
                    gameScreenBottom.appendChild(submitScoreDiv);
                    submitScoreDiv.className = "col-md-6 row";
                    
                    const inputScore = document.createElement("input");
                    submitScoreDiv.appendChild(inputScore);
                    inputScore.className = "col-md-6 form-control";
                    const inputScoreSbmtBtn = document.createElement("button");
                    submitScoreDiv.appendChild(inputScoreSbmtBtn);
                    inputScoreSbmtBtn.className = "btn btn-success col-md-6";
                    inputScoreSbmtBtn.innerHTML = "Submit";
                    
                    
                    
                    const submit$ =  Rxjs.Observable.fromEvent(inputScoreSbmtBtn,"click");
                    
                    submit$.subscribe(
                        () => {
                            
                            let data = {
                                id:null,
                                name:null,
                                score:null
                            };


                            Rxjs.Observable.fromPromise(
                                fetch(url)
                                .then(response => response.json())
                            )
                            .subscribe(players => {
                                

                            let lastID = Math.max.apply(Math,players.map(
                                (player) => {
                                    console.log(player);
                                    return player.id;
                                }));
                                
                                
                                data.id = lastID + 1;

                            });
                            

                            data.name = inputScore.value;
                            data.score = gameTime - 1; 

                            function postData(url, data) {
                              return fetch(url, {
                                body: JSON.stringify(data),
                                headers: {
                                    'content-type': 'application/json'
                                },
                                method: 'POST'
                              })
                              .then(response => response.json()) 
                            }
                            
                            postData(url,data);
                            gameScreenBottom.removeChild(submitScoreDiv);
                        }
                    );
                    
                    timer$.unsubscribe();
                }
            }
        );

    }    
);

