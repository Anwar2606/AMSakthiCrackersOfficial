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
  const [category, setCategory] = useState(''); 
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
            type="text" 
            value={sno} 
            onChange={(e) => setSno(e.target.value)} 
            placeholder="Product code" 
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
              <option value="GROUND CHAKKAR">GROUND CHAKKAR</option>
              <option value="FLOWER POTS">FLOWER POTS</option>
              <option value="BOMB">BOMB</option>
              <option value="TWINKLING STAR">TWINKLING STAR</option>
              <option value="MAGIC PENCIL">MAGIC PENCIL</option>
              <option value="ROCKETS">ROCKETS</option>
              <option value="FOUNTAIN">FOUNTAIN</option>
              <option value="MATCH BOX">MATCH BOX</option>
              <option value="KIDS FANCY">KIDS FANCY</option>
              <option value="DELUXE CRACKERS">DELUXE CRACKERS</option>
              <option value="MULTI COLOUR SHOTS">MULTI COLOUR SHOTS</option>
              <option value="SPARKLES">SPARKLES</option>
              <option value="BIJILI CRACKERS">BIJILI CRACKERS</option>
              <option value="2 COMET">2" COMET</option>
              <option value="2 COMET - 3 PCS">2" COMET - 3 PCS</option>
              <option value="4 COMET - 2 PCS">4" COMET - 2 PCS</option>
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
