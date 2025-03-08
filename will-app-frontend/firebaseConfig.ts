// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

declare global {
    interface Window {
      recaptchaVerifier: RecaptchaVerifier;
    }
  }

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQYul7zD79Lm6MMe_s7fdBPInd6LyiocQ",
    authDomain: "otp-demo-483d4.firebaseapp.com",
    projectId: "otp-demo-483d4",
    storageBucket: "otp-demo-483d4.firebasestorage.app",
    messagingSenderId: "41320486356",
    appId: "1:41320486356:web:4552275641759e9f2c7241"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };