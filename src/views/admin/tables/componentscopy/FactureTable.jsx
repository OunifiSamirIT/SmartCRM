import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

const Facture = () => {
  const [factures, setFactures] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const response = await axios.get('http://localhost:5000/factures');
      setFactures(response.data);
    } catch (error) {
      console.error('Error fetching factures:', error);
    }
  };

  const openPDF = (pdfData, factureNumber) => {
    const blob = new Blob([new Uint8Array(pdfData.data)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, `_blank`);
  };

  const getPDFUrl = (pdfFile) => {
    if (!pdfFile) return null;
    const blob = new Blob([new Uint8Array(pdfFile.data)], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center text-blue-600"
      >
        Factures
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factures.map((facture) => (
          <motion.div
            key={facture.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Facture {facture.numero}</h2>
            <p className="mb-2 text-gray-600">
              <span className="font-semibold">Type:</span> {facture.typeFacture}
            </p>
            <p className="mb-2 text-gray-600">
              <span className="font-semibold">Total Amount:</span> ${facture.totalAmount.toFixed(2)}
            </p>
            <p className="mb-4 text-gray-600">
              <span className="font-semibold">Date:</span> {new Date(facture.date).toLocaleDateString()}
            </p>
            {facture.pdfFile && (
              <div className="mt-4">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                >
                  <iframe
                    src={getPDFUrl(facture.pdfFile)}
                    width="100%"
                    height="200px"
                    title={`Facture ${facture.numero}`}
                    className="border rounded mb-4"
                  />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openPDF(facture.pdfFile, facture.numero)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300"
                  data-tooltip-id={`tooltip-${facture.id}`}
                  data-tooltip-content="Click to view the full PDF"
                >
                  View Full PDF
                </motion.button>
                <Tooltip id={`tooltip-${facture.id}`} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Facture;