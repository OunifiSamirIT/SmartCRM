import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Simplified mapping of some countries/capitals to their approximate coordinates
const locationCoordinates = {
  "USA": [-95, 38],
  "Washington D.C.": [-77, 38],
  "UK": [-3, 55],
  "London": [-0.1, 51.5],
  "France": [2, 46],
  "Paris": [2.3, 48.8],
  "Germany": [10, 51],
  "Berlin": [13.4, 52.5],
  "Japan": [138, 38],
  "Tokyo": [139.7, 35.7],
  "Australia": [133, -25],
  "Canberra": [149.1, -35.3],
  "Brazil": [-55, -10],
  "Brasilia": [-47.9, -15.8],
  "Canada": [-106, 56],
  "Ottawa": [-75.7, 45.4],
  "India": [78, 20],
  "New Delhi": [77.2, 28.6],
  "China": [105, 35],
  "Beijing": [116.4, 39.9],
  "Russia": [100, 60],
  "Moscow": [37.6, 55.7],
  "Tunisia": [9.5375, 33.8869],
  "Tunisie": [9.5375, 33.8869], // Alternative spelling
  "Tunis": [10.1815, 36.8065], // Capital city
  "Tunisie,Ariana": [10.1934, 36.8625],
  "Tunisie,Sousse": [10.6412, 35.8245],
};

const DepotTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depots, setDepots] = useState([]);
  const [currentDepot, setCurrentDepot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });

  useEffect(() => {
    fetchDepots();
  }, []);

  const fetchDepots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/depots");
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
      if (currentDepot) {
        await axios.put(`http://localhost:5000/depots/${currentDepot.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/depots", formData);
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
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Depot Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          onClick={() => {
            setCurrentDepot(null);
            setFormData({ name: '', location: '' });
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Depot
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {depots.map((depot) => (
              <tr key={depot.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{depot.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{depot.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(depot)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDepot(depot.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Depot Locations</h2>
        <div style={{ width: "100%", height: "400px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", backgroundColor: "#ffffff" }}>
                    <ComposableMap projectionConfig={{ scale: 180 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                  />
                ))
              }
            </Geographies>
            {depots.map((depot) => {
              const coordinates = locationCoordinates[depot.location];
              if (coordinates) {
                return (
                  <Marker key={depot.id} coordinates={coordinates}>
                    <circle r={4} fill="#F00" stroke="#fff" strokeWidth={2} />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px" }}
                    >
                      {depot.name}
                    </text>
                  </Marker>
                );
              }
              return null;
            })}
          </ComposableMap>
        </div>
      </div>

      <Transition show={isModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {currentDepot ? 'Edit Depot' : 'Add Depot'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
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
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Country or Capital)</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {currentDepot ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DepotTable;