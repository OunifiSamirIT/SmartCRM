import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Facture = () => {
  const [factures, setFactures] = useState([]);

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
  const getPDFUrl = (pdfData) => {
    if (!pdfData) return null;
    const blob = new Blob([new Uint8Array(pdfData.data)], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Factures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factures.map((facture) => (
          <div key={facture.id} className="border bg-white border-1  rounded-lg p-4 shadow-2xl">
            <h2 className="text-xl font-semibold mb-2">Facture {facture.numero}</h2>
            <p className="mb-2">Type: {facture.typeFacture}</p>
            <p className="mb-2">Total Amount: ${facture.totalAmount.toFixed(2)}</p>
            <p className="mb-2">Date: {new Date(facture.date).toLocaleDateString()}</p>
            {facture.pdfFile && (
              <div className="mt-4">
                <iframe
                  src={getPDFUrl(facture.pdfFile)}
                  width="100%"
                  height="347px"
                  title={`Facture ${facture.numero}`}
                  className="border rounded"
                />
              </div>
            )}
            {facture.pdfFile && (
              <button
                onClick={() => openPDF(facture.pdfFile, facture.numero)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                View PDF
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facture;