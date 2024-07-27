      import React, { useState, useEffect } from 'react';
      import { db } from '../firebase'; // Import the initialized firebase instance
      import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
      import jsPDF from 'jspdf';
      import 'jspdf-autotable';
      import './BillingCalculator.css'; // Import the CSS file

      const BillingCalculator = () => {
        const [products, setProducts] = useState([]);
        const [filteredProducts, setFilteredProducts] = useState([]);
        const [cart, setCart] = useState([]);
        const [category, setCategory] = useState('');
        let invoiceNumber = ''; 
        const [billingDetails, setBillingDetails] = useState({
          totalAmount: 0,
          discountPercentage: '',
          discountedTotal: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          grandTotal: 0,
        });
        const [customerName, setCustomerName] = useState('');
        const [customerState, setCustomerState] = useState('');
        const [customerAddress, setCustomerAddress] = useState('');
        const [customerPhone, setCustomerPhone] = useState('');
        const [customerGSTIN, setCustomerGSTIN] = useState('');
        const [customerPAN, setCustomerPAN] = useState('');
        const [customerEmail, setCustomerEmail] = useState('');
        const [businessState, setBusinessState] = useState('YourBusinessState');
        const [searchTerm, setSearchTerm] = useState('');
        const [taxOption, setTaxOption] = useState('cgst_sgst');
        const [currentDate, setCurrentDate] = useState(new Date()); // State for current date
        const [showCustomerDetails, setShowCustomerDetails] = useState(false); // State for toggling customer details

        useEffect(() => {
          const fetchProducts = async () => {
            const productsCollectionRef = collection(db, 'products');
            try {
              const querySnapshot = await getDocs(productsCollectionRef);
              const fetchedProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setProducts(fetchedProducts);
            } catch (error) {
              console.error('Error fetching products: ', error);
            }
          };

          fetchProducts();
        }, []);
        useEffect(() => {
          const filterProducts = () => {
            let filtered = products;
      
            if (searchTerm) {
              filtered = filtered.filter(product => {
                const productName = product.name ? product.name.toLowerCase() : '';
                const productCode = product.sno ? product.sno.toLowerCase() : '';
                return productName.includes(searchTerm) || productCode.includes(searchTerm);
              });
            }
      
            if (category) {
              filtered = filtered.filter(product => product.category === category);
            }
      
            setFilteredProducts(filtered);
          };
      
          filterProducts();
        }, [searchTerm, category, products]);
        const handleCategoryChange = (event) => {
          setCategory(event.target.value);
        };
        const handleQuantityChange = (productId, quantity) => {
          const updatedCart = cart.map(item =>
            item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
          );
          setCart(updatedCart);
          updateBillingDetails(updatedCart);
        };

        const updateBillingDetails = (updatedCart) => {
          const totalAmount = updatedCart.reduce((total, item) => {
            return total + (item.saleprice * item.quantity);
          }, 0);

          const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
          const discountedTotal = totalAmount * (1 - discountPercentage / 100);

          let cgstAmount = 0;
          let sgstAmount = 0;
          let igstAmount = 0;

          if (taxOption === 'cgst_sgst') {
            if (customerState === businessState) {
              cgstAmount = discountedTotal * 0.09;
              sgstAmount = discountedTotal * 0.09;
            } else {
              cgstAmount = discountedTotal * 0.09;
              sgstAmount = discountedTotal * 0.09;
            }
          } else if (taxOption === 'igst') {
            igstAmount = discountedTotal * 0.18;
          }

          const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

          setBillingDetails(prevState => ({
            ...prevState,
            totalAmount,
            discountedTotal,
            cgstAmount,
            sgstAmount,
            igstAmount,
            grandTotal,
          }));
        };
        
        const handleDiscountChange = (event) => {
          const discountPercentage = event.target.value;
          setBillingDetails(prevState => ({
            ...prevState,
            discountPercentage,
          }));
        };
        const ClearAllData =() => {
          window.location.reload();
        };

        useEffect(() => {
          updateBillingDetails(cart);
        }, [billingDetails.discountPercentage, customerState, taxOption]);

        const generateRandomInvoiceNumber = () => {
          return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number
        };
        
        // Generate the invoice number once and store it
        invoiceNumber = generateRandomInvoiceNumber();
        
       
        function numberToWords(num) {
          const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
          const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
          const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
          const thousands = ['', 'Thousand', 'Million', 'Billion'];
      
          function convertToWords(n) {
              if (n === 0) return 'Zero';
      
              let words = '';
      
              function convertHundreds(num) {
                  let str = '';
                  if (num > 99) {
                      str += ones[Math.floor(num / 100)] + ' Hundred ';
                      num %= 100;
                  }
                  if (num > 19) {
                      str += tens[Math.floor(num / 10)] + ' ';
                      num %= 10;
                  }
                  if (num > 9) {
                      str += teens[num - 10] + ' ';
                  } else if (num > 0) {
                      str += ones[num] + ' ';
                  }
                  return str.trim();
              }
      
              let i = 0;
              while (n > 0) {
                  let rem = n % 1000;
                  if (rem !== 0) {
                      words = convertHundreds(rem) + ' ' + thousands[i] + ' ' + words;
                  }
                  n = Math.floor(n / 1000);
                  i++;
              }
              return words.trim();
          }
      
          const integerPart = Math.floor(num);
          const decimalPart = Math.round((num - integerPart) * 100);
      
          let words = convertToWords(integerPart);
          if (decimalPart > 0) {
              words += ' and ' + convertToWords(decimalPart) + ' Paise';
          }
          return words.trim();
      }
      
        

const TransportCopy = async () => {
  if (cart.length === 0) {
    alert('The cart is empty. Please add items to the cart before saving.');
    return; // Exit the function if the cart is empty
  }

  // Save billing details
  const billingDocRef = collection(db, 'billing');
  try {
    await addDoc(billingDocRef, {
      ...billingDetails,
      customerName,
      customerAddress,
      customerState,
      customerPhone,
      customerEmail,
      customerGSTIN,
      date: Timestamp.fromDate(currentDate),
      productsDetails: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        saleprice: item.saleprice,
        quantity: item.quantity
      })),
      createdAt: Timestamp.now(),
      invoiceNumber, // Use the same invoice number
    });
    console.log('Billing details saved successfully in Firestore');
  } catch (error) {
    console.error('Error saving billing details: ', error);
  }

  // Generate and save PDF invoice
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border

