// Your Firebase config
const baseUrl = "http://127.0.0.1:5500/ui";

const firebaseConfig = {
  apiKey: "AIzaSyDxjqRI_nR4rhwOU8CEcyh2TO9DmdIJHik",
  authDomain: "campus-nav-af42a.firebaseapp.com",
  projectId: "campus-nav-af42a",
  storageBucket: "campus-nav-af42a.firebasestorage.app",
  messagingSenderId: "577667456760",
  appId: "1:577667456760:web:0791ecb7bb77628ba1a50d",
  measurementId: "G-JQVTLKJML8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", () => {
  auth
    .signInWithPopup(googleProvider)
    .then((result) => {
      const idToken = result?.credential?.accessToken;

      localStorage.idToken = idToken;

      window.location.href = idToken
        ? `${baseUrl}/viewer.html`
        : `${baseUrl}/login.html`;
    })
    .catch((error) => alert(error));
});

