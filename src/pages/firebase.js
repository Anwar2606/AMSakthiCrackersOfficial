import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {

 
  
  apiKey: "AIzaSyCTkh1QhF08AJpohpG2QmPZxHtzA4wG3ME",
  authDomain: "mainbillingsoftware.firebaseapp.com",
  projectId: "mainbillingsoftware",
  storageBucket: "mainbillingsoftware.appspot.com",
  messagingSenderId: "707236873656",
  appId: "1:707236873656:web:b89d3fe3955f96cf03bb4d"
 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 

export { db, storage, auth }; 
