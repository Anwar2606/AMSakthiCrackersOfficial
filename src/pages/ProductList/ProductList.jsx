// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { db, storage } from "../firebase";
// // import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
// // import { getDownloadURL, ref, deleteObject } from "firebase/storage";
// // import "./ProductList.css";

// // const ProductList = () => {
// //   const [products, setProducts] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedProducts, setSelectedProducts] = useState([]);
// //   const [selectAll, setSelectAll] = useState(false);
// //   const [category, setCategory] = useState(''); 
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       const productsCollectionRef = collection(db, "products");

// //       let q = productsCollectionRef;
// //       if (category) {
// //         q = query(productsCollectionRef, where("category", "==", category));
// //       }

// //       try {
// //         const querySnapshot = await getDocs(q);
// //         const fetchedProducts = await Promise.all(querySnapshot.docs.map(async (doc) => {
          
// //           return {
// //             id: doc.id,
// //             ...doc.data(),
// //             expanded: false,
// //           };
// //         }));
// //         setProducts(fetchedProducts);
// //       } catch (error) {
// //         console.error("Error fetching products: ", error);
// //       }
// //     };

// //     fetchProducts();
// //   }, [searchTerm, category]);

// //   const handleSearch = (event) => {
// //     setSearchTerm(event.target.value.toLowerCase());
// //   };

// //   const handleCategoryChange = (event) => {
// //     setCategory(event.target.value);
// //   };

// //   const toggleDescription = (productId) => {
// //     const updatedProducts = products.map((product) => {
// //       if (product.id === productId) {
// //         return {
// //           ...product,
// //           expanded: !product.expanded,
// //         };
// //       }
// //       return product;
// //     });
// //     setProducts(updatedProducts);
// //   };

// //   const handleBulkUploadClick = () => {
// //     navigate('/bulkupload');
// //   };

// //   const handleNewProductClick = () => {
// //     navigate('/add');
// //   };
// //   const filteredProducts = products.filter(product => 
// //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
// //     product.sno.toString().includes(searchTerm)
// // );

// //   const deleteProduct = async (productId, event) => {
// //     event.stopPropagation();

// //     try {
// //       await deleteDoc(doc(db, "products", productId));
     
// //       setProducts(products.filter((product) => product.id !== productId));
// //     } catch (error) {
// //       console.error("Error deleting product: ", error);
// //     }
// //   };

// //   const handleSelectProduct = (event, productId) => {
// //     const isChecked = event.target.checked;
// //     if (isChecked) {
// //       setSelectedProducts((prevSelected) => [...prevSelected, productId]);
// //     } else {
// //       setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
// //     }
// //   };

// //   const handleSelectAll = () => {
// //     if (selectAll) {
// //       setSelectedProducts([]);
// //     } else {
// //       setSelectedProducts(products.map((product) => product.id));
// //     }
// //     setSelectAll(!selectAll);
// //   };

// //   const bulkDeleteProducts = async () => {
// //     const promises = selectedProducts.map(async (productId) => {
// //       try {
// //         await deleteDoc(doc(db, "products", productId));
       
// //       } catch (error) {
// //         console.error("Error deleting product: ", error);
// //       }
// //     });

// //     await Promise.all(promises);
// //     setProducts((prevProducts) =>
// //       prevProducts.filter((product) => !selectedProducts.includes(product.id))
// //     );
// //     setSelectedProducts([]);
// //     setSelectAll(false);
// //   };

