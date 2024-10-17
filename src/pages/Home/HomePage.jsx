import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../pages/firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SalesComparisonChart from '../Chart/SalesComparisonChart';
import Grid from '../Grid/Grid';
import './HomePage.css';  
import RevenueProgress from '../RevenueProgress/RevenueProgress';

const Homepage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null); // Track currently editing detail

  const fetchDetails = async () => {
    setLoading(true);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);
  
    const detailsQuery = query(
      collection(db, 'customerBilling'),
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp)
    );
  
    try {
      const querySnapshot = await getDocs(detailsQuery);
      const detailsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Deduplicate based on invoice number
      const uniqueDetails = {};
      detailsData.forEach(detail => {
        uniqueDetails[detail.invoiceNumber] = detail; // Will overwrite duplicates
      });
      setDetails(Object.values(uniqueDetails)); // Convert back to array
    } catch (error) {
      console.error('Error fetching details: ', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, [selectedDate]);

  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete document with ID: ${id}`);
      await deleteDoc(doc(db, 'customerBilling', id)); // Correct the collection path to 'customerBilling'
      setDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  
  
  const handleEdit = (detail) => {
    setEditingDetail(detail); // Set the detail currently being edited
  };

  const handleSave = async () => {
    try {
      const { id, customerName, totalAmount } = editingDetail;
      await updateDoc(doc(db, 'billing', id), {
        customerName,
        totalAmount
      });
      console.log('Document successfully updated!');
      setEditingDetail(null); // Clear editing state
      fetchDetails(); // Fetch details again after update
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Customer Name', 'Phone No', 'Email ID', 'Purchase Details', 'CGST', 'SGST', 'IGST','Grand Total'];
    const tableRows = [];

    details.forEach((detail) => {
      const detailData = [
        detail.customerName,
        detail.customerPhone || 'N/A',
        detail.customerEmail || 'N/A',
        
        `Rs.${detail.totalAmount ? detail.totalAmount.toFixed(0) : 'N/A'}`,
        `Rs.${detail.cgstAmount ? detail.cgstAmount.toFixed(0) : 'N/A'}`,
        `Rs.${detail.sgstAmount ? detail.sgstAmount.toFixed(0) : 'N/A'}`,
        `Rs.${detail.igstAmount ? detail.igstAmount.toFixed(0) : 'N/A'}`,
       `Rs.${detail.grandTotal ? detail.grandTotal.toFixed(0) : 'N/A'}`,
      ];
      tableRows.push(detailData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text('Details by Date', 14, 15);
    doc.save('details.pdf');
  };

  const handleCancelEdit = () => {
    setEditingDetail(null); // Clear editing state
  };

  const handleGeneratePDF = (detail) => {
    const doc = new jsPDF();
    const currentDate = new Date();   
    
       
    // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
    doc.setFontSize(8);
  // Add the rest of the text
  doc.text('A.G.P.POLITECNIC OFF SIDE 3/299D,', 44, 28);
  doc.text('Sivakasi prinding collage, mela, Amathur', 44, 35);
  doc.setFontSize(9);
  doc.text('Phone no.: +91 81100 85110', 44, 42);
    doc.text(`Invoice Number: ${detail.invoiceNumber}`, 150, 15);
    // doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 24);
    doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 23);
  
    doc.text(`Customer Name: ${detail.customerName}`, 150, 32);
    doc.text(`Customer State: ${detail.customerState}`, 150, 40);
  

    // Prepare table data
    const tableBody = detail.productsDetails.map(item => [
      item.name || 'N/A',
      item.quantity || 'N/A',
      `Rs.${item.saleprice ? item.saleprice.toFixed(2) : 'N/A'}`,
      `Rs.${item.quantity && item.saleprice ? (item.quantity * item.saleprice).toFixed(2) : 'N/A'}`
    ]);

    // Calculate Total Amount, Discounted Amount, and Grand Total
    const totalAmount = detail.totalAmount ? `Rs.${detail.totalAmount.toFixed(2)}` : 'N/A';
    const discountedAmount = detail.discountedTotal ? `Rs.${detail.discountedTotal.toFixed(2)}` : 'N/A';
    const grandTotal = detail.grandTotal ? `Rs.${detail.grandTotal.toFixed(2)}` : 'N/A';

    // Add table and totals to PDF
    doc.autoTable({
      head: [['Product Name', 'Quantity', 'Price', 'Total Amount']],
      body: tableBody,
      startY: 50,
      theme: 'grid', // Use 'grid' theme for borders
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      },
      headStyles: {
        fillColor: [204, 204, 204],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        halign: 'right',
        valign: 'middle'
      }
    });

    // Add Total Amount, Discounted Amount, and Grand Total to the table
    doc.autoTable({
      body: [
        ['Total Amount', totalAmount],
        ['Discounted Amount', discountedAmount],
        ['Grand Total', grandTotal]
      ],
      startY: doc.autoTable.previous.finalY + 10,
      theme: 'grid', // Use 'grid' theme for borders
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle',
        halign: 'center'
      },
      headStyles: {
        fillColor: [204, 204, 204],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        halign: 'right',
        valign: 'middle'
      }
    });

    // Save PDF
    doc.save(`invoice_${detail.invoiceNumber}.pdf`);
  };


  return (
    <div className="homepage-container">
      <Grid />
      <div className="grid-container">
        <div className="sales-comparison-chart">
          <SalesComparisonChart />
        </div>
        <div className="revenue-progress">
          <RevenueProgress />
        </div>
      </div>
      <div className="grid-container">
        <div className="sales-comparison-chart">
          
        </div>
        <div className="revenue-progress">
          
        </div>
      </div>
      <h2 className="dateTitle">Details By Date</h2>
      <div className="date-button-container">
      
      </div>
     
    </div>
  );
};  
export default Homepage;
