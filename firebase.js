// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQysoCJwbUODckLF_mKjb4eyHaA6X-uHs",
    authDomain: "cu-date-80565.firebaseapp.com",
    projectId: "cu-date-80565",
    storageBucket: "cu-date-80565.appspot.com",
    messagingSenderId: "432790334595",
    appId: "1:432790334595:web:8ab2f702269396bafc3fb6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth,db}