// //   return (
// //     <div className="product-list-container">
// //       <h2 className="product-list-title">Product List</h2>
// //       <input
// //         type="text"
// //         className="product-list-input"
// //         placeholder="Search products"
// //         value={searchTerm}
// //         onChange={handleSearch}
// //       />
// //       <select className="custom-select" value={category} onChange={handleCategoryChange}>
// //         <option value="">All Products</option>
// //         <option value="ONE & TWO SOUND CRACKERS">ONE & TWO SOUND CRACKERS</option>
// //         <option value="GROUND CHAKKAR">GROUND CHAKKAR</option>
// //         <option value="FLOWER POTS">FLOWER POTS</option>
// //         <option value="BOMB">BOMB</option>
// //         <option value="TWINKLING STAR">TWINKLING STAR</option>
// //         <option value="MAGIC PENCIL">MAGIC PENCIL</option>
// //         <option value="ROCKETS">ROCKETS</option>
// //         <option value="FOUNTAIN">FOUNTAIN</option>
// //         <option value="MATCH BOX">MATCH BOX</option>
// //         <option value="KIDS FANCY">KIDS FANCY</option>
// //         <option value="DELUXE CRACKERS">DELUXE CRACKERS</option>
// //         <option value="MULTI COLOUR SHOTS">MULTI COLOUR SHOTS</option>
// //         <option value="SPARKLES">SPARKLES</option>
// //         <option value="BIJILI CRACKERS">BIJILI CRACKERS</option>
// //         <option value="2 COMET">2" COMET</option>
// //         <option value="2 COMET - 3 PCS">2" COMET - 3 PCS</option>
// //         <option value="31/2 COMETS">31/2" COMETS</option>
// //         <option value="CHOTTA FANCY">CHOTTA FANCY</option>
// //         <option value="RIDER">RIDER</option>
// //         <option value="DIGITAL LAR (WALA)">DIGITAL LAR (WALA)</option>
// //         <option value="PEPPER BOMB">PEPPER BOMB</option>
// //         <option value="GIFT BOX VARIETIES">GIFT BOX VARIETIES</option>
// //       </select>
// //       <div className="button-row">
// //         <button className="select-all-button" onClick={handleSelectAll}>
// //           {selectAll ? "Deselect All" : "Select All"}
// //         </button>
// //         <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
// //           <i className="fas fa-trash-alt"></i> Bulk Delete
// //         </button>
// //         <button className="bulk-new-button" onClick={handleNewProductClick} style={{ position: "relative", left: "600px" }}>
// //           <i className="fa fa-plus-circle"></i> New
// //         </button>
// //         <button className="bulk-upload-button" onClick={handleBulkUploadClick} style={{ position: "relative", left: "610px" }}>
// //           <i className="fa fa-upload"></i> Bulk Upload
// //         </button>
// //       </div>
// //       <ul className="product-list">
// //         {filteredProducts.map((product) => (
// //           <li key={product.id} className="product-item">
// //             <input
// //               type="checkbox"
// //               className="product-checkbox"
// //               checked={selectedProducts.includes(product.id)}
// //               onChange={(event) => handleSelectProduct(event, product.id)}
// //             />
// //             <div className="product-info" onClick={() => toggleDescription(product.id)}>
// //               <div className="products-details">
// //                 <div className="product-name">{product.name}</div>
// //                 {product.expanded && (
// //                   <div className="product-description">{product.description}</div>
// //                 )}
// //                 <div className="product-price">Regular price: ₹{product.regularprice.toFixed(2)}</div>
// //                 <div className="product-price">Sales price: ₹{product.saleprice.toFixed(2)}</div>
// //               </div>
// //             </div>
// //             <div className="product-actions">
// //               <Link to={`/edit-product/${product.id}`}>
// //                 <button className="edit-button">
// //                   <i className="fas fa-edit"></i> Edit
// //                 </button>
// //               </Link>
// //               <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
// //                 <i className="fas fa-trash-alt"></i> Delete
// //               </button>
// //             </div>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default ProductList;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../firebase"; // Assuming you have this configured
// import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
// import jsPDF from "jspdf";
// import "./ProductList.css";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [category, setCategory] = useState(''); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, "products");

//       let q = productsCollectionRef;
//       if (category) {
//         q = query(productsCollectionRef, where("category", "==", category));
//       }

//       try {
//         const querySnapshot = await getDocs(q);
//         const fetchedProducts = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           expanded: false,
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error("Error fetching products: ", error);
//       }
//     };

//     fetchProducts();
//   }, [searchTerm, category]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value.toLowerCase());
//   };

//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//   };

//   const toggleDescription = (productId) => {
//     const updatedProducts = products.map((product) => {
//       if (product.id === productId) {
//         return {
//           ...product,
//           expanded: !product.expanded,
//         };
//       }
//       return product;
//     });
//     setProducts(updatedProducts);
//   };

//   const handleBulkUploadClick = () => {
//     navigate('/bulkupload');
//   };

//   const handleNewProductClick = () => {
//     navigate('/add');
//   };

//   const filteredProducts = products.filter(product => 
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     product.sno.toString().includes(searchTerm)
//   );

