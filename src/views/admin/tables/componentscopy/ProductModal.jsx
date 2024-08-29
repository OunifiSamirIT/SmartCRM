import React from 'react';
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const ProductModal = ({ isOpen, onClose, currentProduct, formData, formErrors, handleChange, handleAddProduct, handleProductImageChange, productImagePreview, handleFileChange, handleFileUpload, data, imageUrl, categories, stocks, fournisseurs }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Add Product"
          className="modal"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {currentProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
              <div className="w-full md:w-1/2">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  {/* Product Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input
                      type="file"
                      name="imageUrl"
                      accept="image/*"
                      onChange={handleProductImageChange}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  {productImagePreview && (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={productImagePreview}
                      alt="Product Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  )}
                  
                  {/* Other form fields */}
                  {['AR_Ref', 'AR_Design', 'FA_CodeFamille', 'PrixProduct', 'QuantiteProduct'].map((field) => (
                    <motion.div key={field} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-sm font-medium text-gray-700">{field}</label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder={field}
                      />
                      {formErrors[field] && (
                        <p className="mt-1 text-xs text-red-500">{formErrors[field]}</p>
                      )}
                    </motion.div>
                  ))}

                  {/* Checkbox for SuiviStock */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="AR_SuiviStock"
                      checked={formData.AR_SuiviStock}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">SuiviStock</label>
                  </div>

                  {/* Dropdowns */}
                  {[
                    { name: 'stockId', options: stocks, label: 'Stock', optionLabel: 'stockName' },
                    { name: 'categorieId', options: categories, label: 'Category', optionLabel: 'name' },
                    { name: 'fournisseurId', options: fournisseurs, label: 'Fournisseur', optionLabel: 'name' }
                  ].map((dropdown) => (
                    <motion.div key={dropdown.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-sm font-medium text-gray-700">{dropdown.label}</label>
                      <select
                        name={dropdown.name}
                        value={formData[dropdown.name]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      >
                        <option value="">Select {dropdown.label}</option>
                        {dropdown.options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option[dropdown.optionLabel]}
                          </option>
                        ))}
                      </select>
                      {formErrors[dropdown.name] && (
                        <p className="mt-1 text-xs text-red-500">{formErrors[dropdown.name]}</p>
                      )}
                    </motion.div>
                  ))}

                  {/* Submit button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Add Product
                  </motion.button>
                </form>
              </div>

              {/* Right side - AI Generated Content */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Upload File for AI Processing</label>
                  <input
                    type="file"
                    accept=".pdf, .png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFileUpload}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Scan With IA
                  </motion.button>

                  {imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <h3 className="text-lg font-semibold">Product Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {['description', 'category', 'reference', 'codeFamille', 'price', 'quantity'].map((field) => (
                          <div key={field} className="border border-gray-200 rounded p-2">
                            <div className="font-medium text-gray-700">{field}</div>
                            <div>{data[currentProduct]?.[field] || 'N/A'}</div>
                          </div>
                        ))}
                      </div>
                      <img
                        src={imageUrl}
                        alt="Invoice Preview"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
          </Modal>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;