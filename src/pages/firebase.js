import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {

 
  
  apiKey: "AIzaSyDuuXgbYubht3Ba5Gl1oTjecz24DuaEsEQ",
  authDomain: "mainbillingsoftware2.firebaseapp.com",
  projectId: "mainbillingsoftware2",
  storageBucket: "mainbillingsoftware2.appspot.com",
  messagingSenderId: "495185796072",
  appId: "1:495185796072:web:68e88b565fdc1b32cd225d"
 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 

export { db, storage, auth }; 