//   const deleteProduct = async (productId, event) => {
//     event.stopPropagation();

//     try {
//       await deleteDoc(doc(db, "products", productId));
//       setProducts(products.filter((product) => product.id !== productId));
//     } catch (error) {
//       console.error("Error deleting product: ", error);
//     }
//   };

//   const handleSelectProduct = (event, productId) => {
//     const isChecked = event.target.checked;
//     if (isChecked) {
//       setSelectedProducts((prevSelected) => [...prevSelected, productId]);
//     } else {
//       setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedProducts([]);
//     } else {
//       setSelectedProducts(products.map((product) => product.id));
//     }
//     setSelectAll(!selectAll);
//   };

//   const bulkDeleteProducts = async () => {
//     const promises = selectedProducts.map(async (productId) => {
//       try {
//         await deleteDoc(doc(db, "products", productId));
//       } catch (error) {
//         console.error("Error deleting product: ", error);
//       }
//     });

//     await Promise.all(promises);
//     setProducts((prevProducts) =>
//       prevProducts.filter((product) => !selectedProducts.includes(product.id))
//     );
//     setSelectedProducts([]);
//     setSelectAll(false);
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     let yPosition = 10;

//     doc.setFontSize(18);
//     doc.text("Product List", 14, yPosition);
//     yPosition += 10;

//     products.forEach((product, index) => {
//       doc.setFontSize(12);
//       yPosition += 6;
//       doc.text(`${index + 1}. ${product.sno}`, 14, yPosition);
//       yPosition += 6;
//       doc.text(`${index + 1}. ${product.name}`, 14, yPosition);
//       yPosition += 6;
//       doc.text(`Regular price: ₹${product.regularprice.toFixed(2)}`, 14, yPosition);
//       yPosition += 6;
//       doc.text(`Sales price: ₹${product.saleprice.toFixed(2)}`, 14, yPosition);
//       yPosition += 10;

//       if (yPosition >= 280) {
//         doc.addPage();
//         yPosition = 10;
//       }
//     });

//     doc.save("Product_List.pdf");
//   };

//   return (
//     <div className="product-list-container">
//       <h2 className="product-list-title">Product List</h2>
//       <input
//         type="text"
//         className="product-list-input"
//         placeholder="Search products"
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <select className="custom-select" value={category} onChange={handleCategoryChange}>
//         <option value="">All Products</option>
//         {/* Add other options here */}
//       </select>
//       <div className="button-row">
//         <button className="select-all-button" onClick={handleSelectAll}>
//           {selectAll ? "Deselect All" : "Select All"}
//         </button>
//         <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
//           <i className="fas fa-trash-alt"></i> Bulk Delete
//         </button>
//         <button className="bulk-new-button" onClick={handleNewProductClick} style={{ position: "relative", left: "600px" }}>
//           <i className="fa fa-plus-circle"></i> New
//         </button>
//         <button className="bulk-upload-button" onClick={handleBulkUploadClick} style={{ position: "relative", left: "610px" }}>
//           <i className="fa fa-upload"></i> Bulk Upload
//         </button>
//         <button className="download-button" onClick={downloadPDF} style={{ position: "relative", left: "620px" }}>
//           <i className="fa fa-download"></i> Download PDF
//         </button>
//       </div>
//       <ul className="product-list">
//         {filteredProducts.map((product) => (
//           <li key={product.id} className="product-item">
//             <input
//               type="checkbox"
//               className="product-checkbox"
//               checked={selectedProducts.includes(product.id)}
//               onChange={(event) => handleSelectProduct(event, product.id)}
//             />
//             <div className="product-info" onClick={() => toggleDescription(product.id)}>
//               <div className="products-details">
//                 <div className="product-name">{product.name}</div>
//                 {product.expanded && (
//                   <div className="product-description">{product.description}</div>
//                 )}
//                 <div className="product-price">Regular price: ₹{product.regularprice.toFixed(2)}</div>
//                 <div className="product-price">Sales price: ₹{product.saleprice.toFixed(2)}</div>
//               </div>
//             </div>
//             <div className="product-actions">
//               <Link to={`/edit-product/${product.id}`}>
//                 <button className="edit-button">
//                   <i className="fas fa-edit"></i> Edit
//                 </button>
//               </Link>
//               <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
//                 <i className="fas fa-trash-alt"></i> Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProductList;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../firebase"; // Assuming you have this configured
// import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from "firebase/firestore";
// import jsPDF from "jspdf";
// import "./ProductList.css";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [category, setCategory] = useState(''); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, "products");

