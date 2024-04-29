import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCDj6CNPDV80JSOqInW4GsG2ai2h5lAONg",
  authDomain: "prodesco-6910f.firebaseapp.com",
  databaseURL: "https://prodesco-6910f-default-rtdb.firebaseio.com",
  projectId: "prodesco-6910f",
  storageBucket: "prodesco-6910f.appspot.com",
  messagingSenderId: "1021676695100",
  appId: "1:1021676695100:web:362517f021b32259205d39",
  measurementId: "G-X0ZGJ3BQ36"
}

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();  // obtiene la instancia ya creada
}

export const db = database(app);
export const st = storage

