// import React, { useState } from 'react';
// import { db, storage } from '../firebase'; 
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import './Addproduct.css'; // Import the CSS file

// const AddProduct = () => {
//   const [name, setName] = useState('');
//   const [saleprice, setSalePrice] = useState('');
//   const [regularprice, setRegularPrice] = useState('');

//   const [quantity, setQuantity] = useState('');
//   // const [image, setImage] = useState(null); // State to hold the selected image file

//   const handleAddProduct = async (e) => {
//     e.preventDefault();

//     // Step 1: Upload the image to Firebase Storage
//     try {
//       // const storageRef = ref(storage, `images/${image.name}`);
//       // await uploadBytes(storageRef, image);

//       // Step 2: Get the download URL of the uploaded image
//       // const imageUrl = await getDownloadURL(storageRef);

//       // Step 3: Add product details including the image URL to Firestore
//       await addDoc(collection(db, 'products'), {
//         name,
//         saleprice: parseFloat(saleprice),
//         regularprice:parseFloat(regularprice),
//         quantity: parseInt(quantity),
//         // imageUrl, // Add the image URL to Firestore
//         discount: 0,
//       });

//       // Step 4: Clear form fields and state
//       setName('');
//       setSalePrice('');
//       setRegularPrice('');
//       setQuantity('');
//       // setImage(null);
//       alert('Product added successfully!');
//       window.location.reload();
//     } catch (error) {
//       console.error("Error adding product: ", error);
//     }
//   };

//   // const handleImageChange = (e) => {
//   //   if (e.target.files[0]) {
//   //     setImage(e.target.files[0]);
//   //   }
//   // };

//   return (
//     <div className="add-product-page">
//       <div className="add-product-container">
//         <h2>Add Product</h2>
//         <form onSubmit={handleAddProduct} className="add-product-form">
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
//           <input type="number" value={saleprice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Price" required />
//           <input type="number" value={regularprice} onChange={(e) => setRegularPrice(e.target.value)} placeholder="Price" required />
          
//           <input type="text " value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
//           {/* <input type="file" onChange={handleImageChange} accept="image/*" required /> File input for image upload */}
//           <button type="submit">Add Product</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
import React, { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import './Addproduct.css'; // Import the CSS file

const AddProduct = () => {
  const [sno, setSno] = useState('');
  const [name, setName] = useState('');
  const [saleprice, setSalePrice] = useState('');
  const [regularprice, setRegularPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState(''); // State to hold the selected category

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'products'), {
        sno,
        name,
        saleprice: parseFloat(saleprice),
        regularprice: parseFloat(regularprice),
        quantity: parseInt(quantity),
        category, // Save the selected category to Firestore
        discount: 0,
      });

      // Clear form fields and state
      setSno('');
      setName('');
      setSalePrice('');
      setRegularPrice('');
      setQuantity('');
      setCategory('');
      alert('Product added successfully!');
      window.location.reload();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h2>Add Product</h2>
        <form onSubmit={handleAddProduct} className="add-product-form">
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name" 
            required 
          />
          <input 
            type="number" 
            value={saleprice} 
            onChange={(e) => setSalePrice(e.target.value)} 
            placeholder="Sale Price" 
            required 
          />
          <input 
            type="number" 
            value={regularprice} 
            onChange={(e) => setRegularPrice(e.target.value)} 
            placeholder="Regular Price" 
            required 
          />
          <input 
            type="text" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            placeholder="Quantity" 
            required 
          />
            <select 
             className="custom-select"
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="ONE & TWO SOUND CRACKERS">ONE & TWO SOUND CRACKERS</option>
              <option value="CGROUND CHAKKAR">GROUND CHAKKAR</option>
              <option value="FLOWER POTS">FLOWER POTS</option>
              <option value="BOMB">BOMB</option>
              <option value="TWINKLING STAR">TWINKLING STAR</option>
              <option value="MAGIC PENCIL">MAGIC PENCIL</option>
              <option value="ROCKETS">ROCKETS</option>
              <option value="FOUNTAIN">FOUNTAIN</option>
              <option value="MATCH BOX">MATCH BOX</option>
              <option value="KIDS FANCY">KIDS FANCY</option>
              <option value="DELUXE CRACKERS">DELUXE CRACKERS</option>
              <option value="MULTI COOUR SHOTS">MULTI COOUR SHOTS</option>
              <option value="SPARKLES">SPARKLES</option>
              <option value="BIJILI CRACKERS">BIJILI CRACKERS</option>
              <option value="2 COMET">2" COMET</option>
              <option value="2 COMET - 3 PCS">2" COMET - 3 PCS</option>
              <option value="31/2 COMETS">31/2" COMETS</option>
              <option value="CHOTTA FANCY">CHOTTA FANCY</option>
              <option value="RIDER">RIDER</option>
              <option value="DIGITAL LAR (WALA)">DIGITAL LAR (WALA)</option>
              <option value="PEPPER BOMB">PEPPER BOMB</option>
              <option value="GIFT BOX VARIETIES">GIFT BOX VARIETIES</option>
            </select>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
