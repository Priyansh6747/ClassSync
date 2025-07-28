// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBePLQwhZJAcCByHF3KHDrkK9fnmri4p3M",
    authDomain: "classsync-985e9.firebaseapp.com",
    projectId: "classsync-985e9",
    storageBucket: "classsync-985e9.firebasestorage.app",
    messagingSenderId: "165737218733",
    appId: "1:165737218733:web:e69ef496efb8488fec3c24",
    measurementId: "G-V9VYFENY4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);