import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement('#root');

const LotTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lots, setLots] = useState([]);
  const [depots, setDepots] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [currentLot, setCurrentLot] = useState(null);
  const [formData, setFormData] = useState({
    Name_Lot: '',
    LS_NoSerie: '',
    LS_Qte: '',
    LS_LotEpuise: false,
    DL_NoIn: '',
    DL_NoOut: '',
    LS_MvtStock: '',
    DE_No: ''
  });

  useEffect(() => {
    fetchLots();
    fetchDepots();
    fetchStockMovements();
  }, []);

  const fetchLots = async () => {
    try {
      console.log("Fetching lots...");
      const response = await axios.get("http://localhost:5000/lots");
      console.log("Lots fetched:", response.data);
      
      const updatedLots = response.data.map(lot => {
        const isLotExhausted = lot.stocks.every(stock => stock.productQuantity === 0);
        
        if (lot.LS_LotEpuise !== isLotExhausted) {
          console.log(`Updating lot ${lot.id} LS_LotEpuise to ${isLotExhausted}`);
          axios.put(`http://localhost:5000/lots/${lot.id}`, {
            ...lot,
            LS_LotEpuise: isLotExhausted
          });
        }
        
        return { ...lot, LS_LotEpuise: isLotExhausted };
      });
      
      console.log("Updated lots:", updatedLots);
      setLots(updatedLots);
    } catch (error) {
      console.error("Error fetching or updating lots:", error);
    }
  };

  const fetchDepots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/depots");
      setDepots(response.data);
    } catch (error) {
      console.error("Error fetching depots:", error);
    }
  };

  const fetchStockMovements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stocks/");
      setStockMovements(response.data);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (currentLot) {
        response = await axios.put(`http://localhost:5000/lots/${currentLot.id}`, formData);
      } else {
        response = await axios.post("http://localhost:5000/lots", formData);
      }
      
      setLots(prevLots => {
        if (currentLot) {
          return prevLots.map(lot => lot.id === response.data.id ? response.data : lot);
        } else {
          return [...prevLots, response.data];
        }
      });
  
      setIsModalOpen(false);
      setFormData({
        Name_Lot: '',
        LS_NoSerie: '',
        LS_Qte: '',
        LS_LotEpuise: false,
        DL_NoIn: '',
        DL_NoOut: '',
        LS_MvtStock: '',
        DE_No: ''
      });
      setCurrentLot(null);
  
    } catch (error) {
      console.error("Error submitting lot:", error);
    }
  };

  const handleEditClick = (lot) => {
    setCurrentLot(lot);
    setFormData({
      Name_Lot: lot.Name_Lot,
      LS_NoSerie: lot.LS_NoSerie,
      LS_Qte: lot.LS_Qte,
      LS_LotEpuise: lot.LS_LotEpuise,
      DL_NoIn: lot.DL_NoIn,
      DL_NoOut: lot.DL_NoOut,
      LS_MvtStock: lot.LS_MvtStock,
      DE_No: lot.DE_No
    });
    setIsModalOpen(true);
  };

  const handleDeleteLot = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/lots/${id}`);
      fetchLots();
    } catch (error) {
      console.error("Error deleting lot:", error);
    }
  };

  const renderLotStatus = (lot) => {
    const totalQuantity = lot.LS_Qte;
    const usedQuantity = lot.stocks ? lot.stocks.reduce((sum, stock) => sum + stock.productQuantity, 0) : 0;
    const availableQuantity = totalQuantity - usedQuantity;
    const isSaturated = availableQuantity <= 0;

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${isSaturated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
        {isSaturated ? 'Saturated' : 'Not Saturated'}
      </span>
    );
  };

  return (
    <div className="p-4">
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setCurrentLot(null);
          setFormData({
            Name_Lot: '',
            LS_NoSerie: '',
            LS_Qte: '',
            LS_LotEpuise: false,
            DL_NoIn: '',
            DL_NoOut: '',
            LS_MvtStock: '',
            DE_No: ''
          });
          setIsModalOpen(true);
        }}
      >
        Add Lot
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Article Ref</th>
              <th scope="col" className="px-6 py-3">Serial No</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Lot Exhausted</th>
              <th scope="col" className="px-6 py-3">In No</th>
              <th scope="col" className="px-6 py-3">Out No</th>
              <th scope="col" className="px-6 py-3">Stock Movement</th>
              <th scope="col" className="px-6 py-3">Depot No</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
          {lots.map((lot) => (
            <tr key={lot.id}>
              <td className="py-2 px-4 border-b">{lot.Name_Lot}</td>
              <td className="py-2 px-4 border-b">{lot.LS_NoSerie}</td>
              <td className="py-2 px-4 border-b">{lot.LS_Qte}</td>
              <td className="py-2 px-4 border-b">
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    lot.LS_LotEpuise
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {lot.LS_LotEpuise ? "Yes" : "No"}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{lot.DL_NoIn}</td>
              <td className="py-2 px-4 border-b">{lot.DL_NoOut}</td>
              <td className="py-2 px-4 border-b">{lot.LS_MvtStock}</td>
              <td className="py-2 px-4 border-b">{lot.DE_No}</td>
              <td className="py-2 px-4 border-b">{renderLotStatus(lot)}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditClick(lot)}
                  className="font-medium text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLot(lot.id)}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Lot Modal"
        className="bg-white p-8 rounded shadow-lg max-w-md mx-auto mt-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-bold mb-4">
          {currentLot ? "Edit Lot" : "Add Lot"}
        </h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label htmlFor="Name_Lot" className="block text-sm font-medium text-gray-700">Name Lot</label>
            <input
              type="text"
              id="Name_Lot"
              name="Name_Lot"
              value={formData.Name_Lot}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="LS_NoSerie" className="block text-sm font-medium text-gray-700">Serial No</label>
            <input
              type="text"
              id="LS_NoSerie"
              name="LS_NoSerie"
              value={formData.LS_NoSerie}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="LS_Qte" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="LS_Qte"
              name="LS_Qte"
              value={formData.LS_Qte}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="LS_LotEpuise" className="block text-sm font-medium text-gray-700">Lot Exhausted</label>
            <input
              type="checkbox"
              id="LS_LotEpuise"
              name="LS_LotEpuise"
              checked={formData.LS_LotEpuise}
              onChange={handleChange}
              className="mt-1 block shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="DL_NoIn" className="block text-sm font-medium text-gray-700">In No</label>
            <input
              type="text"
              id="DL_NoIn"
              name="DL_NoIn"
              value={formData.DL_NoIn}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="DL_NoOut" className="block text-sm font-medium text-gray-700">Out No</label>
            <input
              type="text"
              id="DL_NoOut"
              name="DL_NoOut"
              value={formData.DL_NoOut}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="LS_MvtStock" className="block text-sm font-medium text-gray-700">Stock Movement</label>
            <select
              id="LS_MvtStock"
              name="LS_MvtStock"
              value={formData.LS_MvtStock}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Select a Stock Movement</option>
              {stockMovements.map((movement) => (
                <option key={movement.id} value={movement.id}>{movement.stockName}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="DE_No" className="block text-sm font-medium text-gray-700">Depot No</label>
            <select
              id="DE_No"
              name="DE_No"
              value={formData.DE_No}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Select a Depot</option>
              {depots.map((depot) => (
                <option key={depot.id} value={depot.id}>{depot.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {currentLot ? "Update Lot" : "Add Lot"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LotTable;