//       let q = productsCollectionRef;
//       if (category) {
//         q = query(productsCollectionRef, where("category", "==", category), orderBy("sno"));
//       } else {
//         q = query(productsCollectionRef, orderBy("sno"));
//       }

//       try {
//         const querySnapshot = await getDocs(q);
//         const fetchedProducts = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           expanded: false,
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error("Error fetching products: ", error);
//       }
//     };

//     fetchProducts();
//   }, [searchTerm, category]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value.toLowerCase());
//   };

//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//   };

//   const toggleDescription = (productId) => {
//     const updatedProducts = products.map((product) => {
//       if (product.id === productId) {
//         return {
//           ...product,
//           expanded: !product.expanded,
//         };
//       }
//       return product;
//     });
//     setProducts(updatedProducts);
//   };

//   const handleBulkUploadClick = () => {
//     navigate('/bulkupload');
//   };

//   const handleNewProductClick = () => {
//     navigate('/add');
//   };

//   const filteredProducts = products.filter(product => 
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     product.sno.toString().includes(searchTerm)
//   );

//   const deleteProduct = async (productId, event) => {
//     event.stopPropagation();

//     try {
//       await deleteDoc(doc(db, "products", productId));
//       setProducts(products.filter((product) => product.id !== productId));
//     } catch (error) {
//       console.error("Error deleting product: ", error);
//     }
//   };

//   const handleSelectProduct = (event, productId) => {
//     const isChecked = event.target.checked;
//     if (isChecked) {
//       setSelectedProducts((prevSelected) => [...prevSelected, productId]);
//     } else {
//       setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedProducts([]);
//     } else {
//       setSelectedProducts(products.map((product) => product.id));
//     }
//     setSelectAll(!selectAll);
//   };

//   const bulkDeleteProducts = async () => {
//     const promises = selectedProducts.map(async (productId) => {
//       try {
//         await deleteDoc(doc(db, "products", productId));
//       } catch (error) {
//         console.error("Error deleting product: ", error);
//       }
//     });

//     await Promise.all(promises);
//     setProducts((prevProducts) =>
//       prevProducts.filter((product) => !selectedProducts.includes(product.id))
//     );
//     setSelectedProducts([]);
//     setSelectAll(false);
//   };

//   const padSno = (sno) => {
//     return sno.replace(/(\d+)/, (match) => match.padStart(3, '0'));
//   };

//   const downloadPDF = () => {
//     const sortedProducts = [...products].sort((a, b) => padSno(a.sno).localeCompare(padSno(b.sno)));
//     const doc = new jsPDF();
//     let yPosition = 10;

//     doc.setFontSize(18);
//     doc.text("Product List", 14, yPosition);
//     yPosition += 10;

//     sortedProducts.forEach((product, index) => {
//       doc.setFontSize(12);
//       yPosition += 6;
//       doc.text(`${index + 1}. ${product.sno}`, 14, yPosition);
//       yPosition += 6;
//       doc.text(`${index + 1}. ${product.name}`, 14, yPosition);
//       yPosition += 6;
//       doc.text(`Regular price: ₹${product.regularprice.toFixed(2)}`, 14, yPosition);
//       yPosition += 6;
//       doc.text(`Sales price: ₹${product.saleprice.toFixed(2)}`, 14, yPosition);
//       yPosition += 10;

//       if (yPosition >= 280) {
//         doc.addPage();
//         yPosition = 10;
//       }
//     });

//     doc.save("Product_List.pdf");
//   };

