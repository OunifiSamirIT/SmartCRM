import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiAlignJustify, FiRefreshCw, FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline, IoMdInformationCircleOutline } from "react-icons/io";
import { BsArrowBarUp } from "react-icons/bs";
import navbarimage from "assets/img/layout/Navbar.png";
import avatar from "assets/img/avatars/avatar4.png";

const Dropdown = ({ button, children, classNames }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{button}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${classNames}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ onOpenSidenav, brandText }) => {
  const [darkmode, setDarkmode] = useState(false);
  const [user, setUser] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/stocks");
      const lowStock = [];
      for (const stock of response.data) {
        const productsResponse = await axios.get(`http://localhost:5000/stocks/${stock.id}/products`);
        productsResponse.data.forEach(product => {
          const totalQuantity = product.QuantiteProduct || 0;
          const availableQuantity = product.QuantiteProductAvalible || 0;
          const threshold = totalQuantity * 0.25;
          if (availableQuantity < threshold) {
            lowStock.push({
              stockName: stock.stockName || 'Unknown Stock',
              productName: product.AR_Design || 'Unknown Product',
              quantity: availableQuantity,
              totalQuantity,
              imageurl: product.imageUrl,
            });
          }
        });
      }
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError(`Failed to fetch stock data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      
    }
      console.log("🚀 ~ useEffect ~ setUser:", user)
    fetchStocks();
  }, []);

  if (!user) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]"
    >
      <div className="ml-[6px]">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="shrink text-[33px] capitalize text-navy-700 dark:text-white"
        >
          <Link to="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">
            {brandText}
          </Link>
        </motion.p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchStocks}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiRefreshCw className="h-4 w-4 text-gray-600 dark:text-white" />
        </motion.button>

        <Dropdown
          button={
            <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
              {lowStockProducts.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-3 w-3"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </motion.span>
              )}
            </motion.div>
          }
          classNames="py-2 top-4 -left-[230px] md:-left-[440px] w-max"
        >
          <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-navy-700 dark:text-white">
                Notifications
              </p>
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                Mark all read
              </p>
            </div>
            
            {isLoading && <p>Loading stock information...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <AnimatePresence>
              {lowStockProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex w-full items-center"
                >
                  <img 
                    src={`http://localhost:5000/${product.imageurl}`} 
                    className="h-16 w-16 object-cover rounded-lg" 
                    alt={product.productName}
                  />
                  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                      Low Stock Alert: <span className="px-2 bg-red-400 ml-1 text-white text-xs font-semibold py-1 rounded-full">{product.productName}</span>
                    </p>
                    <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                      Stock: {product.stockName}, Quantity: {product.quantity}/{product.totalQuantity}
                    </p>
                    <p className="font-base text-left text-xs text-red-500">
                      Below 25% threshold
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {lowStockProducts.length === 0 && (
              <p>No low stock notifications at this time.</p>
            )}
          </div>
        </Dropdown>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer text-gray-600"
          onClick={() => {
            setDarkmode(!darkmode);
            document.body.classList.toggle("dark");
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </motion.div>

        <Dropdown
          button={
            <img
            className="h-10 w-10 rounded-full"
            src={avatar}
            alt="Elon Musk"
          />
          }
          classNames="py-2 top-8 -left-[180px] w-max"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none"
          >
            <div className="p-4">
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                👋 Hey, {user.email}
              </p>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/20" />
            <div className="flex flex-col p-4">
              <Link to="/admin/profil" className="text-sm text-gray-800 dark:text-white hover:text-blue-500 transition duration-150 ease-out hover:ease-in">
                Profile Settings
              </Link>
           
              <Link
                to="/auth/sign-in"
                className="mt-3 text-sm font-medium text-red-500 hover:text-red-700 transition duration-150 ease-out hover:ease-in"
                onClick={() => {
                  sessionStorage.removeItem("user");
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem('role');
                }}
              >
                Log Out
              </Link>
            </div>
          </motion.div>
        </Dropdown>
      </div>
    </motion.nav>
  );
};

export default Navbar;