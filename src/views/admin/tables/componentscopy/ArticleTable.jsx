import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import A from "./ai-to-pdf-1024x576.png";
import ProductModal from './ProductModal';  // Adjust the import path as needed

import "./modal.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
Modal.setAppElement("#root"); // Or use '#__next' for Next.js
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
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    if (!formData.AR_Ref.trim()) errors.AR_Ref = "Product Ref is required";
    if (!formData.AR_Design.trim()) errors.AR_Design = "Design is required";
    if (!formData.FA_CodeFamille.trim())
      errors.FA_CodeFamille = "Code Famille is required";
    if (!formData.PrixProduct) errors.PrixProduct = "Price is required";
    if (!formData.QuantiteProduct)
      errors.QuantiteProduct = "Quantity is required";
    if (!formData.categorieId) errors.categorieId = "Category is required";
    if (!formData.fournisseurId) errors.fournisseurId = "Supplier is required";
    if (!formData.stockId) errors.stockId = "Stock is required";
    return errors;
  };

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
    stockId: "",
  });
  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else if (!imageUrl) {
      setImageUrl(A);
    }
  }, [file]);
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
      const response = await axios.get("http://localhost:5000/stocks/");
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
        const productsPromises = response.data.map((stock) =>
          axios.get(`http://localhost:5000/stocks/${stock.id}/products`)
        );
        const productsResponses = await Promise.all(productsPromises);
        const productsByStock = productsResponses.reduce(
          (acc, response, index) => {
            acc[response.config.url.split("/")[4]] = response.data;
            return acc;
          },
          {}
        );
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
    fetchStocks();
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
    const lines = text.split("\n").map((line) => line.trim());
    return {
      factureNumber: extractField(lines, "FACTURE N°"),
      clientName: extractField(lines, "Name:"),
      clientAddress: extractField(lines, "Address:"),
      contactInfo: extractField(lines, "contactinfo:"),
      dateOfInvoice: extractField(lines, "Date de facture"),
      dateOfDelivery: extractField(lines, "Date de livraison"),
      paymentConditions: extractField(lines, "Conditions de reglement"),
      paymentDueDate: extractField(lines, "Echéance de paiement"),
      products: extractProducts(lines),
      totalAmount: extractField(lines, "Montant Total"),
    };
  };

  const extractField = (lines, keyword) => {
    const line = lines.find((l) => l.includes(keyword));
    return line ? line.split(keyword)[1]?.trim() || "" : "";
  };

  const extractProducts = (lines) => {
    const startIndex = lines.findIndex((line) =>
      line.startsWith(
        "ID Design Quantité Reference Code Famille Categorie Prix Sous-total"
      )
    );
    if (startIndex === -1) return [];

    const productLines = lines.slice(startIndex + 1);
    const products = [];

    for (const line of productLines) {
      if (line.trim() === "" || line.includes("Montant Total")) break;

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
        design: parts.slice(1, parts.length - 6).join(" "),
        quantity: parts[parts.length - 6],
        reference: parts[parts.length - 5],
        codeFamille: parts[parts.length - 4],
        categorie: parts[parts.length - 3],
        price: parts[parts.length - 2],
        sousTotal: parts[parts.length - 1],
      };
      products.push(product);
      console.log("sdsdsds", parts);
    }
    console.log("ksksksksksks", productLines);
    return products;
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response Data:", response.data);
      const extractedText = response.data.text;
      setData(response.data.products);

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
          AR_SuiviStock: false,
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

  // const handleAddProduct = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setFormErrors(errors);
  //     return;
  //   }
  //   try {
  //     const formDataToSend = new FormData();

  //     // Explicitly add each field we want to send
  //     formDataToSend.append("AR_Ref", formData.AR_Ref);
  //     formDataToSend.append("AR_Design", formData.AR_Design);
  //     formDataToSend.append("FA_CodeFamille", formData.FA_CodeFamille);
  //     formDataToSend.append("AR_SuiviStock", formData.AR_SuiviStock);
  //     formDataToSend.append("categorieId", formData.categorieId);
  //     formDataToSend.append("fournisseurId", formData.fournisseurId);
  //     formDataToSend.append("PrixProduct", formData.PrixProduct);
  //     formDataToSend.append("QuantiteProduct", formData.QuantiteProduct);
  //     formDataToSend.append(
  //       "QuantiteProductAvalible",
  //       formData.QuantiteProduct
  //     );

  //     formDataToSend.append("stockId", formData.stockId);

  //     if (formData.imageUrl) {
  //       formDataToSend.append(
  //         "imageUrl",
  //         formData.imageUrl,
  //         formData.imageUrl.name
  //       );
  //     }

  //     console.log("Form data being sent:", Object.fromEntries(formDataToSend));

  //     const response = await axios.post(
  //       "http://localhost:5000/products/addProduct",
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setProducts([...products, response.data]);

  //     // Check if there are more products to add
  //     if (currentProduct + 1 < data.length) {
  //       setcurrentProduct(currentProduct + 1);
  //       // Reset the form data for the next product
  //       setFormData({
  //         AR_Ref: "",
  //         AR_Design: "",
  //         FA_CodeFamille: "",
  //         AR_SuiviStock: false,
  //         categorieId: "",
  //         fournisseurId: "",
  //         totalAmount: "",
  //         PrixProduct: "",
  //         QuantiteProduct: "",
  //         QuantiteProductAvalible: "",

  //         imageUrl: null,
  //         stockId: "",
  //       });
  //       setFormErrors({});
  //     } else {
  //       setIsAddModalOpen(true);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Product Added Successfully!",
  //         text: "The product has been added to the database.",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error adding product:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "There was an error adding the product. Please try again.",
  //     });
  //   }
  // };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append form data
      formDataToSend.append("AR_Ref", formData.AR_Ref);
      formDataToSend.append("AR_Design", formData.AR_Design);
      formDataToSend.append("FA_CodeFamille", formData.FA_CodeFamille);
      formDataToSend.append("AR_SuiviStock", formData.AR_SuiviStock);
      formDataToSend.append("categorieId", formData.categorieId);
      formDataToSend.append("fournisseurId", formData.fournisseurId);
      formDataToSend.append("PrixProduct", formData.PrixProduct);
      formDataToSend.append("QuantiteProduct", formData.QuantiteProduct);
      formDataToSend.append("QuantiteProductAvalible", formData.QuantiteProduct);
      formDataToSend.append("stockId", formData.stockId);

      if (formData.imageUrl) {
        formDataToSend.append("imageUrl", formData.imageUrl, formData.imageUrl.name);
      }

      const response = await axios.post(
        "http://localhost:5000/products/addProduct",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts([...products, response.data.product]);

      // Use the stockId from the response
      const addedProductStockId = response.data.product.stockId;

      // Fetch updated stock information
      const stockResponse = await axios.get(`http://localhost:5000/stocks/${addedProductStockId}`);
      const updatedStock = stockResponse.data;

      // Fetch all products in the current stock
      const productsInStockResponse = await axios.get(`http://localhost:5000/stocks/${addedProductStockId}/products`);
      const productsInStock = productsInStockResponse.data;

      // Calculate total quantity of products in the stock
      const totalQuantityInStock = productsInStock.reduce((sum, product) => sum + parseInt(product.QuantiteProduct), 0);

      if (totalQuantityInStock > parseInt(updatedStock.maxQuantityStock)) {
        await Swal.fire({
          icon: "warning",
          title: "Product Added, But Stock Limit Exceeded",
          text: `The product has been added, but the total quantity (${totalQuantityInStock}) now exceeds the maximum stock capacity (${updatedStock.maxQuantityStock}).`,
          confirmButtonText: "Understood",
        });
      } else {
        const availableQuantity = parseInt(updatedStock.maxQuantityStock) - totalQuantityInStock;
        await Swal.fire({
          icon: "success",
          title: "Product Added Successfully!",
          text: `The product has been added to the database. Available quantity in stock: ${availableQuantity}`,
          confirmButtonText: "OK",
        });
      }

      // Reset form for the next product
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
        stockId: "",
      });
      setFormErrors({});
      setProductImagePreview(null);

    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error adding the product. Please try again.",
      });
    }
  };



  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "imageUrl" && formData[key]) {
          formDataToSend.append(key, formData[key], formData[key].name);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      const response = await axios.put(
        `http://localhost:5000/products/${currentProduct.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Check if there are more products to add

      // Reset the form data for the next product
      fetchProducts();
    } catch (error) {
      console.error("Error update product:", error);
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
    // Reset form data
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
      stockId: "",
    });
    setProductImagePreview(null);
  };
  const handlecancel = () => {
    setIsAddModalOpen(false);
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
      stockId: "",
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
      const response = await axios.get("http://localhost:5000/stocks/");
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

    fetchStocks();
    fetchCategoriesAndFournisseurs();
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/products/${id}`);
        
        // Fetch updated product list
        const productsResponse = await axios.get("http://localhost:5000/products/getProduct");
        setProducts(productsResponse.data);

        // Fetch updated stock information
        const stocksResponse = await axios.get("http://localhost:5000/stocks");
        setStocks(stocksResponse.data);

        Swal.fire(
          'Deleted!',
          'The product has been deleted and stock updated.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire(
        'Error!',
        'There was a problem deleting the product.',
        'error'
      );
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
      const productsPromises = response.data.map((stock) =>
        axios.get(`http://localhost:5000/stocks/${stock.id}/products`)
      );
      const productsResponses = await Promise.all(productsPromises);
      const productsByStock = productsResponses.reduce(
        (acc, response, index) => {
          acc[response.config.url.split("/")[4]] = response.data;
          return acc;
        },
        {}
      );
      setProductsByStock(productsByStock);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <button
  className="mt-1 rounded-md bg-blue-600 p-4 text-white"
  onClick={() => setIsAddModalOpen(true)}
>
  Add Product
</button>

      <div className="mt-5 h-1/2 overflow-y-auto">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  Image
                </th>
                <th scope="col" className="px-3 py-3">
                  Product Ref
                </th>
                <th scope="col" className="px-3 py-3">
                  Design
                </th>
                <th scope="col" className="px-3 py-3">
                  CodeFamille
                </th>
                <th scope="col" className="px-3 py-3">
                  Prix
                </th>
                <th scope="col" className="px-3 py-3">
                  Quantite Total
                </th>
                <th scope="col" className="px-3 py-3">
                  Quantite par Stock
                </th>
                <th scope="col" className="px-3 py-3">
                  Categorie
                </th>
                <th scope="col" className="px-3 py-3">
                  Fournisseur
                </th>
                <th scope="col" className="px-3 py-3">
                  stock
                </th>
                <th scope="col" className="px-3 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <td className="px-3 py-4">
                    {product.imageUrl && (
                      <img
                        src={`http://localhost:5000/${product.imageUrl}`}
                        alt={product.AR_Design}
                        className="h-10 w-10 object-cover"
                      />
                    )}
                  </td>
                  <th
                    scope="row"
                    className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 dark:text-white"
                  >
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
                    {categories.find(
                      (category) => category.id === product.categorieId
                    )?.name || ""}
                  </td>
                  <td className="px-3 py-4">
                    {fournisseurs.find(
                      (fournisseur) => fournisseur.id === product.fournisseurId
                    )?.name || ""}
                  </td>
                  <td className="px-3 py-4">
                    {stocks.find((stock) => stock.id === product.stockId)
                      ?.stockName || ""}
                  </td>
                  <td className="flex items-center px-1 py-4">
                    <button
                      onClick={() => handleUpdateClick(product)}
                      className="mr-3 font-medium text-blue-600 hover:underline dark:text-blue-500"
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
      <div className="mt-5 h-1/2 overflow-y-auto bg-gray-100 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="transform overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <img
                src={
                  product.imageUrl
                    ? `http://localhost:5000/${product.imageUrl}`
                    : "/api/placeholder/300/200"
                }
                alt={product.AR_Design}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 truncate text-lg font-semibold">
                  {product.AR_Design}
                </h3>
                <p className="mb-2 text-gray-600">
                  Price: ${product.PrixProduct}
                </p>
                <p className="text-sm text-gray-500">
                  Supplier:{" "}
                  {fournisseurs.find(
                    (fournisseur) => fournisseur.id === product.fournisseurId
                  )?.name || ""}
                </p>
                <p className="text-sm text-gray-500">
                  Quantite: {product.QuantiteProduct}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <Modal
  isOpen={isAddModalOpen}
  onRequestClose={() => setIsAddModalOpen(false)}
  contentLabel="Add Product"
  className="modal"
  overlayClassName="overlay z-50"
>
        <div className="flex flex-row">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">
              {currentProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Product Image
                </label>
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
                  <img
                    src={productImagePreview}
                    alt="Product Preview"
                    className="h-auto max-w-full"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  ProductRef
                </label>
                <input
                  type="text"
                  name="AR_Ref"
                  value={formData.AR_Ref}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Product Ref"
                />
                {formErrors.AR_Ref && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.AR_Ref}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Design
                </label>
                <input
                  type="text"
                  name="AR_Design"
                  value={formData.AR_Design}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Design"
                />
                {formErrors.AR_Design && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.AR_Design}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  CodeFamille
                </label>
                <input
                  type="text"
                  name="FA_CodeFamille"
                  value={formData.FA_CodeFamille}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 text-gray-700"
                  placeholder="Code Famille"
                />
                {formErrors.FA_CodeFamille && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.FA_CodeFamille}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Prix
                </label>
                <input
                  type="text"
                  name="PrixProduct"
                  value={formData.PrixProduct}
                  onChange={handleChange}
                  className="border px-3 py-2"
                />
                {formErrors.PrixProduct && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.PrixProduct}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Quantite
                </label>
                <input
                  type="text"
                  name="QuantiteProduct"
                  value={formData.QuantiteProduct}
                  onChange={handleChange}
                  className="border px-3 py-2"
                />
                {formErrors.QuantiteProduct && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.QuantiteProduct}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  SuiviStock
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  stockId
                </label>
                <select
                  name="stockId"
                  value={formData.stockId}
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
                {formErrors.stockId && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.stockId}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Categorie
                </label>
                <select
                  name="categorieId"
                  value={formData.categorieId}
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
                {formErrors.categorieId && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.categorieId}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Fournisseur
                </label>
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
                {formErrors.fournisseurId && (
                  <p className="text-xs italic text-red-500">
                    {formErrors.fournisseurId}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  Upload File
                </label>
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
                  onClick={() => {
                    if (currentProduct + 1 < data.length) {
                      setcurrentProduct(currentProduct + 1);
                    } else {
                      Swal.fire({
                        icon: "success",
                        title: "All Products Saved!",
                        text: "All products have been saved successfully.",
                      });
                    }
                  }}
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Add
                </button>
              </div>
            </form>
          </div>

          <div className="mb-4">
            <label
              htmlFor="file"
              className="block animate-pulse rounded-md bg-red-500 text-center text-sm font-medium text-white"
            >
              Facture Generation with IA{" "}
            </label>

            {imageUrl && (
              <>
                <div className=" h-[250px] w-full flex-col text-center shadow shadow-md">
                  <div className="headerP w-full text-lg  font-bold">
                    Information de Produit
                  </div>
                  <div className="contentP flex flex-row flex-wrap">
                    <div className="coLP border-1 m-2 flex min-w-[180px] flex-1 flex-col border border-green-600">
                      <div className="headerP flex-1  "> description</div>
                      <div className="contentPP flex-1">
                        {" "}
                        {data[currentProduct]?.description}{" "}
                      </div>
                    </div>

                    <div className="coLP border-1 m-2 flex min-w-[180px] flex-1 flex-col border border-green-600">
                      <div className="headerP flex-1  "> Categorie</div>
                      <div className="contentPP flex-1">
                        {" "}
                        {data[currentProduct]?.category}{" "}
                      </div>
                    </div>

                    <div className="coLP border-1 m-2 flex min-w-[180px] flex-1 flex-col border border-green-600">
                      <div className="headerP flex-1  "> Reference</div>
                      <div className="contentPP flex-1">
                        {" "}
                        {data[currentProduct]?.reference}{" "}
                      </div>
                    </div>

                    <div className="coLP border-1 m-2 flex min-w-[180px] flex-1 flex-col border border-green-600">
                      <div className="headerP flex-1  "> Code Familly</div>
                      <div className="contentPP flex-1">
                        {" "}
                        {data[currentProduct]?.codeFamille}{" "}
                      </div>
                    </div>

                    <div className="coLP border-1 m-2 flex min-w-[180px] flex-1 flex-col border border-green-600">
                      <div className="headerP flex-1  "> Prix </div>
                      <div className="contentPP flex-1">
                        {" "}
                        {data[currentProduct]?.price}{" "}
                      </div>
                    </div>

                    <div className="coLP border-1 m-2 flex min-w-[180px] flex-1 flex-col border border-green-600">
                      <div className="headerP flex-1  "> Quantite</div>
                      <div className="contentPP flex-1">
                        {" "}
                        {data[currentProduct]?.quantity}{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <img
                    src={imageUrl}
                    alt="Invoice Preview"
                    className="h-auto w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Modal> */}
<ProductModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  currentProduct={currentProduct}
  formData={formData}
  formErrors={formErrors}
  handleChange={handleChange}
  handleAddProduct={handleAddProduct}
  handleProductImageChange={handleProductImageChange}
  productImagePreview={productImagePreview}
  handleFileChange={handleFileChange}
  handleFileUpload={handleFileUpload}
  data={data}
  imageUrl={imageUrl}
  categories={categories}
  stocks={stocks}
  fournisseurs={fournisseurs}
/>
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
                <label className="mb-2 block font-bold text-gray-700">
                  Product Image
                </label>
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
                  <img
                    src={productImagePreview}
                    alt="Product Preview"
                    className="h-auto max-w-full"
                  />
                </div>
              )}

              {/* Product Ref */}
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
                  ProductRef
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  Design
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  CodeFamille
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  Prix
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  QuantiteProduct
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  SuiviStock
                </label>
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
                <label className="mb-2 block font-bold text-gray-700">
                  Categorie
                </label>
                <select
                  name="categorieId"
                  value={formData.categorieId}
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
                <label className="mb-2 block font-bold text-gray-700">
                  Fournisseur
                </label>
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