//   return (
//     <div className="product-list-container">
//       <h2 className="product-list-title">Product List</h2>
//       <input
//         type="text"
//         className="product-list-input"
//         placeholder="Search products"
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <select className="custom-select" value={category} onChange={handleCategoryChange}>
//         <option value="">All Products</option>
//         {/* Add other options here */}
//       </select>
//       <div className="button-row">
//         <button className="select-all-button" onClick={handleSelectAll}>
//           {selectAll ? "Deselect All" : "Select All"}
//         </button>
//         <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
//           <i className="fas fa-trash-alt"></i> Bulk Delete
//         </button>
//         <button className="bulk-new-button" onClick={handleNewProductClick} style={{ position: "relative", left: "600px" }}>
//           <i className="fa fa-plus-circle"></i> New
//         </button>
//         <button className="bulk-upload-button" onClick={handleBulkUploadClick} style={{ position: "relative", left: "610px" }}>
//           <i className="fa fa-upload"></i> Bulk Upload
//         </button>
//         <button className="download-button" onClick={downloadPDF} style={{ position: "relative", left: "620px" }}>
//           <i className="fa fa-download"></i> Download PDF
//         </button>
//       </div>
//       <ul className="product-list">
//         {filteredProducts.map((product) => (
//           <li key={product.id} className="product-item">
//             <input
//               type="checkbox"
//               className="product-checkbox"
//               checked={selectedProducts.includes(product.id)}
//               onChange={(event) => handleSelectProduct(event, product.id)}
//             />
//             <div className="product-info" onClick={() => toggleDescription(product.id)}>
//               <div className="products-details">
//                 <div className="product-name">{product.name}</div>
//                 {product.expanded && (
//                   <div className="product-description">{product.description}</div>
//                 )}
//                 <div className="product-price">Regular price: ₹{product.regularprice.toFixed(2)}</div>
//                 <div className="product-price">Sales price: ₹{product.saleprice.toFixed(2)}</div>
//               </div>
//             </div>
//             <div className="product-actions">
//               <Link to={`/edit-product/${product.id}`}>
//                 <button className="edit-button">
//                   <i className="fas fa-edit"></i> Edit
//                 </button>
//               </Link>
//               <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
//                 <i className="fas fa-trash-alt"></i> Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProductList;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { db } from "../firebase"; // Assuming you have this configured
// import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from "firebase/firestore";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "./ProductList.css";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [category, setCategory] = useState(''); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, "products");

//       let q = productsCollectionRef;
//       if (category) {
//         q = query(productsCollectionRef, where("category", "==", category), orderBy("sno"));
//       } else {
//         q = query(productsCollectionRef, orderBy("sno"));
//       }

//       try {
//         const querySnapshot = await getDocs(q);
//         const fetchedProducts = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           expanded: false,
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error("Error fetching products: ", error);
//       }
//     };

//     fetchProducts();
//   }, [searchTerm, category]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value.toLowerCase());
//   };

//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//   };

//   const toggleDescription = (productId) => {
//     const updatedProducts = products.map((product) => {
//       if (product.id === productId) {
//         return {
//           ...product,
//           expanded: !product.expanded,
//         };
//       }
//       return product;
//     });
//     setProducts(updatedProducts);
//   };

//   const handleBulkUploadClick = () => {
//     navigate('/bulkupload');
//   };

//   const handleNewProductClick = () => {
//     navigate('/add');
//   };

//   const filteredProducts = products.filter(product => 
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     product.sno.toString().includes(searchTerm)
//   );

//   const deleteProduct = async (productId, event) => {
//     event.stopPropagation();

//     try {
//       await deleteDoc(doc(db, "products", productId));
//       setProducts(products.filter((product) => product.id !== productId));
//     } catch (error) {
//       console.error("Error deleting product: ", error);
//     }
//   };

//   const handleSelectProduct = (event, productId) => {
//     const isChecked = event.target.checked;
//     if (isChecked) {
//       setSelectedProducts((prevSelected) => [...prevSelected, productId]);
//     } else {
//       setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedProducts([]);
//     } else {
//       setSelectedProducts(products.map((product) => product.id));
//     }
//     setSelectAll(!selectAll);
//   };

//   const bulkDeleteProducts = async () => {
//     const promises = selectedProducts.map(async (productId) => {
//       try {
//         await deleteDoc(doc(db, "products", productId));
//       } catch (error) {
//         console.error("Error deleting product: ", error);
//       }
//     });

//     await Promise.all(promises);
//     setProducts((prevProducts) =>
//       prevProducts.filter((product) => !selectedProducts.includes(product.id))
//     );
//     setSelectedProducts([]);
//     setSelectAll(false);
//   };

//   const padSno = (sno) => {
//     return sno.replace(/(\d+)/, (match) => match.padStart(3, '0'));
//   };

