import React from "react";
import { motion } from "framer-motion";
import Links from "./components/Links";
import routes from "routes.js";
import Logo from './../../assets/logo.png' 
const Sidebar = () => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-navy-800 shadow-lg overflow-y-auto"
    >
      <div className="flex flex-col h-full">
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

        <motion.nav 
          className="flex-grow px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ul className="space-y-2">
            {routes.map((route, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <motion.a
                  href={route.layout + route.path}
                  className="flex items-center p-2 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-all duration-300 ease-in-out"
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
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        
      </div>
    </motion.div>
  );
};

export default Sidebar;