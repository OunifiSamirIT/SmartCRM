import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import routes from "routes.js";
import Logo from './../../assets/logo.png';

const Sidebar = () => {
  const location = useLocation();
  const userRole = sessionStorage.getItem("role");

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const shouldDisplayRoute = (route) => {
    // Exclude the sign-in route and any other auth routes
    if (route.layout === "/auth") return false;

    switch (userRole) {
      case "admin":
        return route.layout === "/admin" && route.name !== "Profil";
      case "agent":
        return ["Commande", "Facture", "Profil"].includes(route.name);
      case "superadmin":
        return [
          "Main Dashboard", "Article", "Stock", "Commande", "Facture",
          "Categorie", "Fournisseurs", "Depot", "Lot", "Users", "Profil"
        ].includes(route.name);
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-navy-800 shadow-lg overflow-y-auto"
    >
      <div className="flex flex-col h-full">
        {/* Logo section */}
        <motion.div 
          className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-purple-600 p-6 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2
          }}
        >
          <motion.div
            className="bg-white dark:bg-navy-800 rounded-lg p-4 shadow-inner"
            initial={{ scale: 0.8, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.5
            }}
          >
            <motion.img
              src={Logo}
              alt="Logo"
              className="w-full h-20 object-contain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -5, 5, -5, 0],
                transition: { 
                  duration: 0.5,
                  rotate: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.5
                  }
                }
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="w-full h-px bg-gray-200 dark:bg-white/30 my-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {/* Navigation section */}
        <motion.nav 
          className="flex-grow px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ul className="space-y-2">
            {routes.filter(shouldDisplayRoute).map((route, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link to={route.layout + route.path}>
                  <motion.div
                    className={`flex items-center p-2 rounded-lg transition-all duration-300 ease-in-out ${
                      activeRoute(route.path)
                        ? "bg-gray-100 dark:bg-navy-700 text-brand-500 dark:text-white"
                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700"
                    }`}
                    whileHover={{ x: 5, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="text-xl mr-3"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      {route.icon}
                    </motion.span>
                    <span className="font-medium">{route.name}</span>
                  </motion.div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;