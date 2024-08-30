import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { FaSearch, FaShoppingCart, FaTrash } from 'react-icons/fa';

import { motion, AnimatePresence } from 'framer-motion';

const CommandeForm = () => {
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [facture, setFacture] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/products/getProduct')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleProductChange = (productId, quantity, price) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity
    }));
    setPrices(prevPrices => ({
      ...prevPrices,
      [productId]: price
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProductList = selectedProducts.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      price: product.PrixProduct
    }));

    console.log('Selected products:', selectedProductList);

    const data = {
      clientName,
      address,
      billingDate,
      deliveryDate,
      products: selectedProductList
    };

    console.log('Data being sent to server:', data);

    try {
      const response = await axios.post('http://localhost:5000/commandeClients', data);
      console.log('Commande created:', response.data);
      setFacture(response.data.facture);
      generatePDF(data, response.data.facture);
      
      Swal.fire({
        icon: 'success',
        title: 'Commande Created Successfully',
        text: 'The commande has been created and stock quantities have been updated.',
      });
    } catch (error) {
      console.error('Error creating commande:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error Creating Commande',
        text: errorMessage,
      });
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const selectedProductList = Object.keys(selectedProducts)
  //     .filter(productId => selectedProducts[productId])
  //     .map(productId => ({
  //       productId,
  //       quantity: quantities[productId] || 1,
  //       price: prices[productId] || 0
  //     }));

  //   const data = {
  //     clientName,
  //     address,
  //     billingDate,
  //     deliveryDate,
  //     products: selectedProductList
  //   };

  //   try {
  //     const response = await axios.post('http://localhost:5000/commandeClients', data);
  //     console.log('Commande created:', response.data);
  //     setFacture(response.data.facture);
  //     generatePDF(data, response.data.facture);
      
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Commande Created Successfully',
  //       text: 'The commande has been created and stock quantities have been updated.',
  //     });


  //   } catch (error) {
  //     console.error('Error creating commande:', error);
      
  //     let errorMessage = 'An unexpected error occurred. Please try again.';
  //     if (error.response && error.response.data && error.response.data.message) {
  //       errorMessage = error.response.data.message;
  //     }

  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error Creating Commande',
  //       text: errorMessage,
  //     });
  //   }
  // };

  const generatePDF = (data, factureData) => {
    const pdf = new jsPDF();
    pdf.text('Facture', 10, 10);
    pdf.text(`Facture Number: ${factureData.numero}`, 10, 20);
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
    savePDFToServer(pdfBlob);
  };

  const savePDFToServer = async (pdfBlob) => {
    if (!facture) {
      console.error('No facture data available');
      return;
    }
  
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, 'facture.pdf');
  
    try {
      await axios.post(`http://localhost:5000/factures/${facture.id}/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('PDF saved to server successfully');
    } catch (error) {
      console.error('Error saving PDF to server:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.AR_Design.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelection = (product) => {
    setSelectedProducts(prevSelected => {
      const existingProduct = prevSelected.find(p => p.id === product.id);
      if (existingProduct) {
        return prevSelected.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prevSelected, { ...product, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedProducts(prevSelected => 
      prevSelected.map(p => 
        p.id === id ? { ...p, quantity: parseInt(quantity) || 0 } : p
      )
    );
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(prevSelected => prevSelected.filter(p => p.id !== id));
  };
 return (
    <div className="flex flex-col lg:flex-row justify-between pt-5 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:w-2/3 mb-8 lg:mb-0 lg:mr-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Commande</h2>
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
              <label htmlFor="searchProducts" className="block text-sm font-medium text-gray-700">Search Products</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="searchProducts"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a product"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-800">Products:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex flex-col items-center">
                        <img 
                          src={`http://localhost:5000/${product.imageUrl}`} 
                          alt={product.AR_Design} 
                          className="w-full h-32 object-cover rounded-md mb-2"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                        <h4 className="text-sm font-medium text-gray-800 text-center mb-2">{product.AR_Design}</h4>
                        <p className="text-sm text-gray-600 mb-2">Price: ${product.PrixProduct}</p>
                        <button
                          type="button"
                          onClick={() => handleProductSelection(product)}
                          className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-300"
                        >
                          <FaShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Selected Products:</h3>
              <ul className="space-y-2">
                <AnimatePresence>
                {Array.isArray(selectedProducts) && selectedProducts.map(product => (
                    <motion.li
                      key={product.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
                    >
                      <span className="text-sm font-medium text-gray-800">{product.AR_Design}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
            >
              Submit Commande
            </button>
          </form>
        </div>
      </div>
      
      <div className="w-full lg:w-1/3">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Facture</h2>
          {pdfUrl ? (
            <div className="space-y-4">
              <iframe 
                src={pdfUrl} 
                className="w-full h-96 border rounded" 
                title="Generated Facture PDF"
              ></iframe>
              <div className="flex space-x-2">
                <a
                  href={pdfUrl}
                  download="commande.pdf"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  Download PDF
                </a>
                {facture && (
                  <button
                    onClick={() => {
                      console.log('Facture saved:', facture);
                      Swal.fire({
                        icon: 'success',
                        title: 'Facture saved!',
                        text: 'Your facture has been saved successfully.',
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                  >
                    Save Facture
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Generate PDF Document Not started
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandeForm;
