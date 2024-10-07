import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0Q0v91MVZ1WXaXhXw7U6Iy9IQKYC8zJw",
  authDomain: "final-da3c8.firebaseapp.com",
  projectId: "final-da3c8",
  storageBucket: "final-da3c8.appspot.com",
  messagingSenderId: "108562652183",
  appId: "1:108562652183:web:a2759c3a25b8d618dcd052",
  measurementId: "G-G8T00ZBFL5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider(); 

export { auth, googleProvider, githubProvider };
