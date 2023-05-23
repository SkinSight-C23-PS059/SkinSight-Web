import { getAuth, getRedirectResult, signInWithPopup, onAuthStateChanged ,GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyC8260GzG09PR7GfB3fLBddUzRTZFe8VHI",
  authDomain: "capstone-7ab4a.firebaseapp.com",
  databaseURL: "https://capstone-7ab4a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstone-7ab4a",
  storageBucket: "capstone-7ab4a.appspot.com",
  messagingSenderId: "369638210525",
  appId: "1:369638210525:web:6c28cd35bc038d78069434",
  measurementId: "G-RC6SZE0J8B"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);

// google uid
const google = document.getElementById('uidGoogle');
google.addEventListener('click' , () => {
  signInWithPopup(auth, provider)
          .then((result) => {
            console.log('Login Google');
            console.log(result);
              // This gives you a Google Access Token. You can use it to access Google APIs.
               const credential = GoogleAuthProvider.credentialFromResult(result);
               const token = credential.accessToken;
                 // The signed-in user info.
               const user = result.user;
              }).catch((error) => {
                     // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
              });            
});



