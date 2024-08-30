import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC35DB_BfzLeSRYB99Ye4LNTdp5sNKXjD0",
  authDomain: "login-6a024.firebaseapp.com",
  projectId: "login-6a024",
  storageBucket: "login-6a024.appspot.com",
  messagingSenderId: "1064704207102",
  appId: "1:1064704207102:web:a35ed20e7dcff06e719daf",
  measurementId: "G-FT1MLVJ5J1"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
export {auth, googleProvider}