//   const downloadPDF = () => {
//     const sortedProducts = [...products].sort((a, b) => padSno(a.sno).localeCompare(padSno(b.sno)));
//     const doc = new jsPDF();
//     const tableColumn = ["S.No", "Name", "Regular Price", "Sales Price"];
//     const tableRows = [];

//     sortedProducts.forEach((product, index) => {
//       const productData = [
//         product.sno,
//         product.name,
//         `Rs.${product.regularprice.toFixed(2)}`,
//         `Rs.${product.saleprice.toFixed(2)}`
//       ];
//       tableRows.push(productData);
//     });

//     doc.autoTable(tableColumn, tableRows, { startY: 10 });
//     doc.save("Product_List.pdf");
//   };

//   return (
//     <div className="product-list-container">
//       <h2 className="product-list-title">Product List</h2>
//       <input
//         type="text"
//         className="product-list-input"
//         placeholder="Search products"
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <select className="custom-select" value={category} onChange={handleCategoryChange}>
//         <option value="">All Products</option>
//          <option value="">All Products</option>
//          <option value="ONE & TWO SOUND CRACKERS">ONE & TWO SOUND CRACKERS</option>
//          <option value="GROUND CHAKKAR">GROUND CHAKKAR</option>
//          <option value="FLOWER POTS">FLOWER POTS</option>
//          <option value="BOMB">BOMB</option>
//          <option value="TWINKLING STAR">TWINKLING STAR</option>
//          <option value="MAGIC PENCIL">MAGIC PENCIL</option>
//          <option value="ROCKETS">ROCKETS</option>
//          <option value="FOUNTAIN">FOUNTAIN</option>
//          <option value="MATCH BOX">MATCH BOX</option>
//          <option value="KIDS FANCY">KIDS FANCY</option>
//          <option value="DELUXE CRACKERS">DELUXE CRACKERS</option>
//          <option value="MULTI COLOUR SHOTS">MULTI COLOUR SHOTS</option>
//          <option value="SPARKLES">SPARKLES</option>
//          <option value="BIJILI CRACKERS">BIJILI CRACKERS</option>
//          <option value="2 COMET">2" COMET</option>
//          <option value="2 COMET - 3 PCS">2" COMET - 3 PCS</option>
//          <option value="31/2 COMETS">31/2" COMETS</option>
//          <option value="CHOTTA FANCY">CHOTTA FANCY</option>
//          <option value="RIDER">RIDER</option>
//          <option value="DIGITAL LAR (WALA)">DIGITAL LAR (WALA)</option>
//          <option value="PEPPER BOMB">PEPPER BOMB</option>
//          <option value="GIFT BOX VARIETIES">GIFT BOX VARIETIES</option>
    
