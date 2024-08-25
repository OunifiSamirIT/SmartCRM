import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { useEffect, useState } from "react";
import axios from "axios";
// import { PowerBIEmbed } from 'powerbi-client-react';
// import {models} from 'powerbi-client'
const Dashboard = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchFournisseurs = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/fournisseurs');
  //       setFournisseurs(response.data.result);
  //     } catch (error) {
  //       console.error('Error fetching fournisseurs:', error);
  //     }
  //   };

  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/categories');
  //       setCategories(response.data.result);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };

  //   const getUsers = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/users`
  //       );
  //       setUsers(response.data.result); // Assuming your API response has a 'result' array containing users

  //     } catch (error) {
  //       setMsg("Error fetching users.");
  //     }
  //   };

  //   const getData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/articles`
  //       );
  //       setData(response.data.result);

  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   getUsers();
  //   getData();
  //   fetchFournisseurs();
  //   fetchCategories();
  // }, []);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3  grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Fournisseurs"}
          subtitle={fournisseurs.length}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Categories"}
          subtitle={categories.length}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Users"}
          subtitle={users.length}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Your Balance"}
          subtitle={data.length}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"New Tasks"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Projects"}
          subtitle={"$2433"}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* <TotalSpent />
        <PieChartCard /> */}
      </div>
      <iframe
        title="arijpfe"
        width="1140"
        height="541.25"
        src="https://app.powerbi.com/reportEmbed?reportId=eaafc1d7-23fa-44f8-82ca-16c05d019bbd&autoAuth=true&embeddedDemo=true"
        frameborder="0"
        allowFullScreen="true"
      ></iframe>
    </div>
  );
};

export default Dashboard;
