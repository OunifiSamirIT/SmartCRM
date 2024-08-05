// import CardMenu from "components/card/CardMenu";
// import Card from "components/card";
// import {
//   useGlobalFilter,
//   usePagination,
//   useSortBy,
//   useTable,
// } from "react-table";
// import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
// import { useMemo } from "react";
// import Progress from "components/progress";
// const ComplexTable = (props) => {
//   const { columnsData, tableData } = props;

//   const columns = useMemo(() => columnsData, [columnsData]);
//   const data = useMemo(() => tableData, [tableData]);

//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     initialState,
//   } = tableInstance;
//   initialState.pageSize = 5;

//   return (
//     <Card extra={"w-full h-full p-4 sm:overflow-x-auto"}>
//       <div class="relative flex items-center justify-between">
//         <div class="text-xl font-bold text-navy-700 dark:text-white">
//           Complex Table
//         </div>
//         <CardMenu />
//       </div>

//       <div class="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
//         <table {...getTableProps()} className="w-full">
//           <thead>
//             {headerGroups.map((headerGroup, index) => (
//               <tr {...headerGroup.getHeaderGroupProps()} key={index}>
//                 {headerGroup.headers.map((column, index) => (
//                   <th
//                     {...column.getHeaderProps(column.getSortByToggleProps())}
//                     key={index}
//                     className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
//                   >
//                     <p className="text-xs tracking-wide text-gray-600">
//                       {column.render("Header")}
//                     </p>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {page.map((row, index) => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()} key={index}>
//                   {row.cells.map((cell, index) => {
//                     let data = "";
//                     if (cell.column.Header === "NAME") {
//                       data = (
//                         <p className="text-sm font-bold text-navy-700 dark:text-white">
//                           {cell.value}
//                         </p>
//                       );
//                     } else if (cell.column.Header === "STATUS") {
//                       data = (
//                         <div className="flex items-center gap-2">
//                           <div className={`rounded-full text-xl`}>
//                             {cell.value === "Approved" ? (
//                               <MdCheckCircle className="text-green-500" />
//                             ) : cell.value === "Disable" ? (
//                               <MdCancel className="text-red-500" />
//                             ) : cell.value === "Error" ? (
//                               <MdOutlineError className="text-orange-500" />
//                             ) : null}
//                           </div>
//                           <p className="text-sm font-bold text-navy-700 dark:text-white">
//                             {cell.value}
//                           </p>
//                         </div>
//                       );
//                     } else if (cell.column.Header === "DATE") {
//                       data = (
//                         <p className="text-sm font-bold text-navy-700 dark:text-white">
//                           {cell.value}
//                         </p>
//                       );
//                     } else if (cell.column.Header === "PROGRESS") {
//                       data = <Progress width="w-[68px]" value={cell.value} />;
//                     }
//                     return (
//                       <td
//                         className="pt-[14px] pb-[18px] sm:text-[14px]"
//                         {...cell.getCellProps()}
//                         key={index}
//                       >
//                         {data}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default ComplexTable;
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import Progress from "components/progress";
import './modal.css';
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root"); // Make sure to set the app element for accessibility

