import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };

  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [facture, setFacture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProductList = cart.map(product => ({
      productId: product.id,
      quantity: 1, // You might want to add quantity selection in the cart
      price: product.PrixProduct
    }));

    const data = {
      clientName,
      address,
      billingDate,
      deliveryDate,
      products: selectedProductList
    };

    try {
      const response = await axios.post('http://localhost:5000/commandeClients', data);
      setFacture(response.data.facture);
      generatePDF(data, response.data.facture);
      
      Swal.fire({
        icon: 'success',
        title: 'Order Created Successfully',
        text: 'Your order has been placed and stock quantities have been updated.',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error Creating Order',
        text: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const generatePDF = (data, factureData) => {
    const pdf = new jsPDF();
    pdf.text('Invoice', 10, 10);
    pdf.text(`Invoice Number: ${factureData.numero}`, 10, 20);
    pdf.text(`Client Name: ${data.clientName}`, 10, 30);
    pdf.text(`Address: ${data.address}`, 10, 40);
    pdf.text(`Billing Date: ${data.billingDate}`, 10, 50);
    pdf.text(`Delivery Date: ${data.deliveryDate}`, 10, 60);

    const tableData = data.products.map((product, index) => [
      index + 1,
      product.productId,
      product.quantity,
      product.price,
      product.quantity * product.price
    ]);

    pdf.autoTable({
      startY: 70,
      head: [['#', 'Product ID', 'Quantity', 'Price', 'Total']],
      body: tableData
    });

    pdf.text(`Total: ${factureData.totalAmount}`, 10, pdf.autoTable.previous.finalY + 10);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between pt-5 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:w-2/3 mb-8 lg:mb-0 lg:mr-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  id="clientName"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="billingDate" className="block text-sm font-medium text-gray-700">Billing Date</label>
                <input
                  id="billingDate"
                  type="date"
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Delivery Date</label>
                <input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Order Summary:</h3>
              <ul className="space-y-2">
                {cart.map(product => (
                  <li key={product.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <span className="text-sm font-medium text-gray-800">{product.AR_Design}</span>
                    <span className="text-sm text-gray-600">${product.PrixProduct}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
            >
              Place Order
            </button>
          </form>
        </motion.div>
      </div>
      
      <div className="w-full lg:w-1/3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Invoice</h2>
          {pdfUrl ? (
            <div className="space-y-4">
              <iframe 
                src={pdfUrl} 
                className="w-full h-96 border rounded" 
                title="Generated Invoice PDF"
              ></iframe>
              <div className="flex space-x-2">
                <a
                  href={pdfUrl}
                  download="invoice.pdf"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  Download PDF
                </a>
                {facture && (
                  <button
                    onClick={() => {
                      console.log('Invoice saved:', facture);
                      Swal.fire({
                        icon: 'success',
                        title: 'Invoice saved!',
                        text: 'Your invoice has been saved successfully.',
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                  >
                    Save Invoice
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Invoice will be generated after placing the order
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;