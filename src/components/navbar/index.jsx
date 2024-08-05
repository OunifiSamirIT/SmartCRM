import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import axios from "axios";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const [user, setUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [productsByStock, setProductsByStock] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);

  
  const addDebugInfo = (info) => {
    setDebugInfo(prev => [...prev, info]);
    console.log(info);
  };
  const fetchStocks = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo([]);
    setLowStockProducts([]);
    
    try {
      addDebugInfo("Fetching stocks...");
      const response = await axios.get("http://localhost:5000/stocks");
      addDebugInfo(`Stocks fetched: ${response.data.length} stocks`);
      addDebugInfo(`Stock data: ${JSON.stringify(response.data)}`);
      
      const lowStock = [];
      for (const stock of response.data) {
        const stockName = stock.stockName || 'Unknown Stock';
        addDebugInfo(`Fetching products for stock: ${stockName}`);
        const productsResponse = await axios.get(`http://localhost:5000/stocks/${stock.id}/products`);
        addDebugInfo(`Products fetched for ${stockName}: ${productsResponse.data.length} products`);
        addDebugInfo(`Product data: ${JSON.stringify(productsResponse.data)}`);
        
        productsResponse.data.forEach(product => {
          const productName = product.AR_Design || 'Unknown Product';
          const totalQuantity = product.QuantiteProduct || 0;
          const availableQuantity = product.QuantiteProductAvalible || 0;
          const imageurl = product.imageUrl;
          const threshold = totalQuantity * 0.25;
          const isBelowThreshold = availableQuantity < threshold;
          
          addDebugInfo(`Checking product: ${productName}, Available: ${availableQuantity}, Total: ${totalQuantity}, Threshold: ${threshold}, Below Threshold: ${isBelowThreshold}`);
          
          if (isBelowThreshold) {
            addDebugInfo(`Low stock detected: ${productName}`);
            lowStock.push({
              stockName,
              productName,
              quantity: availableQuantity,
              totalQuantity,
              imageurl,
            });
          }
        });
      }
      
      addDebugInfo(`Total low stock products: ${lowStock.length}`);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError(`Failed to fetch stock data: ${error.message}`);
      addDebugInfo(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchStocks()
  }, []);

  if (!user) {
    return null; // Or some loading indicator
  }





  return (
    <nav className="z-50 relative top-4  flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            class="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <button onClick={fetchStocks} className="p-2 hover:bg-gray-100 rounded-full">
          <FiRefreshCw className="h-4 w-4 text-gray-600 dark:text-white" />
        </button>
        {/* start Notification */}
        <Dropdown className=" sticky z-50"
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline  className="h-4 w-4 text-gray-600 dark:text-white" />
              {lowStockProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out "
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </p>
              </div>
           
              {isLoading && <p>Loading stock information...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {/* Low Stock Notifications */}
              {lowStockProducts.length > 0 ? (
  lowStockProducts.map((product) => {
    console.log(product); // Add this line to inspect the product object
    return (
      <div key={product.id} className="flex w-full items-center">
         <img 
            src={`http://localhost:5000/${product.imageurl}`} 
            className="h-16 w-16 object-cover" 
          />
        <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
          <p className="mb-1 text-left gap-x-3 text-base font-bold text-gray-900 dark:text-white">
            Low Stock Alert: {` `} <span className="px-5 bg-red-400 mx-2 text-white text-xs font-semibold py-1  rounded-full "> {product.productName}</span>
          </p>
          
          <p className="font-base text-left text-xs text-gray-900 dark:text-white">
            Stock: {product.stockName}, Quantity: {product.quantity}/{product.totalQuantity}
          </p>
          <p className="font-base text-left text-xs text-red-500">
            Below 25% threshold
          </p>
        </div>
      </div>
    );
  })
) : (
  <p>No low stock notifications at this time.</p>
)}

              {/* Debug Information */}
              
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />
        {/* start Horizon PRO */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          children={
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div
                style={{
                  backgroundImage: `url(${navbarimage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className="mb-2 aspect-video w-full rounded-lg"
              />
              <a
                target="blank"
                href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                Buy Horizon UI PRO
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/docs-tailwind/docs/react/installation?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
              >
                See Documentation
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/?ref=live-free-tailwind-react"
                className="hover:bg-black px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:text-navy-700 dark:text-white dark:hover:text-white"
              >
                Try Horizon Free
              </a>
            </div>
          }
          classNames={"py-2 top-6 -left-[250px] md:-left-[330px] w-max"}
          animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
        />
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={avatar}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, {user.email} 
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a>
                <a
          href="/auth/sign-in"
          className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token"); // Remove token from local storage
            window.location.href = "/auth/sign-in"; // Redirect to sign-in page
          }}
        >
          Log Out
        </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
