import { getAuth, getRedirectResult, signInWithPopup, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";



const firebaseConfig = {
  appId: "1:369638210525:web:6c28cd35bc038d78069434",
  measurementId: "G-RC6SZE0J8B",
  apiKey: "AIzaSyDBOHznxnDCTgoXttiELjWtKQle8YYzHzY",
  authDomain: "capstone-web-54bc2.firebaseapp.com",
  projectId: "capstone-web-54bc2",
  storageBucket: "capstone-web-54bc2.appspot.com",
  messagingSenderId: "632704783586",
  appId: "1:632704783586:web:69140230a4c1edc89d3abb",
  databaseURL: "https://capstone-web-54bc2-default-rtdb.asia-southeast1.firebasedatabase.app",
};

function writeUserData(userId, email, name) {
  const db = getDatabase(app);
  set(ref(db, 'users/' + userId), {
    email: email,
    username: name,
  })
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);


const google = document.getElementById('uidGoogle');
google.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const id = user.uid;
      const email = user.email;
      const name = user.displayName;
      writeUserData(id, email, name);
      console.log(result)
      window.location.href = 'home.html'
      // IdP data available using getAdditionalUserInfo(result)
      // ...
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









