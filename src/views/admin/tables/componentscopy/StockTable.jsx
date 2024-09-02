import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaArrowDown, FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from "sweetalert2";

Modal.setAppElement('#root');

const StockTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [lots, setLots] = useState([]);
  const [depots, setDepots] = useState([]);
  const [productsByStock, setProductsByStock] = useState({});
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [formData, setFormData] = useState({
    stockName: '',
    categorieId: '',
    maxQuantityStock: '',
    fournisseurId: '',
    lotId: '',
    DepotId: ''
  });

  useEffect(() => {
    fetchStocks();
    fetchCategoriesAndFournisseurs();
    fetchLots();
    fetchDepots();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stocks");
      setStocks(response.data);
      const productsPromises = response.data.map(stock =>
        axios.get(`http://localhost:5000/stocks/${stock.id}/products`)
      );
      const productsResponses = await Promise.all(productsPromises);
      const productsByStock = productsResponses.reduce((acc, response, index) => {
        const stockId = response.config.url.split('/')[4];
        acc[stockId] = response.data;
        return acc;
      }, {});
      setProductsByStock(productsByStock);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const fetchCategoriesAndFournisseurs = async () => {
    try {
      const [categoriesResponse, fournisseursResponse] = await Promise.all([
        axios.get("http://localhost:5000/categories/getcategory"),
        axios.get("http://localhost:5000/fournisseurs/getfournisseur"),
      ]);
      setCategories(categoriesResponse.data);
      setFournisseurs(fournisseursResponse.data);
    } catch (error) {
      console.error("Error fetching categories and fournisseurs:", error);
    }
  };

  const fetchLots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/lots/");
      setLots(response.data);
    } catch (error) {
      console.error("Error fetching lots:", error);
    }
  };

  const fetchDepots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/depots/");
      setDepots(response.data);
    } catch (error) {
      console.error("Error fetching depots:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLotChange = async (e) => {
    const lotId = e.target.value;
    setFormData({ ...formData, lotId });

    if (lotId) {
      try {
        const response = await axios.get(`http://localhost:5000/lots/${lotId}`);
        setSelectedLot(response.data);
      } catch (error) {
        console.error("Error fetching lot information:", error);
      }
    } else {
      setSelectedLot(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedLot) {
      const lotQuantity = selectedLot.LS_Qte;
      const maxQuantity = parseInt(formData.maxQuantityStock);

      if (maxQuantity > lotQuantity) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Quantity',
          text: `The maximum quantity (${maxQuantity}) exceeds the available quantity in the lot (${lotQuantity}).`,
        });
        return;
      }

      const stocksInLot = stocks.filter(stock => stock.lotId === parseInt(formData.lotId));
      const totalStockQuantity = stocksInLot.reduce((sum, stock) => sum + stock.productQuantity, 0);
      if (totalStockQuantity + maxQuantity > lotQuantity) {
        Swal.fire({
          icon: 'warning',
          title: 'Lot Capacity Exceeded',
          text: 'Adding this stock would exceed the lot capacity. Please choose a different lot or adjust the quantity.',
        });
        return;
      }
    }

    try {
      const dataToSubmit = {
        ...formData,
        maxQuantityStock: parseInt(formData.maxQuantityStock)
      };

      if (currentStock) {
        await axios.put(`http://localhost:5000/stocks/${currentStock.id}`, dataToSubmit);
      } else {
        await axios.post("http://localhost:5000/stocks/add", dataToSubmit);
      }
      await fetchStocks();
      setIsModalOpen(false);
      setFormData({
        stockName: '',
        categorieId: '',
        maxQuantityStock: '',
        fournisseurId: '',
        lotId: '',
        DepotId: ''
      });
      setCurrentStock(null);
      setSelectedLot(null);

      Swal.fire({
        icon: 'success',
        title: currentStock ? 'Stock Updated' : 'Stock Added',
        text: 'The operation was successful.',
      });
    } catch (error) {
      console.error("Error submitting stock:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing your request.',
      });
    }
  };

  const handleEditClick = (stock) => {
    setCurrentStock(stock);
    setFormData({
      stockName: stock.stockName,
      categorieId: stock.categorieId,
      maxQuantityStock: stock.maxQuantityStock,
      fournisseurId: stock.fournisseurId,
      lotId: stock.lotId,
      DepotId: stock.DepotId
    });
    setIsModalOpen(true);
  };

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/stocks/${id}`);
      fetchStocks();
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const calculateTotals = (products) => {
    return products.reduce((acc, product) => ({
      totalQuantity: acc.totalQuantity + product.QuantiteProduct,
      totalInStock: acc.totalInStock + product.QuantiteProductAvalible
    }), { totalQuantity: 0, totalInStock: 0 });
  };

  const renderStockHeader = (stock, totalQuantity, totalInStock) => {
    const associatedLot = lots.find(lot => lot.id === stock.lotId);
    const isExhausted = associatedLot ? associatedLot.LS_LotEpuise : false;

    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center space-x-2 mb-4"
      >
        <span className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-full mb-2">
          Stock: {stock.stockName}
        </span>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
          Total Products: {totalQuantity}
        </span>
        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
          Available In Stock: {totalInStock}
        </span>
        {/* {isExhausted && (
          <motion.span 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full flex items-center mb-2"
          >
            <FaExclamationTriangle className="mr-2" />
            Lot Saturated
          </motion.span>
        )} */}
      </motion.div>
    );
  };

  const renderProductsTable = (products) => {
    return (
      <motion.table 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full text-sm text-left text-gray-500"
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3">Image</th>
            <th scope="col" className="px-3 py-3">Product</th>
            <th scope="col" className="px-3 py-3">Price</th>
            <th scope="col" className="px-3 py-3">Quantity</th>
            <th scope="col" className="px-3 py-3">In Stock</th>
            <th scope="col" className="px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const threshold = product.QuantiteProduct * 0.25;
            const isBelowThreshold = product.QuantiteProductAvalible < threshold;

            return (
              <motion.tr 
                key={product.id} 
                className="bg-white border-b"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-3 py-2">
                  {product.imageUrl && (
                    <img
                      src={`http://localhost:5000/${product.imageUrl}`}
                      alt={product.AR_Design}
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-3 py-2 font-medium">{product.AR_Design}</td>
                <td className="px-3 py-2">{product.PrixProduct}</td>
                <td className="px-3 py-2">{product.QuantiteProduct}</td>
                <td className="px-3 py-2">{product.QuantiteProductAvalible}</td>
                <td className="px-3 py-2">
                  {isBelowThreshold ? (
                    <FaArrowDown className="text-red-500" />
                  ) : (
                    <FaArrowUp className="text-green-500" />
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
    );
  };

  return (
    <div className="p-4">
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setCurrentStock(null);
          setFormData({
            stockName: '',
            categorieId: '',
            maxQuantityStock: '',
            fournisseurId: '',
            lotId: '',
            DepotId: ''
          });
          setIsModalOpen(true);
        }}
      >
        Add Stock
      </button>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Stock Name</th>
              <th scope="col" className="px-6 py-3">Category ID</th>
              <th scope="col" className="px-6 py-3">Quantity Max In</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Fournisseur ID</th>
              <th scope="col" className="px-6 py-3">Lot ID</th>
              <th scope="col" className="px-6 py-3">Depot ID</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id} className="bg-white border-b">
                <td className="px-6 py-4">{stock.stockName}</td>
                <td className="px-6 py-4">{stock.categorieId}</td>
                <td className="px-6 py-4">{stock.maxQuantityStock}</td>
                <td className="px-6 py-4">{stock.productQuantity}</td>
                <td className="px-6 py-4">{stock.fournisseurId}</td>
                <td className="px-6 py-4">{lots.find(lot => lot.id === stock.lotId)?.Name_Lot}</td>
                <td className="px-6 py-4">{depots.find(depot => depot.id === stock.DepotId)?.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(stock)}
                    className="font-medium text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStock(stock.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stocks.map(stock => {
          const products = productsByStock[stock.id] || [];
          const { totalQuantity, totalInStock } = calculateTotals(products);
          return (
            <motion.div 
              key={stock.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              {renderStockHeader(stock, totalQuantity, totalInStock)}
              {products.length > 0 
                ? renderProductsTable(products) 
                : <p className="text-gray-500 text-center py-4">No products available</p>
              }
            </motion.div>
          );
        })}
      </div>

      <Modal className="pl-40 bg-white mt-24 ml-32" isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{currentStock ? "Edit Stock" : "Add Stock"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Stock Name:</label>
            <input
              type="text"
              name="stockName"
              value={formData.stockName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category:</label>
            <select
              name="categorieId"
              value={formData.categorieId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Max Quantity:</label>
            <input
              type="number"
              name="maxQuantityStock"
              value={formData.maxQuantityStock}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fournisseur:</label>
            <select
              name="fournisseurId"
              value={formData.fournisseurId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Fournisseur</option>
              {fournisseurs.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Lot:</label>
            <select
              name="lotId"
              value={formData.lotId}
              onChange={handleLotChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Lot</option>
              {lots.map(lot => (
                <option key={lot.id} value={lot.id}>{lot.Name_Lot}</option>
              ))}
            </select>
          </div>
          {selectedLot && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Available Quantity in Lot: {selectedLot.LS_Qte}
              </p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Depot:</label>
            <select
              name="DepotId"
              value={formData.DepotId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Depot</option>
              {depots.map(depot => (
                <option key={depot.id} value={depot.id}>{depot.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {currentStock ? "Update" : "Add"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StockTable;