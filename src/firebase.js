// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    // Replace these with your actual keys from the Firebase Console
    apiKey: "AIzaSyCNuMf7tbA9WY1LMTbqvwsP0Su_jXDxS2w",
    authDomain: "chashakauction2026.firebaseapp.com",
    // UPDATED REGION URL
    databaseURL: "https://chashakauction2026-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chashakauction2026",
    storageBucket: "chashakauction2026.appspot.com",
    messagingSenderId: "17257870798",
    appId: "1:17257870798:web:8bfbf8e353858923cc679f"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);