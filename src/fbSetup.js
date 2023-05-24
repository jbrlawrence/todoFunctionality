
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore
} from 'firebase/firestore'

import { getAuth } from "firebase/auth"


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXxl67w-RhT-HyOIXDwcvYxLtqSxPXesg",
    authDomain: "test2023-54cd1.firebaseapp.com",
    projectId: "test2023-54cd1",
    storageBucket: "test2023-54cd1.appspot.com",
    messagingSenderId: "1028743080476",
    appId: "1:1028743080476:web:9c7bf372c3a822848c8dd9"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
