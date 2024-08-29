import React, { useEffect, useState } from "react";
import axios from "axios";
import Widget from "components/widget/Widget";
import { MdBarChart, MdDashboard, MdInventory } from "react-icons/md";

const Dashboard = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // Renamed from 'data' to 'products' for clarity

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fournisseursRes, categoriesRes, usersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/fournisseurs/getfournisseur'),
          axios.get('http://localhost:5000/categories/getcategory'),
          axios.get('http://localhost:5000/auth/'),
          axios.get('http://localhost:5000/products/getProduct') // Ensure this endpoint returns the products array
        ]);
  
        setFournisseurs(fournisseursRes.data || []);  // No need to access .result if data is returned directly
        setCategories(categoriesRes.data || []);
        setUsers(usersRes.data || []);
        setProducts(productsRes.data || []);  // Ensure this is correct
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 mb-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title="Fournisseurs"
          subtitle={fournisseurs.length}
        />
        <Widget
          icon={<MdBarChart className="h-6 w-6" />}
          title="Categories"
          subtitle={categories.length}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title="Users"
          subtitle={users.length}
        />
        <Widget
          icon={<MdInventory className="h-7 w-7" />} // New icon for products
          title="Products"
          subtitle={products.length} // Display the count of products
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title="Your Balance"
          subtitle={products.length} // Example: You can customize this subtitle based on your data
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title="New Tasks"
          subtitle="145"
        />
      </div>

      <iframe
        title="arijpfe"
        width="1020"
        height="541.25"
        
        src="https://app.powerbi.com/reportEmbed?reportId=eaafc1d7-23fa-44f8-82ca-16c05d019bbd&autoAuth=true&embeddedDemo=true"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default Dashboard;
