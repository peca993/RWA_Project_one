import 'bootstrap';
import './main.scss';
import $ from 'jquery';
import { Navbar } from './pageParts/navbar';
import * as Rxjs from "rxjs";
import { Duck } from './Duck';
import { Game } from './Game';


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

const stopBtn = document.createElement("button");
c11.appendChild(stopBtn);
stopBtn.className = "btn-lg btn-warning";
stopBtn.innerHTML = "STOP";
const stopBtn$ = Rxjs.Observable.fromEvent(stopBtn,"click");
stopBtn$.subscribe(
    (e) => {
        startBtn.innerHTML = "START";
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

const ducks = []; 

let duck = document.createElement("button")
ducks.push(duck);



ducks.map(e => {    
    e.className = "duck btn btn-info",
    gameScreen.appendChild(e),
    e.innerHTML = '<i class="fa fa-twitter"></i>';
    e.style.left =  (Math.random()*950+25) +"px",
    e.style.top = (Math.random()*350+25)+"px",Rxjs.Observable.fromEvent(e,"click")
    .subscribe( () =>{ducks.pop(e),
        e.parentNode.removeChild(e)} )
    
});

ducks.map(e => document.write(e));