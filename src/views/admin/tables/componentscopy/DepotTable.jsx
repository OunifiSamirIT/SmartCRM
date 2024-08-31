import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Modal.setAppElement('#root');

// Predefined locations with approximate coordinates
const locationCoordinates = {
  "Tunis": [34, 9], // Capital city
  'France': [46, 2],
  'USA': [37, -95],
  'Japan': [36, 138],
  'Brazil': [-14, -51],
  'Australia': [-25, 133],
  'South Africa': [-30, 25],
  'India': [20, 77],
  'Canada': [56, -106],
  'Russia': [60, 100],
  // Add more countries or locations as needed
};

const DepotTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depots, setDepots] = useState([]);
  const [currentDepot, setCurrentDepot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    fetchDepots();
  }, []);

  useEffect(() => {
    if (depots.length > 0) {
      fitMapToMarkers();
    }
  }, [depots]);

  const fetchDepots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/depots");
      const depotsWithCoordinates = response.data.map(depot => ({
        ...depot,
        coordinates: locationCoordinates[depot.location] || [0, 0]
      }));
      setDepots(depotsWithCoordinates);
    } catch (error) {
      console.error("Error fetching depots:", error);
    }
  };

  const fitMapToMarkers = () => {
    if (depots.length === 0) return;

    const bounds = L.latLngBounds(depots.map(depot => depot.coordinates));
    setMapCenter(bounds.getCenter());
    setMapZoom(3); // Adjust this value to get the desired zoom level
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const depotData = {
        ...formData,
        coordinates: locationCoordinates[formData.location] || [0, 0]
      };
      
      if (currentDepot) {
        await axios.put(`http://localhost:5000/depots/${currentDepot.id}`, depotData);
      } else {
        await axios.post("http://localhost:5000/depots", depotData);
      }
      fetchDepots();
      setIsModalOpen(false);
      setFormData({ name: '', location: '' });
      setCurrentDepot(null);
    } catch (error) {
      console.error("Error submitting depot:", error);
    }
  };

  const handleEditClick = (depot) => {
    setCurrentDepot(depot);
    setFormData({
      name: depot.name,
      location: depot.location
    });
    setIsModalOpen(true);
  };

  const handleDeleteDepot = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/depots/${id}`);
      fetchDepots();
    } catch (error) {
      console.error("Error deleting depot:", error);
    }
  };

  return (
    <div className="p-4 relative"> {/* Added 'relative' class */}
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setCurrentDepot(null);
          setFormData({ name: '', location: '' });
          setIsModalOpen(true);
        }}
      >
        Add Depot
      </button>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-left text-gray-500 mb-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {depots.map((depot) => (
              <tr key={depot.id} className="bg-white border-b">
                <td className="px-6 py-4">{depot.name}</td>
                <td className="px-6 py-4">{depot.location}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(depot)}
                    className="font-medium text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDepot(depot.id)}
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

      <div className="w-full h-96 relative z-0"> {/* Added 'relative' and 'z-0' classes */}
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {depots.map((depot) => (
            <Marker key={depot.id} position={depot.coordinates}>
              <Popup>
                <div>
                  <h3>{depot.name}</h3>
                  <p>{depot.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {currentDepot ? 'Edit Depot' : 'Add Depot'}
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select a location</option>
                {Object.keys(locationCoordinates).map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
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
                {currentDepot ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DepotTable;