const ComplexTable = () => {
  // const [data, setData] = useState([]);
  //  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // const [idToUpdate, setIdToUpdate] = useState(null); // State to hold ID for update
  // const [firstname, setFirstname] = useState("");
  // const [lastname, setLastname] = useState("");
  // const [email, setEmail] = useState("");
  // const [numTel, setNumTel] = useState("");
  // const [adresse, setAdresse] = useState("");
  // const [msg, setMsg] = useState("");// Ensure you have imported and set up react-router-dom correctly

  // // Define columns for the table
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Firstname",
  //       accessor: "firstname", // accessor is the "key" in the data
  //     },
  //     {
  //       Header: "Lastname",
  //       accessor: "lastname",
  //     },
  //     {
  //       Header: "Email",
  //       accessor: "email",
  //     },
  //     {
  //       Header: "NumTel",
  //       accessor: "numTel",
  //     },
  //     {
  //       Header: "Adresse",
  //       accessor: "adresse",
  //     },
  //     {
  //       Header: "Actions",
  //       Cell: ({ row }) => (
  //         <div className="space-x-2">
  //           <button
  //             onClick={() => handleUpdate(row.original)}
  //             className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
  //           >
  //             Update
  //           </button>
  //           <button
  //             onClick={() => handleDelete(row.original.id)}
  //             className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
  //           >
  //             Delete
  //           </button>
  //         </div>
  //       ),
  //     },
  //   ],
  //   []
  // );

  // // React Table hooks
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   prepareRow,
  //   page,
  //   nextPage,
  //   previousPage,
  //   canPreviousPage,
  //   canNextPage,
  //   pageOptions,
  //   setGlobalFilter,
  //   state,
  // } = useTable(
  //   {
  //     columns,
  //     data,
  //     initialState: { pageIndex: 0 },
  //   },
  //   useGlobalFilter,
  //   useSortBy,
  //   usePagination
  // );

  // const { pageIndex, pageSize, globalFilter } = state;

  // useEffect(() => {
  //   getFournisseurs();
  // }, [pageIndex, globalFilter]); // Fetch data when pageIndex or globalFilter changes

  // const getFournisseurs = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/fournisseurs?search_query=${globalFilter}&page=${pageIndex}&limit=${pageSize}`
  //     );
  //     setData(response.data.result);
  //     setMsg(""); // Clear any previous error messages
  //   } catch (error) {
  //     console.error("Error fetching Fournisseurs:", error);
  //     setMsg("Error fetching Fournisseurs. Please try again."); // Display error message
  //   }
  // };

  // const saveFournisseur = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:5000/fournisseurs", {
  //       firstname,
  //       lastname,
  //       email,
  //       numTel,
  //       adresse,
  //     });
  //     setData([...data, response.data]);
  //     setFirstname("");
  //     setLastname("");
  //     setEmail("");
  //     setNumTel("");
  //     setAdresse("");
  //     setMsg("");
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     }
  //   }
  // };





  // const handleUpdate = (fournisseur) => {
  //   setIdToUpdate(fournisseur.id);
  //   setFirstname(fournisseur.firstname);
  //   setLastname(fournisseur.lastname);
  //   setEmail(fournisseur.email);
  //   setNumTel(fournisseur.numTel);
  //   setAdresse(fournisseur.adresse);
  //   setIsUpdateModalOpen(true);
  // };

  // const updateFournisseur = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/fournisseurs/${idToUpdate}`,
  //       {
  //         firstname,
  //         lastname,
  //         email,
  //         numTel,
  //         adresse,
  //       }
  //     );
  //     const updatedFournisseur = response.data;
  //     setData(data.map((f) => (f.id === updatedFournisseur.id ? updatedFournisseur : f)));
  //     setFirstname("");
  //     setLastname("");
  //     setEmail("");
  //     setNumTel("");
  //     setAdresse("");
  //     setMsg("");
  //     setIsUpdateModalOpen(false);
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     }
  //   }
  // };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this fournisseur?")) {
  //     try {
  //       await axios.delete(`http://localhost:5000/fournisseurs/${id}`);
  //       setData(data.filter((f) => f.id !== id));
  //     } catch (error) {
  //       console.error("Error deleting Fournisseur:", error);
  //       setMsg("Error deleting Fournisseur. Please try again.");
  //     }
  //   }
  // };
  return (
    <Card extra={"w-full h-full p-4 sm:overflow-x-auto"}>
      {/* <div className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
Liste Fournisseurs        </div>

<button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 rounded-md p-2 text-white "

        >
          Ajouter Fournisseur 

        </button>
      </div> */}

      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add New Fournisseur
      </button> */}
{/* 
      <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td className="border-b border-gray-200 pb-[10px] " {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add New Fournisseur"
        className="modal "
        overlayClassName="overlay z-20"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Fournisseur</h2>
          <form onSubmit={saveFournisseur}>
            <p className="text-center text-red-500 mb-4">{msg}</p>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Firstname</label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Firstname"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Lastname</label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Lastname"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">NumTel</label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={numTel}
                onChange={(e) => setNumTel(e.target.value)}
                placeholder="NumTel"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Adresse</label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
  isOpen={isUpdateModalOpen}
  onRequestClose={() => setIsUpdateModalOpen(false)}
  contentLabel="Update Fournisseur"
  className="modal"
  overlayClassName="overlay"
>
  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
    <h2 className="text-2xl font-bold mb-4">Update Fournisseur</h2>
    <form onSubmit={updateFournisseur}>
      <p className="text-red-500 mb-4">{msg}</p>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Firstname</label>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Firstname"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Lastname</label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Lastname"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Email"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">NumTel</label>
        <input
          type="text"
          value={numTel}
          onChange={(e) => setNumTel(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="NumTel"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Adresse</label>
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Adresse"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</Modal> */}

    </Card>
  );
};

export default ComplexTable;
