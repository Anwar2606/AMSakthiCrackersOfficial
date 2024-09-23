import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {

  //testing
  // apiKey: "AIzaSyCTmFMUSQL_lvxZSGzihrx5G7AypB4Uk5Q",
  // authDomain: "testing-855ce.firebaseapp.com",
  // projectId: "testing-855ce",
  // storageBucket: "testing-855ce.appspot.com",
  // messagingSenderId: "1086229411180",
  // appId: "1:1086229411180:web:4a835dadcfb73b08a42f49"   
  //main
  // apiKey: "AIzaSyDlnBpY-2AhQEq2G3KBkWWxWtP3SRYLmAM",
  // authDomain: "mainbillingsoftware4.firebaseapp.com",
  // projectId: "mainbillingsoftware4",
  // storageBucket: "mainbillingsoftware4.appspot.com",
  // messagingSenderId: "174898047126",
  appId: "1:174898047126:web:2937c0a0784d8a1c243ab7",
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
