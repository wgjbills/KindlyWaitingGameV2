// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0Xe_lWj5OQS0mQR4Y_LyjrBOq6RXe5m4",
    authDomain: "kindlygamehighscores.firebaseapp.com",
    databaseURL: "https://kindlygamehighscores-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kindlygamehighscores",
    storageBucket: "kindlygamehighscores.appspot.com",
    messagingSenderId: "103582566768",
    appId: "1:103582566768:web:4fdb378e853cb1cc99e7b5",
    measurementId: "G-7EHRK2R6JZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, set, get, child, update, remove, onValue} 
from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

let newToken;
const rand = () => Math.random(0).toString(36).substr(2);
const token = (length) => (rand() + rand() + rand() + rand()).substr(0, length);


export async function registerNewHighscore(highscore) {
    const db = getDatabase();
    if (localStorage.getItem("token") === null){
        newToken = token(32);
        console.log("no tokens");
        localStorage.setItem("token", newToken);
        console.log("set new token");
    } else{
        let userToken = localStorage.getItem("token");
        newToken = userToken;
    }
    
    let username = prompt("Please enter your username", "");
    let newUsername;

    if (username == null){
        alert("No username registered for highscore!");
        newUsername = prompt("Please enter your username", "");

        if (username == undefined || newUsername == undefined){
            newUsername = "WhoAmI";
        }
    } else if (username.length > 11){
        newUsername = username.slice(0, 11);
    }

    try {
        set(ref(db, 'users/' + newToken), {
            username: newUsername || username,
            highscore: highscore
        }).then(() => {
            console.log("Successfully registered new high score!");
        });
    } catch (err) {
        console.log(err, "ERROR! Could not register new high score")
    }
}

export async function getData(){
    const db = getDatabase();

    try {
        const users = await get(ref(db, 'users'));
        const highscoresFromDb = users.val();
    
        const scores = Object.entries(highscoresFromDb).map(function ([key, value]){
            return {
                ...value,
                id: key,
            }
        });
        scores.sort(function (a, b){
            let keyA = a.highscore;
            let keyB = b.highscore;
            
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
        return scores;
    } catch(error){
        console.log("ERROR! "+error);
    }
}

export async function makeList(){
    const listData = await getData();
    const listElement = document.createElement('ul');
    const hsBoardScore = document.getElementById('hsBoard');
    
    hsBoardScore.innerHTML = "LEADERBOARD ";
    document.getElementById('hsBoard').appendChild(listElement);

    
    for (let i = 0; i < 10 && i < listData.length; i++){
        const listItem = document.createElement('li');
        const listName = document.createElement('p');
        const listScore = document.createElement('p');
        
        listItem.classList.add("hsLi");
        listName.classList.add("scoreName");
        listScore.classList.add("scoreScore");

        listName.innerHTML = [i+1] + ".  " + listData[i].username;
        listScore.innerHTML = listData[i].highscore;
        
        listItem.appendChild(listName);
        listItem.appendChild(listScore);
        listElement.appendChild(listItem);
    }
    console.log(listData);
}