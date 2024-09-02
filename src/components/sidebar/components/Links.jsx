import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks(props) {
  let location = useLocation();
  const { routes } = props;

  // Retrieve the user role from session storage
  const userRole = sessionStorage.getItem("role");

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (shouldDisplayRoute(route, userRole)) {
        return (
          <Link key={index} to={route.layout + route.path}>
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
      return null;
    });
  };

  const shouldDisplayRoute = (route, userRole) => {
    // Always show authentication routes
    if (route.layout === "/auth") return true;

    // Role-based access control
    switch (userRole) {
      case "admin":
        return route.layout === "/admin" && route.name !== "Profil";
      case "agent":
        return ["Commande", "Facture", "Profil"].includes(route.name);
      case "superadmin":
        return [
          "Main Dashboard",
          "Article",
          "Stock",
          "Commande",
          "Facture",
          "Categorie",
          "Fournisseurs",
          "Depot",
          "Lot",
          "Users",
          "Profil"
        ].includes(route.name);
      default:
        return false;
    }
  };

  return createLinks(routes);
}

export default SidebarLinks;