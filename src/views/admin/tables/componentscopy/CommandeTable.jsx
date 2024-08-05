// // src/components/CommandeForm.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CommandeForm = () => {
//   const [clientName, setClientName] = useState('');
//   const [address, setAddress] = useState('');
//   const [billingDate, setBillingDate] = useState('');
//   const [deliveryDate, setDeliveryDate] = useState('');
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState({});
//   const [quantities, setQuantities] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     // Fetch product list from API
//     axios.get('http://localhost:5000/products/getProduct')
//       .then(response => setProducts(response.data))
//       .catch(error => console.error('Error fetching products:', error));
//   }, []);

//   const handleProductChange = (productId, quantity) => {
//     setQuantities(prevQuantities => ({
//       ...prevQuantities,
//       [productId]: quantity
//     }));
//   };

//   const handleProductSelection = (productId, isSelected) => {
//     setSelectedProducts(prevSelectedProducts => ({
//       ...prevSelectedProducts,
//       [productId]: isSelected
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const selectedProductList = Object.keys(selectedProducts)
//       .filter(productId => selectedProducts[productId])
//       .map(productId => ({
//         productId,
//         quantity: quantities[productId] || 1
//       }));

//     const data = {
//       clientName,
//       address,
//       billingDate,
//       deliveryDate,
//       products: selectedProductList
//     };

//     axios.post('http://localhost:5000/commandeClients', data)
//       .then(response => {
//         console.log('Commande created:', response.data);
//         // Handle success
//       })
//       .catch(error => console.error('Error creating commande:', error));
//   };

//   const filteredProducts = products.filter(product =>
//     product.AR_Design.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-row justify-between pt-5 w-[100%]">

      
//     <form onSubmit={handleSubmit} className="items-start w-[50%] mt-3 p-8 bg-white shadow-md rounded-lg">
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Client Name:</label>
//         <input
//           type="text"
//           value={clientName}
//           onChange={(e) => setClientName(e.target.value)}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Billing Date:</label>
//         <input
//           type="date"
//           value={billingDate}
//           onChange={(e) => setBillingDate(e.target.value)}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Date:</label>
//         <input
//           type="date"
//           value={deliveryDate}
//           onChange={(e) => setDeliveryDate(e.target.value)}
//           required
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Search Products:</label>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search for a product"
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Products:</label>
//         {filteredProducts.map(product => (
//           <div key={product.id} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={!!selectedProducts[product.id]}
//               onChange={(e) => handleProductSelection(product.id, e.target.checked)}
//               className="mr-2"
//             />
//             <span className="mr-4">{product.AR_Design}</span>
//             {selectedProducts[product.id] && (
//               <input
//                 type="number"
//                 min="1"
//                 value={quantities[product.id] || ''}
//                 onChange={(e) => handleProductChange(product.id, e.target.value)}
//                 placeholder="Quantity"
//                 className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             )}
//           </div>
//         ))}
//       </div>
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Submit
//       </button>
//     </form>
    
    
//     <div className="w-[50%]">facture </div>
    
    
//     </div>
//   );
// };