//       </select>
//       <div className="button-row">
//         <button className="select-all-button" onClick={handleSelectAll}>
//           {selectAll ? "Deselect All" : "Select All"}
//         </button>
//         <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
//           <i className="fas fa-trash-alt"></i> Bulk Delete
//         </button>
//         <button className="bulk-new-button" onClick={handleNewProductClick} style={{ position: "relative", left: "600px" }}>
//           <i className="fa fa-plus-circle"></i> New
//         </button>
//         <button className="bulk-upload-button" onClick={handleBulkUploadClick} style={{ position: "relative", left: "610px" }}>
//           <i className="fa fa-upload"></i> Bulk Upload
//         </button>
//         <button className="download-button" onClick={downloadPDF} style={{ position: "relative", left: "620px" }}>
//           <i className="fa fa-download"></i> Download PDF
//         </button>
//       </div>
//       <ul className="product-list">
//         {filteredProducts.map((product) => (
//           <li key={product.id} className="product-item">
//             <input
//               type="checkbox"
//               className="product-checkbox"
//               checked={selectedProducts.includes(product.id)}
//               onChange={(event) => handleSelectProduct(event, product.id)}
//             />
//             <div className="product-info" onClick={() => toggleDescription(product.id)}>
//               <div className="products-details">
//                 <div className="product-name">{product.name}</div>
//                 {product.expanded && (
//                   <div className="product-description">{product.description}</div>
//                 )}
//                 <div className="product-price">Regular price: Rs.{product.regularprice.toFixed(2)}</div>
//                 <div className="product-price">Sales price: Rs.{product.saleprice.toFixed(2)}</div>
//               </div>
//             </div>
//             <div className="product-actions">
//               <Link to={`/edit-product/${product.id}`}>
//                 <button className="edit-button">
//                   <i className="fas fa-edit"></i> Edit
//                 </button>
//               </Link>
//               <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
//                 <i className="fas fa-trash-alt"></i> Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProductList;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Assuming you have this configured
import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [category, setCategory] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(db, "products");

      let q = productsCollectionRef;
      if (category) {
        q = query(productsCollectionRef, where("category", "==", category));
      } else {
        q = query(productsCollectionRef);
      }

      try {
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort products numerically and alphabetically
        fetchedProducts.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // Convert to uppercase to ensure case-insensitive comparison
          const nameB = b.name.toUpperCase();

          // Compare numerically and alphabetically
          const numberComparison = nameA.localeCompare(nameB, undefined, { numeric: true });
          return numberComparison;
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [category]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const toggleDescription = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          expanded: !product.expanded,
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleBulkUploadClick = () => {
    navigate('/bulkupload');
  };

  const handleNewProductClick = () => {
    navigate('/add');
  };

  // Filter products by search term and category
  const filteredProducts = products.filter(product => 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sno.toString().includes(searchTerm)) &&
    (category ? product.category === category : true)
  );

  const deleteProduct = async (productId, event) => {
    event.stopPropagation();

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const handleSelectProduct = (event, productId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  const bulkDeleteProducts = async () => {
    const promises = selectedProducts.map(async (productId) => {
      try {
        await deleteDoc(doc(db, "products", productId));
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    });

    await Promise.all(promises);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => !selectedProducts.includes(product.id))
    );
    setSelectedProducts([]);
    setSelectAll(false);
  };

  const padSno = (sno) => {
    return sno.replace(/(\d+)/, (match) => match.padStart(3, '0'));
  };

  const downloadPDF = () => {
    const sortedProducts = [...products].sort((a, b) => padSno(a.sno).localeCompare(padSno(b.sno)));
    const doc = new jsPDF();
    const tableColumn = ["S.No", "Name", "Regular Price", "Sales Price","Category"];
    const tableRows = [];

    sortedProducts.forEach((product, index) => {
      const productData = [
        product.sno,
        product.name,
        `Rs.${product.regularprice.toFixed(2)}`,
        `Rs.${product.saleprice.toFixed(2)}`,
        product.category
      ];
      tableRows.push(productData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 10 });
    doc.save("Product_List.pdf");
  };

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product List</h2>
      <input
        type="text"
        className="product-list-input"
        placeholder="Search products"
        value={searchTerm}
        onChange={handleSearch}
      />
         <select className="custom-select" value={category} onChange={handleCategoryChange}>
        <option value="">All Products</option>
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
      <div className="button-row">
        <button className="select-all-button" onClick={handleSelectAll}>
          {selectAll ? "Deselect All" : "Select All"}
        </button>
        <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
          <i className="fas fa-trash-alt"></i> Bulk Delete
        </button>
        <button className="bulk-new-button" onClick={handleNewProductClick} style={{ position: "relative", left: "500px" }}>
          <i className="fa fa-plus-circle"></i> New
        </button>
        <button className="bulk-upload-button" onClick={handleBulkUploadClick} style={{ position: "relative", left: "530px" }}>
          <i className="fa fa-upload"></i> Bulk Upload
        </button>
        <button className="download-button2" onClick={downloadPDF} style={{ position: "relative", left: "560px" }}>
          <i className="fa fa-download"></i> Download PDF
        </button>
      </div>
      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li key={product.id} className="product-item">
            <input
              type="checkbox"
              className="product-checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={(event) => handleSelectProduct(event, product.id)}
            />
            <div className="product-info" onClick={() => toggleDescription(product.id)}>
              <div className="products-details">
                <div className="product-name">{product.name}</div>
                {product.expanded && (
                  <div className="product-description">{product.description}</div>
                )}
                <div className="product-price">Regular price: Rs.{product.regularprice.toFixed(2)}</div>
                <div className="product-price">Sales price: Rs.{product.saleprice.toFixed(2)}</div>
              </div>
            </div>
            <div className="product-actions">
              <Link to={`/edit-product/${product.id}`}>
                <button className="edit-button">
                  <i className="fas fa-edit"></i> Edit
                </button>
              </Link>
              <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
