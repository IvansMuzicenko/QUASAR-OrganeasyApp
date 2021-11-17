// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAVfbdakVWhg_Sh60yailj4njpQ-Gky-ZQ",
  authDomain: "quasar-todo-552da.firebaseapp.com",
  databaseURL:
    "https://quasar-todo-552da-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quasar-todo-552da",
  storageBucket: "quasar-todo-552da.appspot.com",
  messagingSenderId: "176091632959",
  appId: "1:176091632959:web:0de3b098f40daa8160af8a",
  measurementId: "G-2D8RRSSCMD",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export default firebase;
