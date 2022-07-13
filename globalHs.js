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

import {getDatabase, ref, set, child, update, remove} 
from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

const rand = () => Math.random(0).toString(36).substr(2);
const token = (length) => (rand() + rand() + rand() + rand()).substr(0, length);

export async function registerNewHighscore(highscore) {
    const db = getDatabase();
    console.log(db)
    const newToken = token(32);
    const username = prompt("Please enter your username", "");
    try {
        set(ref(db, 'users/' + newToken), {
            username: username,
            highscore: highscore
        }).then(() => {
            console.log("Successfully registered new high score!");
        });
    } catch (err) {
        console.log(err, "ERROR! Could not register new high score")
    }
}