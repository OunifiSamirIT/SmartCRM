
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import A from './ai-to-pdf-1024x576.png'
Modal.setAppElement('#root'); // Or use '#__next' for Next.js
import "./modal.css"
const ArticleTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const [currentProduct, setcurrentProduct] = useState(0); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [stocksp, setStocksp] = useState([]);
  const [productsByStock, setProductsByStock] = useState({});
  const [stockQuantities, setStockQuantities] = useState({});
  const [productQuantities, setProductQuantities] = useState({});
  
  const [formData, setFormData] = useState({
    AR_Ref: "",
    AR_Design: "",
    FA_CodeFamille: "",
    QuantiteProduct: "",
    QuantiteProductAvalible: "",
    
    AR_SuiviStock: false,
    categorieId: "",
    fournisseurId: "",
    totalAmount: "",
    PrixProduct: "",
    imageUrl: null,
    stockId: '', 

  });
  const [productImagePreview, setProductImagePreview] = useState(null);
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      imageUrl: file,
    });
    if (file) {
      setProductImagePreview(URL.createObjectURL(file));
    }
  };
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
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
    const loadStocks = async () => {
      const response = await axios.get('http://localhost:5000/stocks/');
      setStocks(response.data);
    };
    loadStocks();
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/products/getProduct"
        );
        setProducts(response.data);
        console.log("qqqqqqqqqqqqqqqqqqqqqqqq", products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/stocks");
        setStocksp(response.data);
        const productsPromises = response.data.map(stock =>
          axios.get(`http://localhost:5000/stocks/${stock.id}/products`)
        );
        const productsResponses = await Promise.all(productsPromises);
        const productsByStock = productsResponses.reduce((acc, response, index) => {
          acc[response.config.url.split('/')[4]] = response.data;
          return acc;
        }, {});
        setProductsByStock(productsByStock);
        const updatedProductQuantities = {};
        for (const product of products) {
          const stock = stocks.find((stock) => stock.id === product.stockId);
          if (stock) {
            updatedProductQuantities[product.id] = stock.productQuantity;
          }
        }
        setProductQuantities(updatedProductQuantities);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };
    fetchStocks()
    fetchCategoriesAndFournisseurs();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setImageUrl(URL.createObjectURL(file)); // Create a URL for the image preview
    }
  };

  const cleanExtractedData = (text) => {
  
    const lines = text.split('\n').map(line => line.trim());
    return {
      factureNumber: extractField(lines, 'FACTURE N°'),
      clientName: extractField(lines, 'Name:'),
      clientAddress: extractField(lines, 'Address:'),
      contactInfo: extractField(lines, 'contactinfo:'),
      dateOfInvoice: extractField(lines, 'Date de facture'),
      dateOfDelivery: extractField(lines, 'Date de livraison'),
      paymentConditions: extractField(lines, 'Conditions de reglement'),
      paymentDueDate: extractField(lines, 'Echéance de paiement'),
      products: extractProducts(lines),
      totalAmount: extractField(lines, 'Montant Total')
    };
  };

  const extractField = (lines, keyword) => {
    const line = lines.find(l => l.includes(keyword));
    return line ? line.split(keyword)[1]?.trim() || '' : '';
  };

  const extractProducts = (lines) => {
    const startIndex = lines.findIndex(line => line.startsWith("ID Design Quantité Reference Code Famille Categorie Prix Sous-total"));
    if (startIndex === -1) return []; 
  
    const productLines = lines.slice(startIndex + 1); 
    const products = [];
  
    for (const line of productLines) {
      if (line.trim() === '' || line.includes('Montant Total')) break; 
  
      const parts = line.trim().split(/\s+/);
  
      // const product = {
      //   id: parts[0],
      //   design: parts.slice(1, parts.length - 6).join(' '), 
      //   quantity: parts[parts.length - 6],
      //   reference: parts[parts.length - 5],
      //   codeFamille: parts[parts.length - 2],
      //   categorie: parts[parts.length - 2],
      //   price: parts[parts.length - 2],
      //   sousTotal: parts[parts.length - 1]
      // };
      const product = {
        id: parts[0],
        design: parts.slice(1, parts.length - 6).join(' '),
        quantity: parts[parts.length - 6],
        reference: parts[parts.length - 5],
        codeFamille: parts[parts.length - 4],
        categorie: parts[parts.length - 3],
        price: parts[parts.length - 2],
        sousTotal: parts[parts.length - 1],
      };
      products.push(product);
      console.log("sdsdsds", parts)

    }
  console.log("ksksksksksks", productLines)
    return products;
  };
  
  

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response Data:", response.data);
      const extractedText = response.data.text;
      setData(response.data.products)

      const cleanedData = cleanExtractedData(extractedText);
      // console.log("Extracted Data:", extractedData);
      setExtractedData(cleanedData);
      console.log("Extracted Data:", extractedData);
      if (response.data && response.data.text) {
        const extractedText = response.data.text;
        const cleanedData = cleanExtractedData(extractedText);
        // console.log("Extracted Data:", extractedData);
        setExtractedData(cleanedData);
        console.log("Extracted Data:", extractedData);

        setFormData({
          AR_Ref: cleanedData.products.reference || "",
          AR_Design: cleanedData.products.description || "",
          FA_CodeFamille: data[currentProduct]?.codeFamille || "",
          AR_SuiviStock:  false,
          PrixProduct: data[currentProduct]?.price || "",
          QuantiteProduct: data[currentProduct]?.quantity || "",
          categorieId: cleanedData.products.categorie || "",
          fournisseurId: cleanedData.products.fournisseur || "",
        //   totalAmount: cleanedData.totalAmount || "",
        });
      } else {
        console.error("No text found in response");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/products/getProduct"
      );
      setProducts(response.data);
      console.log("qqqqqqqqqqqqqqqqqqqqqqqq", products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
 
  useEffect(() => {
    if (data[currentProduct]) {
      setFormData({
        AR_Ref: data[currentProduct].reference || "",
        AR_Design: data[currentProduct].description || "",
        FA_CodeFamille: data[currentProduct].codeFamille || "",
        AR_SuiviStock: formData.AR_SuiviStock,
        categorieId: data[currentProduct].category || "",
        PrixProduct: data[currentProduct].price || "",
        QuantiteProduct: data[currentProduct].quantity || "",
        fournisseurId: formData.fournisseurId,
        totalAmount: data[currentProduct].price || "",
      });
    }
  }, [currentProduct, data]);


  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
    
      // Explicitly add each field we want to send
      formDataToSend.append('AR_Ref', formData.AR_Ref);
      formDataToSend.append('AR_Design', formData.AR_Design);
      formDataToSend.append('FA_CodeFamille', formData.FA_CodeFamille);
      formDataToSend.append('AR_SuiviStock', formData.AR_SuiviStock);
      formDataToSend.append('categorieId', formData.categorieId);
      formDataToSend.append('fournisseurId', formData.fournisseurId);
      formDataToSend.append('PrixProduct', formData.PrixProduct);
      formDataToSend.append('QuantiteProduct', formData.QuantiteProduct);
      formDataToSend.append('QuantiteProductAvalible', formData.QuantiteProduct);
      
      formDataToSend.append('stockId', formData.stockId);
      
      if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl, formData.imageUrl.name);
      }
  
      console.log('Form data being sent:', Object.fromEntries(formDataToSend));
      
      const response = await axios.post("http://localhost:5000/products/addProduct", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts([...products, response.data]);

      // Check if there are more products to add
      if (currentProduct + 1 < data.length) {
        setcurrentProduct(currentProduct + 1);
        // Reset the form data for the next product
        setFormData({
          AR_Ref: "",
          AR_Design: "",
          FA_CodeFamille: "",
          AR_SuiviStock: false,
          categorieId: "",
          fournisseurId: "",
          totalAmount: "",
          PrixProduct: "",
          QuantiteProduct: "",
          QuantiteProductAvalible: "",
          
          imageUrl: null,
          stockId:""
        });
      } else {
        // If all products have been added, close the modal
        setIsAddModalOpen(true);
        Swal.fire({
          icon: 'success',
          title: 'Product Added Successfully!',
          text: 'The product has been added to the database.',
        });
        
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'imageUrl' && formData[key]) {
          formDataToSend.append(key, formData[key], formData[key].name);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      const response = await axios.put(`http://localhost:5000/products/${currentProduct.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Check if there are more products to add
     
        // Reset the form data for the next product
        fetchProducts()
     
    } catch (error) {
      console.error("Error update product:", error);
    }
  };
  
 

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };
  const handlecancel = () => {
    setIsAddModalOpen(false)
    setFormData({
      AR_Ref: "",
      AR_Design: "",
      FA_CodeFamille: "",
      QuantiteProduct: "",
      QuantiteProductAvalible: "",
      AR_SuiviStock: false,
      categorieId: "",
      fournisseurId: "",
      totalAmount: "",
      PrixProduct: "",
      imageUrl: null,
      stockId: '',
    });
    setProductImagePreview(null);
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
    const loadStocks = async () => {
      const response = await axios.get('http://localhost:5000/stocks/');
      setStocks(response.data);
    };
    loadStocks();
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/products/getProduct"
        );
        setProducts(response.data);
        console.log("qqqqqqqqqqqqqqqqqqqqqqqq", products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
   
    fetchStocks()
    fetchCategoriesAndFournisseurs();
    fetchProducts();
  };

 
  
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      const response = await axios.get("http://localhost:5000/products/getProduct");
      setProducts(response.data);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  const handleUpdateClick = (product) => {
    setcurrentProduct(product);
    setFormData({
      AR_Ref: product.AR_Ref,
      AR_Design: product.AR_Design,
      FA_CodeFamille: product.FA_CodeFamille,
      AR_SuiviStock: product.AR_SuiviStock,
      categorieId: product.categorieId,
      PrixProduct: product.PrixProduct,
      QuantiteProduct: product.QuantiteProduct,
      QuantiteProductAvalible: product.QuantiteProductAvalible,
      
      fournisseurId: product.fournisseurId,
      imageUrl: product.imageUrl,
      stockId: product.stockId,
    });
    setIsUpdateModalOpen(true);
  };
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stocks");
      setStocksp(response.data);
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
  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else if (!imageUrl) {
      setImageUrl(A);
    }
  }, [file]);
  return (
    <div className="h-screen flex flex-col">
    <button className="bg-blue-600 p-4 text-white mt-1 rounded-md" onClick={handleAddClick}>
      Add Product
    </button>
    
    <div className="h-1/2 overflow-y-auto mt-5">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="p-4">Image</th>
              <th scope="col" className="px-3 py-3">Product Ref</th>
              <th scope="col" className="px-3 py-3">Design</th>
              <th scope="col" className="px-3 py-3">CodeFamille</th>
              <th scope="col" className="px-3 py-3">Prix</th>
              <th scope="col" className="px-3 py-3">Quantite Total</th>
                <th scope="col" className="px-3 py-3">Quantite par Stock</th>              
              <th scope="col" className="px-3 py-3">Categorie</th>
              <th scope="col" className="px-3 py-3">Fournisseur</th>
              <th scope="col" className="px-3 py-3">stock</th>
              <th scope="col" className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                <td className="px-3 py-4">
                  {product.imageUrl && (
                    <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.AR_Design} className="h-10 w-10 object-cover" />
                  )}
                </td>
                <th scope="row" className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 dark:text-white">
                  {product.AR_Ref}
                </th>
                <td className="px-3 py-4">{product.AR_Design}</td>
                <td className="px-3 py-4">{product.FA_CodeFamille}</td>
                <td className="px-3 py-4">{product.PrixProduct}</td>
                <td className="px-3 py-4">{product.QuantiteProduct}</td>
                <td className="px-3 py-4">
          {/* {stocks.find((stock) => stock.id === product.stockId)?.productQuantity} */}
          {product.QuantiteProductAvalible}

        </td>
                <td className="px-3 py-4">
        {categories.find((category) => category.id === product.categorieId)?.name || ""}
      </td>
      <td className="px-3 py-4">
        {fournisseurs.find((fournisseur) => fournisseur.id === product.fournisseurId)?.name || ""}
      </td>
      <td className="px-3 py-4">
        {stocks.find((stock) => stock.id === product.stockId)?.stockName || ""}
      </td>
                <td className="flex items-center px-3 py-4">
                  <button
                    onClick={() => handleUpdateClick(product)}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500 mr-3"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="font-medium text-red-600 ms-3 hover:underline dark:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Card View (50% height) */}
    <div className="h-1/2 overflow-y-auto mt-5 bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105">
            <img
              src={product.imageUrl ? `http://localhost:5000/${product.imageUrl}` : '/api/placeholder/300/200'}
              alt={product.AR_Design}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 truncate">{product.AR_Design}</h3>
              <p className="text-gray-600 mb-2">Price: ${product.PrixProduct}</p>
              <p className="text-gray-500 text-sm">Supplier:         {fournisseurs.find((fournisseur) => fournisseur.id === product.fournisseurId)?.name || ""}
</p>
              <p className="text-gray-500 text-sm">Quantite: {product.QuantiteProduct}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>

    <Modal
isOpen={isAddModalOpen} 

onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Add/Edit Product"
  className="modal"
  overlayClassName="overlay z-50"

>
  <div className="flex flex-row"> 
    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">{currentProduct ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleAddProduct}>

      <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">Product Image</label>
                <input
  type="file"
  name="imageUrl"
  accept="image/*"
  onChange={handleProductImageChange}
  className="border px-3 py-2"
/>
              </div>
              {productImagePreview && (
                <div className="mb-4">
                  <img src={productImagePreview} alt="Product Preview" className="max-w-full h-auto" />
                </div>
              )}
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">ProductRef</label>
            <input
              type="text"
              name="AR_Ref"
              value={formData.AR_Ref }
              onChange={handleChange}
              className="w-full border px-3 py-2 text-gray-700"
              placeholder="Product Ref"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">Design</label>
            <input
              type="text"
              name="AR_Design"
              value={formData.AR_Design }
              onChange={handleChange}
              className="w-full border px-3 py-2 text-gray-700"
              placeholder="Design"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">CodeFamille</label>
            <input
              type="text"
              name="FA_CodeFamille"
              value={formData.FA_CodeFamille }
              onChange={handleChange}
              className="w-full border px-3 py-2 text-gray-700"
              placeholder="Code Famille"
            />
          </div>

          <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">Prix</label>
                <input
                  type="text"
                  name="PrixProduct"
                  value={formData.PrixProduct}
                  onChange={handleChange}
                  className="border px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">Quantite</label>
                <input
                  type="text"
                  name="QuantiteProduct"
                  value={formData.QuantiteProduct}
                  onChange={handleChange}
                  className="border px-3 py-2"
                />
              </div>
              
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">SuiviStock</label>
            <input
              type="checkbox"
              name="AR_SuiviStock"
              checked={formData.AR_SuiviStock}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Yes</span>
          </div>
          

          <div className="mb-4">
  <label className="mb-2 block font-bold text-gray-700">stockId</label>
  <select
    name="stockId"
    value={formData.stockId }
    onChange={handleChange}
    className="w-full border px-3 py-2 text-gray-700"
  >
    <option value="">Select stocks</option>
    {stocks.map((stocks) => (
      <option key={stocks.id} value={stocks.id}>
        {stocks.stockName}
      </option>
    ))}
  </select>
</div>
          <div className="mb-4">
  <label className="mb-2 block font-bold text-gray-700">Categorie</label>
  <select
    name="categorieId"
    value={formData.categorieId }
    onChange={handleChange}
    className="w-full border px-3 py-2 text-gray-700"
  >
    <option value="">Select Category</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
</div>


          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">Fournisseur</label>
            <select
              name="fournisseurId"
              value={formData.fournisseurId}
              onChange={handleChange}
              className="w-full border px-3 py-2 text-gray-700"
            >
              <option value="">Select Fournisseur</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">Upload File</label>
            <input
              type="file"
              accept=".pdf, .png, .jpg, .jpeg"
              onChange={handleFileChange}
              className="border px-3 py-2"
            />
            <button
              type="button"
              onClick={handleFileUpload}
              className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Scan With IA
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handlecancel()}
              className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
            <button
            onClick={() =>  { if (currentProduct +1 < data.length ) {setcurrentProduct(currentProduct + 1)   } else {Swal.fire({
              icon: 'success',
              title: 'All Products Saved!',
              text: 'All products have been saved successfully.',
            });}  }}
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
            Add
            </button>
          </div>
        </form>
      </div>

      <div className="mb-4">
            <label htmlFor="file" className="block bg-red-500 rounded-md text-sm font-medium text-center text-white animate-pulse">Facture Generation with IA  </label>
            
            {imageUrl && (
                <>
                <div className=" shadow shadow-md flex-col text-center h-[250px] w-full">
                    <div className="headerP w-full text-lg  font-bold">
                        Information de Produit 
                    </div>
                    <div className="contentP flex flex-row flex-wrap">


                        <div className="coLP flex-1 flex flex-col min-w-[180px] border border-1 border-green-600 m-2">
                            <div className="headerP flex-1  "> description</div>
                            <div className="contentPP flex-1"> {data[currentProduct]?.description} </div>
                        </div>
                        
                        <div className="coLP flex-1 flex flex-col min-w-[180px] border border-1 border-green-600 m-2">
                            <div className="headerP flex-1  "> Categorie</div>
                            <div className="contentPP flex-1"> {data[currentProduct]?.category} </div>
                        </div>

                        <div className="coLP flex-1 flex flex-col min-w-[180px] border border-1 border-green-600 m-2">
                            <div className="headerP flex-1  "> Reference</div>
                            <div className="contentPP flex-1"> {data[currentProduct]?.reference} </div>
                        </div>

                        <div className="coLP flex-1 flex flex-col min-w-[180px] border border-1 border-green-600 m-2">
                        <div className="headerP flex-1  "> Code Familly</div>
                            <div className="contentPP flex-1"> {data[currentProduct]?.codeFamille} </div>
                        </div>

                        
                        
                        <div className="coLP flex-1 flex flex-col min-w-[180px] border border-1 border-green-600 m-2">
                        <div className="headerP flex-1  "> Prix </div>
                            <div className="contentPP flex-1"> {data[currentProduct]?.price} </div>
                        </div>

                        <div className="coLP flex-1 flex flex-col min-w-[180px] border border-1 border-green-600 m-2">
                        <div className="headerP flex-1  "> Quantite</div>
                                <div className="contentPP flex-1"> {data[currentProduct]?.quantity} </div>
                        </div>

                        

                    </div>
                </div>
              <div className="mt-4">
                <img src={imageUrl} alt="Invoice Preview" className="w-full h-auto" />
              </div>
              </>
            )}
          </div>
          </div>
    </Modal>


    <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        contentLabel="Update Product"
        className="modal"
        overlayClassName="overlay z-50"
      >
        <div className="flex flex-row">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Update Product</h2>
            <form onSubmit={handleUpdateProduct}>
              {/* Product Image */}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">Product Image</label>
                <input
                  type="file"
                  name="imageUrl"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  className="border px-3 py-2"
                />
              </div>
              {productImagePreview && (
                <div className="mb-4">
                  <img src={productImagePreview} alt="Product Preview" className="max-w-full h-auto" />
                </div>
              )}
              
              {/* Product Ref */}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">ProductRef</label>
                <input
                  type="text"
                  name="AR_Ref"
                  value={formData.AR_Ref}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Product Ref"
                />
              </div>

              {/* Design */}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">Design</label>
                <input
                  type="text"
                  name="AR_Design"
                  value={formData.AR_Design}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Design"
                />
              </div>

              {/* CodeFamille */}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">CodeFamille</label>
                <input
                  type="text"
                  name="FA_CodeFamille"
                  value={formData.FA_CodeFamille}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Code Famille"
                />
              </div>


              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">Prix</label>
                <input
                  type="text"
                  name="PrixProduct"
                  value={formData.PrixProduct}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Prix Product"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">QuantiteProduct</label>
                <input
                  type="text"
                  name="QuantiteProduct"
                  value={formData.QuantiteProduct}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Code QuantiteProduct"
                />
              </div>
              
              {/* SuiviStock */}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">SuiviStock</label>
                <input
                  type="checkbox"
                  name="AR_SuiviStock"
                  checked={formData.AR_SuiviStock}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Yes</span>
              </div>

              {/* Categorie */}
              <div className="mb-4">
  <label className="mb-2 block font-bold text-gray-700">Categorie</label>
  <select
    name="categorieId"
    value={formData.categorieId }
    onChange={handleChange}
    className="w-full border px-3 py-2 text-gray-700"
  >
    <option value="">Select Category</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
</div>


          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">Fournisseur</label>
            <select
              name="fournisseurId"
              value={formData.fournisseurId}
              onChange={handleChange}
              className="w-full border px-3 py-2 text-gray-700"
            >
              <option value="">Select Fournisseur</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.name}
                </option>
              ))}
            </select>
          </div>

              {/* Submit and Cancel buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
  </div>
);
};


export default ArticleTable;


