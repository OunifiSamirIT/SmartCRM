import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement('#root');

const FournisseurTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [currentFournisseur, setCurrentFournisseur] = useState(null);
  const [formData, setFormData] = useState({ name: '', contactInfo: '', address: '' });

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fournisseurs/getfournisseur");
      setFournisseurs(response.data);
    } catch (error) {
      console.error("Error fetching fournisseurs:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFournisseur) {
        await axios.put(`http://localhost:5000/fournisseurs/fournisseurs/${currentFournisseur.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/fournisseurs/addfournisseur", formData);
      }
      fetchFournisseurs();
      setIsModalOpen(false);
      setFormData({ name: '', contactInfo: '', address: '' });
      setCurrentFournisseur(null);
    } catch (error) {
      console.error("Error submitting fournisseur:", error);
    }
  };

  const handleEditClick = (fournisseur) => {
    setCurrentFournisseur(fournisseur);
    setFormData({ name: fournisseur.name, contactInfo: fournisseur.contactInfo, address: fournisseur.address });
    setIsModalOpen(true);
  };

  const handleDeleteFournisseur = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/fournisseurs/fournisseurs/${id}`);
      fetchFournisseurs();
    } catch (error) {
      console.error("Error deleting fournisseur:", error);
    }
  };

  return (
    <div className="p-4">
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setCurrentFournisseur(null);
          setFormData({ name: '', contactInfo: '', address: '' });
          setIsModalOpen(true);
        }}
      >
        Add Fournisseur
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Contact</th>
              <th scope="col" className="px-6 py-3">address</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id} className="bg-white border-b">
                <td className="px-6 py-4">{fournisseur.name}</td>
                <td className="px-6 py-4">{fournisseur.contactInfo  }</td>
                <td className="px-6 py-4">{fournisseur.address}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(fournisseur)}
                    className="font-medium text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFournisseur(fournisseur.id)}
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
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {currentFournisseur ? 'Edit Fournisseur' : 'Add Fournisseur'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">address</label>
              <input
                type="address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {currentFournisseur ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default FournisseurTable;