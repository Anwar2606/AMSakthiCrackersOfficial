import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {

  //testing
//   apiKey: "AIzaSyCTmFMUSQL_lvxZSGzihrx5G7AypB4Uk5Q",
//   authDomain: "testing-855ce.firebaseapp.com",
//   projectId: "testing-855ce",
//   storageBucket: "testing-855ce.appspot.com",
//   messagingSenderId: "1086229411180",
//   appId: "1:1086229411180:web:4a835dadcfb73b08a42f49"   
  //main
  apiKey: "AIzaSyBkFN60r2kntuFoGggyNdExFUJJsdR1a9o",
  authDomain: "mainbillingsofteware3.firebaseapp.com",
  projectId: "mainbillingsofteware3",
  storageBucket: "mainbillingsofteware3.appspot.com",
  messagingSenderId: "680763768979",
  appId: "1:680763768979:web:e462416068b88177058d66"
 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 

export { db, storage, auth }; 
