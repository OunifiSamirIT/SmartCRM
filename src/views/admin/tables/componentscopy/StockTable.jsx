import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaArrowDown, FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';

Modal.setAppElement('#root');

const StockTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [lots, setLots] = useState([]);
  const [depots, setDepots] = useState([]);
  const [productsByStock, setProductsByStock] = useState({});
  const [currentStock, setCurrentStock] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    stockName: '',
    categorieId: '',
    productQuantity: '',
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
        const products = response.data.map(product => ({
          ...product,
          quantityInStock: response.data.find(p => p.id === product.id).QuantiteProduct
        }));
        acc[stockId] = products;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStock) {
        await axios.put(`http://localhost:5000/stocks/${currentStock.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/stocks", formData);
      }
      fetchStocks();
      setIsModalOpen(false);
      setFormData({
        stockName: '',
        categorieId: '',
        productQuantity: '',
        fournisseurId: '',
        lotId: '',
        DepotId: ''
      });
      setCurrentStock(null);
    } catch (error) {
      console.error("Error submitting stock:", error);
    }
  };

  const handleEditClick = (stock) => {
    setCurrentStock(stock);
    setFormData({
      stockName: stock.stockName,
      categorieId: stock.categorieId,
      productQuantity: stock.productQuantity,
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

    const isExhausted =  stock.isExhausted == 1; 
    return (
      <div className="flex items-center space-x-2 mb-2">
        <span className="bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
          Stock : {stock.stockName}
        </span>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Total Products: {totalQuantity}
        </span>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Available In Stock: {totalInStock}
        </span>
        {isExhausted && (
          <span className="animate-pulse bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <FaExclamationTriangle className="mr-1" />
            Lot Exhausted
          </span>
        )}
      </div>
    );
  };
  
  const renderProductsTable = (products, stock) => {
    return (
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-3">Image Product</th>
            <th scope="col" className="px-2 py-3">Product Name</th>
            <th scope="col" className="px-2 py-3">Price</th>
            <th scope="col" className="px-2 py-3">Product Quantity</th>
            <th scope="col" className="px-2 py-3">Quantity in Stock</th>
            <th scope="col" className="px-2 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const threshold = product.QuantiteProduct * 0.25;
            const isBelowThreshold = product.QuantiteProductAvalible < threshold;
            const isAboveThreshold = product.QuantiteProductAvalible >= threshold;
  
            return (
              <tr key={product.id} className="bg-white border-b">
                <td className="px-2 py-4">
                  {product.imageUrl && (
                    <img
                      src={`http://localhost:5000/${product.imageUrl}`}
                      alt={product.AR_Design}
                      className="h-10 w-10 object-cover"
                    />
                  )}
                </td>
                <td className="px-2 py-4">{product.AR_Design}</td>
                <td className="px-2 py-4">{product.PrixProduct}</td>
                <td className="px-2 py-4">{product.QuantiteProduct}</td>
                <td className="px-2 py-4">{product.QuantiteProductAvalible }</td>
                <td className="px-2 py-4">
                  {isBelowThreshold ? (
                    <FaArrowDown className="text-red-500" />
                  ) : (
                    <FaArrowUp className="text-green-500" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
            productQuantity: '',
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

      <div className="space-y-1">
      {stocks.reduce((rows, stock, index) => {
        if (index % 2 === 0) rows.push([]);
        rows[rows.length - 1].push(stock);
        return rows;
      }, []).map((rowStocks, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap gap-x-5">
          {rowStocks.map(stock => {
            const products = productsByStock[stock.id] || [];
            const { totalQuantity, totalInStock } = calculateTotals(products);
            return (
              <div key={stock.id} className="w-full sm:w-1/2 lg:w-[45%] px-2 mb-4">
                <div className="bg-white p-4 shadow rounded">
                {renderStockHeader(stock, totalQuantity, totalInStock)}
                  {products.length > 0 
                    ? renderProductsTable(products, stock) 
                    : <p>No products available</p>
                  }
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
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
            <label className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              name="productQuantity"
              value={formData.productQuantity}
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
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Lot</option>
              {lots.map(lot => (
                <option key={lot.id} value={lot.id}>{lot.name}</option>
              ))}
            </select>
          </div>
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
