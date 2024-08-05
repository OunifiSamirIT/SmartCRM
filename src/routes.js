import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";

import Article from "views/admin/tables/componentscopy/ArticleTable";
import Categorie from "views/admin/tables/componentscopy/CategorieTable";
import Fournisseur from "views/admin/tables/componentscopy/FournisseurTable";
import Stock from "views/admin/tables/componentscopy/StockTable";
import Depot from "views/admin/tables/componentscopy/DepotTable";
import Lot from "views/admin/tables/componentscopy/LotTable";
import Commande from "views/admin/tables/componentscopy/CommandeTable";
import Facture from "views/admin/tables/componentscopy/FactureTable";
import Users from "views/admin/tables/componentscopy/users";
 
import RTLDefault from "views/rtl/default";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdLocalShipping ,
  MdPerson,
  MdLock,
  MdHomeRepairService,
  MdLocalGroceryStore,
  MdFactCheck 
} from "react-icons/md";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  // {
  //   name: "NFT Marketplace",
  //   layout: "/admin",
  //   path: "nft-marketplace",
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,
  //   component: <NFTMarketplace />,
  //   secondary: true,
  // },
  

  {
    name: "Article",
    layout: "/admin",
    icon: <MdLocalGroceryStore  className="h-6 w-6" />,
    path: "Article",                  
    component: <Article />,
  },
  {
    name: "Stock",
    layout: "/admin",
    icon: <MdHomeRepairService className="h-6 w-6" />,
    path: "Stock",                  
    component: <Stock />,
  },
  {
    name: "Commande",
    layout: "/admin",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    path: "Commande",                  
    component: <Commande />,
  },
  {
    name: "Facture",
    layout: "/admin",
    icon: <MdFactCheck className="h-6 w-6" />,
    path: "Facture",                  
    component: <Facture />,
  },
  {
    name: "Categorie",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "Categories",
    component: <Categorie />,
  },
  {
    name: "Fournisseurs",
    layout: "/admin",
    path: "fournisseurs",
    icon: <MdLocalShipping  className="h-6 w-6" />,

    component: <Fournisseur />,
    // secondary: true,
  },
   
 
  {
    name: "Depot",
    layout: "/admin",
    icon: <MdLock  className="h-6 w-6" />,
    path: "Depot",                  
    component: <Depot />,
  },
  {
    name: "Lot",
    layout: "/admin",
    icon: <MdLock className="h-6 w-6" />,
    path: "Lot",                  
    component: <Lot />,
  },
 
 
  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "profile",
  //   icon: <MdPerson className="h-6 w-6" />,
  //   component: <Profile />,
  // },
  
  {
    name: "Users",
    layout: "/admin",
    icon: <MdFactCheck className="h-6 w-6" />,
    path: "Users",                  
    component: <Users />,
    role: "admin" // Add a role property to this route
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "rtl",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <RTLDefault />,
  // },
];
export default routes;
