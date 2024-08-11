import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();
  
  const { routes } = props;

  // Retrieve the user role from session storage
  const userRole = sessionStorage.getItem("role"); // Assume the role is stored in session storage

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // Check if the route should be shown based on the user's role
      const shouldDisplayRoute = 
        route.layout === "/admin" || 
        route.layout === "/auth" || 
        route.layout === "/rtl";

      if (shouldDisplayRoute) {
        // Role-based route filtering
        if (
          userRole === "admin" || // Admin sees all routes
          (userRole === "agent" && (route.path === "Facture" || route.path === "Commande")) || // Agent sees only Facture and Commande
          (userRole === "superadmin" && (
            route.path === "Facture" || 
            route.path === "Main Dashboard" ||
            route.path === "Article" || 
            route.path === "Stock" || 
            route.path === "Categorie" || 
            route.path === "Fournisseurs" ||
            route.path === "Depot" || 
            route.path === "Lot" 
          )) // Superadmin sees only Commande and Users
        ) {
          return (
            <Link key={index} to={route.layout + "/" + route.path}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  key={index}
                >
                  <span
                    className={`${
                      activeRoute(route.path)
                        ? "font-bold text-brand-500 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${
                      activeRoute(route.path)
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.name}
                  </p>
                </li>
                {activeRoute(route.path) ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
            </Link>
          );
        }
      }

      return null;
    });
  };

  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;