// doc.addImage(imgData, 'JPEG', 16, 18, 29, 29);
  doc.setFontSize(10);
  doc.setTextColor(255, 0, 0);  
  // Set font to bold and add the text
  doc.setFont('helvetica', 'bold');
  doc.text('A.M.SAKTHI PYROPARK', 44, 21);
  doc.setTextColor(0, 0, 0);
  // Reset font to normal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  // Add the rest of the text
  doc.text('A.G.P.POLITECNIC OFF SIDE 3/299D,', 44, 28);
  doc.text('Sivakasi prinding collage, mela, Amathur', 44, 35);
  doc.setFontSize(9);
  doc.text('Phone no.: +91 81100 85110', 44, 42);
doc.text('State: 33-Tamil Nadu', 44, 49);

  doc.setFontSize(10);
  doc.setTextColor(255, 0, 0);  
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE ', 138, 22);
  doc.text('TRANSPORT COPY', 138, 29);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Date: ${currentDate.toLocaleDateString()}`, 138, 36);
  doc.text(`Invoice Number: ${invoiceNumber}`, 138, 43); // Use the same invoice number
  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN: 33AEGFS0424L1Z4', 138, 49);
  doc.setFont('helvetica', 'normal');
  doc.rect(14, 15, 182, 40);
  doc.setFontSize(12);
          doc.setTextColor(170, 51, 106);  
          // Set font to bold and add the text
          doc.setFont('helvetica', 'bold');
          doc.text('BILLED TO', 19, 65);
          doc.setTextColor(0, 0, 0);
          // Reset font to normal
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          // Add the rest of the text
          // doc.text(`Name: ${customerName}`, 23, 81);
          // doc.text(`Address: ${customerAddress}`, 23, 90);
          // doc.text(`State: ${customerState}`, 23,97);
          // doc.text(`Phone: ${customerPhone}`, 23, 104);
          // doc.text(`Email: ${customerEmail}`, 23, 111);
          // Define the starting coordinates and line height
          const startX = 23;
          let startY = 71;
          const lineHeight = 8; // Adjust line height as needed
          
          // Define the labels and values
          const labels = [
            'Name',
            'Address',
            'State',
            'Phone',
            'GSTIN',
            'PAN'
          ];
          
          const values = [
            customerName,
            customerAddress,
            customerState,
            customerPhone,
            customerGSTIN,
            customerPAN
          ];
          
          // Calculate the maximum width of the labels without the colon
          const maxLabelWidth = Math.max(...labels.map(label => doc.getTextWidth(label)));
          
          // Define the colon offset and max line width
          const colonOffset = 2; // Adjust the space between label and colon
          const maxLineWidth = 160; // Maximum width for the values
          const maxTextWidth = 104; // Maximum allowed width for the text line
          
          // Add the text with proper alignment
          labels.forEach((label, index) => {
            const labelText = label;
            const colonText = ':';
            const valueText = values[index];
          
            // Calculate positions
            const colonX = startX + maxLabelWidth + colonOffset;
            const valueX = colonX + doc.getTextWidth(colonText) + colonOffset;
          
            // Split the value text if it exceeds the max text width
            const splitValueText = doc.splitTextToSize(valueText, maxTextWidth - valueX);
          
            // Draw the label and colon
            doc.text(labelText, startX, startY);
            doc.text(colonText, colonX, startY);
          
            // Draw the split value text
            splitValueText.forEach((line, lineIndex) => {
              doc.text(line, valueX, startY + (lineIndex * lineHeight));
            });
          
            // Move to the next line
            startY += lineHeight * splitValueText.length;
          });
          

        
      doc.setFontSize(12);
      doc.setTextColor(170, 51, 106);  
      // Set font to bold and add the text
      doc.setFont('helvetica', 'bold');
      doc.text('SHIPPED TO', 105, 65);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const initialX = 110;
      let initialY = 71;
      const lineSpacing = 8;  // Adjust line height as needed
      const spacingBetweenLabelAndValue = 3; // Space between colon and value
      const maxValueWidth = 65; // Maximum allowed width for the value text line

      // Define the labels and values
      const labelTexts = [
        'Name',
        'Address',
        'State',
        'Phone',
        'GSTIN',
        'PAN'
      ];

      const valuesTexts = [
        customerName,
        customerAddress,
        customerState,
        customerPhone,
        customerGSTIN,
        customerPAN,
      ];

      // Calculate the maximum width of the labels
      const maxLabelTextWidth = Math.max(...labelTexts.map(label => doc.getTextWidth(label)));

      // Calculate the width of the colon
      const colonWidth = doc.getTextWidth(':');

      // Calculate positions
      labelTexts.forEach((labelText, index) => {
        const valueText = valuesTexts[index];
        
        // Calculate the position for the colon
        const labelWidth = doc.getTextWidth(labelText);
        const colonX = initialX + maxLabelTextWidth + (colonWidth / 2);

        // Position the value
        const valueX = colonX + colonWidth + spacingBetweenLabelAndValue;

        // Split the value text if it exceeds the max text width
        const splitValueText = doc.splitTextToSize(valueText, maxValueWidth);

        // Draw the label and colon
        doc.text(labelText, initialX, initialY);
        doc.text(':', colonX, initialY); // Draw the colon

        // Draw the split value text
        splitValueText.forEach((line, lineIndex) => {
          doc.text(line, valueX, initialY + (lineIndex * lineSpacing));
        });

        // Move to the next line
        initialY += lineSpacing * splitValueText.length;
      });

          // Draw the rectangle
          doc.rect(14, 58, 182, 66);
        
          // Prepare Table Body
          const tableBody = cart
            .filter(item => item.quantity > 0)
            .map(item => [
              item.name,
              '36041000',
              item.quantity.toString(),
              `Rs. ${item.saleprice.toFixed(2)}`,
              `Rs. ${(item.saleprice * item.quantity).toFixed(2)}`
            ]);
        
          // Add Summary Rows
          tableBody.push(
            [
              { content: 'Total Amount:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ],
            [
              { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ],
            [
              { content: 'Discounted Total:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ]
          );
        
          if (taxOption === 'cgst_sgst') {
            tableBody.push(
              [
                { content: 'CGST (9%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ],
              [
                { content: 'SGST (9%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ]
            );
          } else if (taxOption === 'igst') {
            tableBody.push(
              [
                { content: 'IGST (18%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ]
            );
          }
        
          tableBody.push(
            [
              { content: 'Grand Total:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ]
          );
        
          // Add Table with Reduced Border Thickness
          doc.autoTable({
            head: [['Product Name','HSN Code', 'Quantity', 'Rate per price', 'Total']],
            body: tableBody,
            startY: 130,
            theme: 'grid',
            headStyles: { fillColor: [255, 182, 193], textColor: [0, 0, 139], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
            alternateRowStyles: { fillColor: [245, 245, 245] },
          });
          const totalAmount = cart.reduce((total, item) => total + item.quantity * item.saleprice, 0);

        // Display Grand Total
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        // doc.text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 10);
        const grandTotalInWords = numberToWords(billingDetails.grandTotal); 
          const backgroundColor = [255, 182, 193]; // RGB for light pink

          // Define text color
          const textColor = [0, 0, 139]; // RGB for dark blue
          
          // Define position
          const x = 17;
          const y = doc.autoTable.previous.finalY + 20;
          
          // Define padding and extra width for the background
          const padding = 5;
          const extraWidth = 90; // Increase this value to add more width to the right side of the background
          
          // Get text dimensions
          const text = `Rupees: ${grandTotalInWords} Rupees only`;
          const textDimensions = doc.getTextDimensions(text);
          const textWidth = textDimensions.w;
          const textHeight = textDimensions.h;
          
          // Draw background rectangle with increased width on the right side
          doc.setFillColor(...backgroundColor);
          doc.rect(x - padding, y - textHeight - padding, textWidth + padding * 2 + extraWidth, textHeight + padding * 2, 'F');
          
          // Set text color
          doc.setTextColor(...textColor);
          
          // Add text on top of the background
          doc.text(text, x, y);

  doc.save(`invoice_${invoiceNumber}_transport.pdf`);
};
const SalesCopy = async () => {
  if (cart.length === 0) {
    alert('The cart is empty. Please add items to the cart before saving.');
    return; // Exit the function if the cart is empty
  }

  // Save billing details
  const billingDocRef = collection(db, 'billing');
  try {
    await addDoc(billingDocRef, {
      ...billingDetails,
      customerName,
      customerAddress,
      customerState,
      customerPhone,
      customerEmail,
      customerGSTIN,
      date: Timestamp.fromDate(currentDate),
      productsDetails: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        saleprice: item.saleprice,
        quantity: item.quantity
      })),
      createdAt: Timestamp.now(),
      invoiceNumber, // Use the same invoice number
    });
    console.log('Billing details saved successfully in Firestore');
  } catch (error) {
    console.error('Error saving billing details: ', error);
  }

  // Generate and save PDF invoice
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border
              
    //  doc.addImage(imgData, 'JPEG', 16, 18, 29, 29);
     doc.setFontSize(10);
     doc.setTextColor(255, 0, 0);  
     // Set font to bold and add the text
     doc.setFont('helvetica', 'bold');
     doc.text('A.M.SAKTHI PYROPARK', 44, 21);
     doc.setTextColor(0, 0, 0);
     // Reset font to normal
     doc.setFont('helvetica', 'normal');
     doc.setFontSize(8);
     // Add the rest of the text
     doc.text('A.G.P.POLITECNIC OFF SIDE 3/299D,', 44, 28);
     doc.text('Sivakasi prinding collage, mela, Amathur', 44, 35);
     doc.setFontSize(9);
     doc.text('Phone no.: +91 81100 85110', 44, 42);
   doc.text('State: 33-Tamil Nadu', 44, 49);
          // Set font size
          doc.setFontSize(10);
          doc.setTextColor(255, 0, 0);  
          // Set font to bold and add the text
          doc.setFont('helvetica', 'bold');
          doc.text('A.M.SAKTHI PYROPARK', 44, 21);
          doc.setTextColor(0, 0, 0);

  doc.setFontSize(10);
  doc.setTextColor(255, 0, 0);  
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE ', 138, 22);
  doc.text('SALES COPY', 138, 29);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Date: ${currentDate.toLocaleDateString()}`, 138, 36);
  doc.text(`Invoice Number: ${invoiceNumber}`, 138, 43); // Use the same invoice number
  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN: 33AEGFS0424L1Z4', 138, 49);
  doc.setFont('helvetica', 'normal');
  doc.rect(14, 15, 182, 40);
  doc.setFontSize(12);
          doc.setTextColor(170, 51, 106);  
          // Set font to bold and add the text
          doc.setFont('helvetica', 'bold');
          doc.text('BILLED TO', 19, 65);
          doc.setTextColor(0, 0, 0);
          // Reset font to normal
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          // Add the rest of the text
          // doc.text(`Name: ${customerName}`, 23, 81);
          // doc.text(`Address: ${customerAddress}`, 23, 90);
          // doc.text(`State: ${customerState}`, 23,97);
          // doc.text(`Phone: ${customerPhone}`, 23, 104);
          // doc.text(`Email: ${customerEmail}`, 23, 111);
          // Define the starting coordinates and line height
          const startX = 23;
          let startY = 71;
          const lineHeight = 8; // Adjust line height as needed
          
          // Define the labels and values
          const labels = [
            'Name',
            'Address',
            'State',
            'Phone',
            'GSTIN',
            'PAN'
          ];
          
          const values = [
            customerName,
            customerAddress,
            customerState,
            customerPhone,
            customerGSTIN,
            customerPAN
          ];
          
          // Calculate the maximum width of the labels without the colon
          const maxLabelWidth = Math.max(...labels.map(label => doc.getTextWidth(label)));
          
          // Define the colon offset and max line width
          const colonOffset = 2; // Adjust the space between label and colon
          const maxLineWidth = 160; // Maximum width for the values
          const maxTextWidth = 104; // Maximum allowed width for the text line
          
          // Add the text with proper alignment
          labels.forEach((label, index) => {
            const labelText = label;
            const colonText = ':';
            const valueText = values[index];
          
            // Calculate positions
            const colonX = startX + maxLabelWidth + colonOffset;
            const valueX = colonX + doc.getTextWidth(colonText) + colonOffset;
          
            // Split the value text if it exceeds the max text width
            const splitValueText = doc.splitTextToSize(valueText, maxTextWidth - valueX);
          
            // Draw the label and colon
            doc.text(labelText, startX, startY);
            doc.text(colonText, colonX, startY);
          
            // Draw the split value text
            splitValueText.forEach((line, lineIndex) => {
              doc.text(line, valueX, startY + (lineIndex * lineHeight));
            });
          
            // Move to the next line
            startY += lineHeight * splitValueText.length;
          });
          

        
      doc.setFontSize(12);
      doc.setTextColor(170, 51, 106);  
      // Set font to bold and add the text
      doc.setFont('helvetica', 'bold');
      doc.text('SHIPPED TO', 105, 65);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9.5);
      const initialX = 110;
      let initialY = 71;
      const lineSpacing = 8;  // Adjust line height as needed
      const spacingBetweenLabelAndValue = 3; // Space between colon and value
      const maxValueWidth = 65; // Maximum allowed width for the value text line

      // Define the labels and values
      const labelTexts = [
        'Name',
        'Address',
        'State',
        'Phone',
        'GSTIN',
        'PAN'
      ];

      const valuesTexts = [
        customerName,
        customerAddress,
        customerState,
        customerPhone,
        customerGSTIN,
        customerPAN,
      ];

      // Calculate the maximum width of the labels
      const maxLabelTextWidth = Math.max(...labelTexts.map(label => doc.getTextWidth(label)));

      // Calculate the width of the colon
      const colonWidth = doc.getTextWidth(':');

      // Calculate positions
      labelTexts.forEach((labelText, index) => {
        const valueText = valuesTexts[index];
        
        // Calculate the position for the colon
        const labelWidth = doc.getTextWidth(labelText);
        const colonX = initialX + maxLabelTextWidth + (colonWidth / 2);

        // Position the value
        const valueX = colonX + colonWidth + spacingBetweenLabelAndValue;

        // Split the value text if it exceeds the max text width
        const splitValueText = doc.splitTextToSize(valueText, maxValueWidth);

        // Draw the label and colon
        doc.text(labelText, initialX, initialY);
        doc.text(':', colonX, initialY); // Draw the colon

        // Draw the split value text
        splitValueText.forEach((line, lineIndex) => {
          doc.text(line, valueX, initialY + (lineIndex * lineSpacing));
        });

        // Move to the next line
        initialY += lineSpacing * splitValueText.length;
      });

          // Draw the rectangle
          doc.rect(14, 58, 182, 66);
        
          // Prepare Table Body
          const tableBody = cart
            .filter(item => item.quantity > 0)
            .map(item => [
              item.name,
              '36041000',
              item.quantity.toString(),
              `Rs. ${item.saleprice.toFixed(2)}`,
              `Rs. ${(item.saleprice * item.quantity).toFixed(2)}`
            ]);
        
          // Add Summary Rows
          tableBody.push(
            [
              { content: 'Total Amount:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ],
            [
              { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ],
            [
              { content: 'Discounted Total:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ]
          );
        
          if (taxOption === 'cgst_sgst') {
            tableBody.push(
              [
                { content: 'CGST (9%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ],
              [
                { content: 'SGST (9%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ]
            );
          } else if (taxOption === 'igst') {
            tableBody.push(
              [
                { content: 'IGST (18%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ]
            );
          }
        
          tableBody.push(
            [
              { content: 'Grand Total:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ]
          );
        
          // Add Table with Reduced Border Thickness
          doc.autoTable({
            head: [['Product Name','HSN Code', 'Quantity', 'Rate per price', 'Total']],
            body: tableBody,
            startY: 130,
            theme: 'grid',
            headStyles: { fillColor: [255, 182, 193], textColor: [0, 0, 139], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
            alternateRowStyles: { fillColor: [245, 245, 245] },
          });
          const totalAmount = cart.reduce((total, item) => total + item.quantity * item.saleprice, 0);

        // Display Grand Total
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        // doc.text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 10);
          const totalInWords = numberToWords(totalAmount);
          
      
const backgroundColor = [255, 182, 193]; // RGB for light pink

// Define text color
const textColor = [0, 0, 139]; // RGB for dark blue

// Define position
const x = 17;
const y = doc.autoTable.previous.finalY + 20;

// Define padding and extra width for the background
const padding = 5;
const extraWidth = 80; // Increase this value to add more width to the right side of the background

// Get text dimensions
const text = `Rupees: ${totalInWords} Rupees only`;
const textDimensions = doc.getTextDimensions(text);
const textWidth = textDimensions.w;
const textHeight = textDimensions.h;

// Draw background rectangle with increased width on the right side
doc.setFillColor(...backgroundColor);
doc.rect(x - padding, y - textHeight - padding, textWidth + padding * 2 + extraWidth, textHeight + padding * 2, 'F');

// Set text color
doc.setTextColor(...textColor);

// Add text on top of the background
doc.text(text, x, y);

  doc.save(`invoice_${invoiceNumber}_sales.pdf`);
};
const OfficeCopy = async () => {
  if (cart.length === 0) {
    alert('The cart is empty. Please add items to the cart before saving.');
    return; // Exit the function if the cart is empty
  }

  // Save billing details
  const billingDocRef = collection(db, 'billing');
  try {
    await addDoc(billingDocRef, {
      ...billingDetails,
      customerName,
      customerAddress,
      customerState,
      customerPhone,
      customerEmail,
      customerGSTIN,
      date: Timestamp.fromDate(currentDate),
      productsDetails: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        saleprice: item.saleprice,
        quantity: item.quantity
      })),
      createdAt: Timestamp.now(),
      invoiceNumber, // Use the same invoice number
    });
    console.log('Billing details saved successfully in Firestore');
  } catch (error) {
    console.error('Error saving billing details: ', error);
  }

  // Generate and save PDF invoice
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border
              
    //  doc.addImage(imgData, 'JPEG', 16, 18, 29, 29);
     doc.setFontSize(10);
     doc.setTextColor(255, 0, 0);  
     // Set font to bold and add the text
     doc.setFont('helvetica', 'bold');
     doc.text('A.M.SAKTHI PYROPARK', 44, 21);
     doc.setTextColor(0, 0, 0);
     // Reset font to normal
     doc.setFont('helvetica', 'normal');
     doc.setFontSize(8);
     // Add the rest of the text
     doc.text('A.G.P.POLITECNIC OFF SIDE 3/299D,', 44, 28);
     doc.text('Sivakasi prinding collage, mela, Amathur', 44, 35);
     doc.setFontSize(9);
     doc.text('Phone no.: +91 81100 85110', 44, 42);
   doc.text('State: 33-Tamil Nadu', 44, 49);
          // Set font size
          doc.setFontSize(10);
          doc.setTextColor(255, 0, 0);  
          // Set font to bold and add the text
          doc.setFont('helvetica', 'bold');
          doc.text('A.M.SAKTHI PYROPARK', 44, 21);
          doc.setTextColor(0, 0, 0);

  doc.setFontSize(10);
  doc.setTextColor(255, 0, 0);  
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE ', 138, 22);
  doc.text('OFFICE COPY', 138, 29);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Date: ${currentDate.toLocaleDateString()}`, 138, 36);
  doc.text(`Invoice Number: ${invoiceNumber}`, 138, 43); // Use the same invoice number
  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN: 33AEGFS0424L1Z4', 138, 49);
  doc.setFont('helvetica', 'normal');
  doc.rect(14, 15, 182, 40);
  doc.setFontSize(12);
          doc.setTextColor(170, 51, 106);  
          // Set font to bold and add the text
          doc.setFont('helvetica', 'bold');
          doc.text('BILLED TO', 19, 65);
          doc.setTextColor(0, 0, 0);
          // Reset font to normal
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          // Add the rest of the text
          // doc.text(`Name: ${customerName}`, 23, 81);
          // doc.text(`Address: ${customerAddress}`, 23, 90);
          // doc.text(`State: ${customerState}`, 23,97);
          // doc.text(`Phone: ${customerPhone}`, 23, 104);
          // doc.text(`Email: ${customerEmail}`, 23, 111);
          // Define the starting coordinates and line height
          const startX = 23;
          let startY = 71;
          const lineHeight = 8; // Adjust line height as needed
          
          // Define the labels and values
          const labels = [
            'Name',
            'Address',
            'State',
            'Phone',
            'GSTIN',
            'PAN'
          ];
          
          const values = [
            customerName,
            customerAddress,
            customerState,
            customerPhone,
            customerGSTIN,
            customerPAN
          ];
          
          // Calculate the maximum width of the labels without the colon
          const maxLabelWidth = Math.max(...labels.map(label => doc.getTextWidth(label)));
          
          // Define the colon offset and max line width
          const colonOffset = 2; // Adjust the space between label and colon
          const maxLineWidth = 160; // Maximum width for the values
          const maxTextWidth = 104; // Maximum allowed width for the text line
          
          // Add the text with proper alignment
          labels.forEach((label, index) => {
            const labelText = label;
            const colonText = ':';
            const valueText = values[index];
          
            // Calculate positions
            const colonX = startX + maxLabelWidth + colonOffset;
            const valueX = colonX + doc.getTextWidth(colonText) + colonOffset;
          
            // Split the value text if it exceeds the max text width
            const splitValueText = doc.splitTextToSize(valueText, maxTextWidth - valueX);
          
            // Draw the label and colon
            doc.text(labelText, startX, startY);
            doc.text(colonText, colonX, startY);
          
            // Draw the split value text
            splitValueText.forEach((line, lineIndex) => {
              doc.text(line, valueX, startY + (lineIndex * lineHeight));
            });
          
            // Move to the next line
            startY += lineHeight * splitValueText.length;
          });
          

        
      doc.setFontSize(12);
      doc.setTextColor(170, 51, 106);  
      // Set font to bold and add the text
      doc.setFont('helvetica', 'bold');
      doc.text('SHIPPED TO', 105, 65);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9.5);
      const initialX = 110;
      let initialY = 71;
      const lineSpacing = 8;  // Adjust line height as needed
      const spacingBetweenLabelAndValue = 3; // Space between colon and value
      const maxValueWidth = 65; // Maximum allowed width for the value text line

      // Define the labels and values
      const labelTexts = [
        'Name',
        'Address',
        'State',
        'Phone',
        'GSTIN',
        'PAN'
      ];

      const valuesTexts = [
        customerName,
        customerAddress,
        customerState,
        customerPhone,
        customerGSTIN,
        customerPAN,
      ];

      // Calculate the maximum width of the labels
      const maxLabelTextWidth = Math.max(...labelTexts.map(label => doc.getTextWidth(label)));

      // Calculate the width of the colon
      const colonWidth = doc.getTextWidth(':');

      // Calculate positions
      labelTexts.forEach((labelText, index) => {
        const valueText = valuesTexts[index];
        
        // Calculate the position for the colon
        const labelWidth = doc.getTextWidth(labelText);
        const colonX = initialX + maxLabelTextWidth + (colonWidth / 2);

        // Position the value
        const valueX = colonX + colonWidth + spacingBetweenLabelAndValue;

        // Split the value text if it exceeds the max text width
        const splitValueText = doc.splitTextToSize(valueText, maxValueWidth);

        // Draw the label and colon
        doc.text(labelText, initialX, initialY);
        doc.text(':', colonX, initialY); // Draw the colon

        // Draw the split value text
        splitValueText.forEach((line, lineIndex) => {
          doc.text(line, valueX, initialY + (lineIndex * lineSpacing));
        });

        // Move to the next line
        initialY += lineSpacing * splitValueText.length;
      });

          // Draw the rectangle
          doc.rect(14, 58, 182, 66);
        
          // Prepare Table Body
          const tableBody = cart
            .filter(item => item.quantity > 0)
            .map(item => [
              item.name,
              '36041000',
              item.quantity.toString(),
              `Rs. ${item.saleprice.toFixed(2)}`,
              `Rs. ${(item.saleprice * item.quantity).toFixed(2)}`
            ]);
        
          // Add Summary Rows
          tableBody.push(
            [
              { content: 'Total Amount:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ],
            [
              { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ],
            [
              { content: 'Discounted Total:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ]
          );
        
          if (taxOption === 'cgst_sgst') {
            tableBody.push(
              [
                { content: 'CGST (9%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ],
              [
                { content: 'SGST (9%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ]
            );
          } else if (taxOption === 'igst') {
            tableBody.push(
              [
                { content: 'IGST (18%):', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
                { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
              ]
            );
          }
        
          tableBody.push(
            [
              { content: 'Grand Total:', colSpan: 4, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
              { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
            ]
          );
        
          // Add Table with Reduced Border Thickness
          doc.autoTable({
            head: [['Product Name','HSN Code', 'Quantity', 'Rate per price', 'Total']],
            body: tableBody,
            startY: 130,
            theme: 'grid',
            headStyles: { fillColor: [255, 182, 193], textColor: [0, 0, 139], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
            alternateRowStyles: { fillColor: [245, 245, 245] },
          });
          const totalAmount = cart.reduce((total, item) => total + item.quantity * item.saleprice, 0);

        // Display Grand Total
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        // doc.text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 10);
          const totalInWords = numberToWords(totalAmount);
          
      
const backgroundColor = [255, 182, 193]; // RGB for light pink

// Define text color
const textColor = [0, 0, 139]; // RGB for dark blue

// Define position
const x = 17;
const y = doc.autoTable.previous.finalY + 20;

// Define padding and extra width for the background
const padding = 5;
const extraWidth = 80; // Increase this value to add more width to the right side of the background

// Get text dimensions
const text = `Rupees: ${totalInWords} Rupees only`;
const textDimensions = doc.getTextDimensions(text);
const textWidth = textDimensions.w;
const textHeight = textDimensions.h;

// Draw background rectangle with increased width on the right side
doc.setFillColor(...backgroundColor);
doc.rect(x - padding, y - textHeight - padding, textWidth + padding * 2 + extraWidth, textHeight + padding * 2, 'F');

// Set text color
doc.setTextColor(...textColor);

// Add text on top of the background
doc.text(text, x, y);

  doc.save(`invoice_${invoiceNumber}_office.pdf`);
};


const handleSearch = (event) => {
  const term = event.target.value.toLowerCase();
  setSearchTerm(term);

  setFilteredProducts(
    products.filter(product => {
      // Convert product name to lowercase for comparison
      const productName = product.name ? product.name.toLowerCase() : '';
      
      // Ensure sno is a string and convert to lowercase for comparison
      const productCode = product.sno !== undefined && product.sno !== null
        ? product.sno.toString().toLowerCase()
        : '';

      // Check if either the name or sno includes the search term
      return productName.includes(term) || productCode.includes(term);
    })
  );
};



        const addToCart = (product) => {
          const existingItem = cart.find(item => item.productId === product.id);
          if (existingItem) {
            const updatedCart = cart.map(item =>
              item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
            updateBillingDetails(updatedCart);
          } else {
            const newItem = {
              productId: product.id,
              name: product.name,
              saleprice: product.saleprice,
              quantity: 1,
            };
            const updatedCart = [...cart, newItem];
            setCart(updatedCart);
            updateBillingDetails(updatedCart);
          }
        };

        const handleRemoveFromCart = (productId) => {
          const updatedCart = cart.filter(item => item.productId !== productId);
          setCart(updatedCart);
          updateBillingDetails(updatedCart);
        };

        const handleDateChange = (event) => {
          const selectedDate = new Date(event.target.value);
          setCurrentDate(selectedDate);
        };

        return (
          <div className="billing-calculator">
            <div className="product-list">
              <input
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
                 <select  className="custom-select1" onChange={handleCategoryChange} value={category}>
                 <option value="">All Category</option>
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
              <option value="MULTI COOUR SHOTS">MULTI COOUR SHOTS</option>
              <option value="SPARKLES">SPARKLES</option>
              <option value="BIJILI CRACKERS">BIJILI CRACKERS</option>
              <option value="2&quot; COMET">2" COMET</option>
              <option value="2&quot; COMET - 3 PCS">2" COMET - 3 PCS</option>
              <option value="4&quot; COMET - 2 PCS">4" COMET - 2 PCS</option>
              <option value="31/2&quot; COMET">31/2" COMETS</option>
              <option value="CHOTTA FANCY">CHOTTA FANCY</option>
              <option value="RIDER">RIDER</option>
              <option value="DIGITAL LAR (WALA)">DIGITAL LAR (WALA)</option>
              <option value="PEPPER BOMB">PEPPER BOMB</option>
              <option value="GIFT BOX VARIETIES">GIFT BOX VARIETIES</option>
      </select>
              <ul>
                {filteredProducts.map(product => (
                  <li key={product.id}>
                    <div className="product-details">
                      <span>{product.name}</span>
                      
                      <span> {`(Sales Rs. ${product.saleprice ? product.saleprice.toFixed(2) : '0.00'})`}</span>
                    </div>
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cart">
              <h2>Cart</h2>
              <button className="remove-button" style={{display:"flex",position:"relative",left:"540px",bottom:"34px"}} onClick={() => ClearAllData()}>Clear cart</button>
              <ul>
                {cart.map(item => (
                  <li key={item.productId}>
                    <div className="cart-item">
                      <span>{item.name}</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                      />
                      <span>Rs. {item.saleprice ? (item.saleprice * item.quantity).toFixed(2) : '0.00'}</span>
                      <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="billing-summary">
                <div className="billing-details">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={billingDetails.discountPercentage}
                    onChange={handleDiscountChange}
                    min="0"
                    max="100"
                  />
                  <label>Date</label>
                  <input
                    type="date"
                    className="custom-datepicker"
                    value={currentDate.toISOString().substr(0, 10)} // Display date in ISO format for input field
                    onChange={handleDateChange}
                  />
                  <br />
                  <br />
                  <label>Tax Option</label>
                <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
                  <option value="cgst_sgst">CGST + SGST</option>
                  <option value="igst">IGST</option>            
                  <option value="no_tax">No Tax</option>
                </select>
                </div>
                <div className="billing-amounts">
                <table>
                  <tbody>
                    <tr>
                      <td>Total Amount:</td>
                      <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Discounted Total:</td>
                      <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
                    </tr>
                    {taxOption === 'cgst_sgst' && (
                      <>
                        <tr>
                          <td>CGST (9%):</td>
                          <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>SGST (9%):</td>
                          <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
                        </tr>
                      </>
                    )}
                    {taxOption === 'igst' && (
                      <tr>
                        <td>IGST (18%):</td>
                        <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="grand-total-row">
                      <td>Grand Total:</td>
                      <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
              <div className="customer-details-toggle">
                <button onClick={() => setShowCustomerDetails(!showCustomerDetails)}>
                  {showCustomerDetails ? 'Hide Customer Details' : 'Show Customer Details'}
                </button>
              </div>
              {showCustomerDetails && (
                <div className="customer-details">
                  <div>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Customer Address</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Customer State</label>
                    <input
                      type="text"
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Customer Phone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Customer GSTIN</label>
                    <input
                      type="text"
                      value={customerGSTIN}
                      onChange={(e) => setCustomerGSTIN(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Customer PAN</label>
                    <input
                      type="text"
                      value={customerPAN}
                      onChange={(e) => setCustomerPAN(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Customer Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <button onClick={TransportCopy}>Transport Copy</button><br></br>
              <button onClick={SalesCopy}>Sales Copy</button><br></br>
              <button onClick={OfficeCopy}>Office Copy</button>
            </div>
          </div>
        );
      };

      export default BillingCalculator;