// export default CommandeForm;
// src/components/CommandeForm.js
// src/components/CommandeForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const CommandeForm = () => {
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [stocks, setStocks] = useState([]);
  const [productsByStock, setProductsByStock] = useState({});
  const [facture, setFacture] = useState(null);





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

  const handleProductSelection = (productId, isSelected) => {
    setSelectedProducts(prevSelectedProducts => ({
      ...prevSelectedProducts,
      [productId]: isSelected
    }));
  };
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stocks");
      setStocks(response.data);
      const productsPromises = response.data.map(stock =>
        axios.get(`http://localhost:5000/stocks/${stock.id}/products`)
      );
      const productsResponses = await Promise.all(productsPromises);
      const productsByStock = productsResponses.reduce((acc, response, index) => {
        acc[response.config.url.split('/')[4]] = response.data;
        return acc;
      }, {});
      setProductsByStock(productsByStock);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };
  // const handleSubmit = (e) => {
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

  //   axios.post('http://localhost:5000/commandeClients', data)
  //     .then(response => {
  //       console.log('Commande created:', response.data);
  //       generatePDF(data);
  //     })
  //     .catch(error => console.error('Error creating commande:', error));
  // };
  useEffect(() => {
    if (facture) {
      const data = {
        clientName,
        address,
        billingDate,
        deliveryDate,
        products: Object.keys(selectedProducts)
          .filter(productId => selectedProducts[productId])
          .map(productId => ({
            productId,
            quantity: quantities[productId] || 1,
            price: prices[productId] || 0
          }))
      };
      generatePDF(data, facture);
    }
  }, [facture, clientName, address, billingDate, deliveryDate, selectedProducts, quantities, prices]);
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const selectedProductList = Object.keys(selectedProducts)
      .filter(productId => selectedProducts[productId])
      .map(productId => ({
        productId,
        quantity: quantities[productId] || 1,
        price: prices[productId] || 0
      }));
  
    const data = {
      clientName,
      address,
      billingDate,
      deliveryDate,
      products: selectedProductList
    };
  
    axios.post('http://localhost:5000/commandeClients', data)
      .then(response => {
        console.log('Commande created:', response.data);
        setFacture(response.data.facture);
        generatePDF(data, response.data.facture);
      })
      .catch(error => console.error('Error creating commande:', error));
  };

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
  // const generatePDF = (data) => {
  //   const pdf = new jsPDF();
  //   pdf.text('Facture', 10, 10);
  //   pdf.text(`Client Name: ${data.clientName}`, 10, 20);
  //   pdf.text(`Address: ${data.address}`, 10, 30);
  //   pdf.text(`Billing Date: ${data.billingDate}`, 10, 40);
  //   pdf.text(`Delivery Date: ${data.deliveryDate}`, 10, 50);

  //   const tableData = data.products.map((product, index) => [
  //     index + 1,
  //     product.productId,
  //     product.quantity,
  //     product.price,
  //     product.quantity * product.price
  //   ]);

  //   pdf.autoTable({
  //     startY: 60,
  //     head: [['#', 'Product ID', 'Quantity', 'Price', 'Total']],
  //     body: tableData
  //   });

  //   const total = tableData.reduce((sum, row) => sum + row[4], 0);
  //   pdf.text(`Total: ${total}`, 10, pdf.autoTable.previous.finalY + 10);

  //   const pdfBlob = pdf.output('blob');
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   setPdfUrl(pdfUrl);
  // };

  const filteredProducts = products.filter(product =>
    product.AR_Design.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div className="flex flex-row justify-between pt-5 w-full">
      <form onSubmit={handleSubmit} className="items-start w-1/2 mt-3 p-8 bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Client Name:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Billing Date:</label>
          <input
            type="date"
            value={billingDate}
            onChange={(e) => setBillingDate(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Date:</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Search Products:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Products:</label>
          {filteredProducts.map(product => (
            <div key={product.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!selectedProducts[product.id]}
                onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                className="mr-2"
              />
              <span className="mr-4">{product.AR_Design}</span>
              {selectedProducts[product.id] && (
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || ''}
                    onChange={(e) => handleProductChange(product.id, e.target.value, prices[product.id])}
                    placeholder="Quantity"
                    className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={prices[product.id] || ''}
                    onChange={(e) => handleProductChange(product.id, quantities[product.id], e.target.value)}
                    placeholder="Price"
                    className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
      
      <div className="w-1/2">
  <h2 className="text-xl font-bold mb-4">Facture</h2>
  {pdfUrl ? (
    <div>
      <iframe src={pdfUrl} width="100%" height="500px"></iframe>
      <a
        href={pdfUrl}
        download="commande.pdf"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 inline-block mr-2"
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
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 inline-block"
  >
    Save Facture
  </button>
)}
    </div>
  ) : (
    <p
      className="bg-blue-500 items-center flex flex-1 justify-center text-center  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 "
    >
      Generate PDF Document Not started
    </p>
  )}
</div>
    </div>
  );
};

export default CommandeForm;


