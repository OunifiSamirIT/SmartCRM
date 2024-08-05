// import CardMenu from "components/card/CardMenu";
// import Card from "components/card";
// import { DiApple } from "react-icons/di";
// import { DiAndroid } from "react-icons/di";
// import { DiWindows } from "react-icons/di";

// import React, { useMemo } from "react";
// import {
//   useGlobalFilter,
//   usePagination,
//   useSortBy,
//   useTable,
// } from "react-table";
// import Progress from "components/progress";

// const Tablecategorie = () => {




//   return (
//     <Card extra={"w-full h-full p-4 sm:overflow-x-auto"}>
//     <div className="relative flex items-center justify-between">
//       <div className="text-xl font-bold text-navy-700 dark:text-white">
//         Categorie Table
//       </div>
//       <CardMenu />
//     </div>

   

//     <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
//       <table  className="w-full">
//         <thead>
         
//             <tr >
              
//                 <th
                 
//                   className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
//                 >
//                   <p className="text-xs tracking-wide text-gray-600">
                    
//                   </p>
//                 </th>
             
//             </tr>
        
//         </thead>
//         <tbody >
         
//         </tbody>
//       </table>
//     </div>
   
//     </Card>
//   );
// };

// export default Tablecategorie;
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import './modal.css';

Modal.setAppElement("#root");

const Tablecategorie = () => {
  // const [categories, setCategories] = useState([]);
  // const [query, setQuery] = useState("");
  // const [page, setPage] = useState(0);
  // const [limit] = useState(10);
  // const [pages, setPages] = useState(0);
  // const [rows, setRows] = useState(0);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [name, setName] = useState("");
  // const [msg, setMsg] = useState("");
  // const [editingCategory, setEditingCategory] = useState(null);

  // useEffect(() => {
  //   getCategories();
  // }, [page, query]);

  // const getCategories = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/categories");
  //     setCategories(response.data.result);
  //     setPage(response.data.page);
  //     setPages(response.data.totalPage);
  //     setRows(response.data.totalRows);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  // const addCategory = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:5000/categories", {
  //       name,
  //     });
  //     setCategories([...categories, response.data]);
  //     setName("");
  //     setIsModalOpen(false);
  //     setMsg("");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       console.error("Error adding category:", error);
  //       setMsg("Error adding category. Please try again.");
  //     }
  //   }
  // };

  // const updateCategory = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(`http://localhost:5000/categories/${editingCategory.id}`, {
  //       name,
  //     });
  //     setCategories(categories.map(category => category.id === editingCategory.id ? response.data : category));
  //     setName("");
  //     setEditingCategory(null);
  //     setIsModalOpen(false);
  //     setMsg("");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       console.error("Error updating category:", error);
  //       setMsg("Error updating category. Please try again.");
  //     }
  //   }
  // };

  // const deleteCategory = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/categories/${id}`);
  //     setCategories(categories.filter(category => category.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //   }
  // };

  // const openModal = (category = null) => {
  //   setName(category ? category.name : "");
  //   setEditingCategory(category);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setName("");
  //   setEditingCategory(null);
  //   setIsModalOpen(false);
  //   setMsg("");
  // };

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Category Name",
  //       accessor: "name",
  //     },
  //     {
  //       Header: "Actions",
  //       Cell: ({ row }) => (
  //         <div className="flex items-center">
  //           <button
  //             onClick={() => openModal(row.original)}
  //             className="mr-2 p-2 bg-green-500 text-white rounded"
  //           >
  //             Update
  //           </button>
  //           <button
  //             onClick={() => deleteCategory(row.original.id)}
  //             className="p-2 bg-red-500 text-white rounded"
  //           >
  //             Delete
  //           </button>
  //         </div>
  //       ),
  //     },
  //   ],
  //   []
  // );

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   prepareRow,
  //   page: tablePage,
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
  //     data: categories,
  //     initialState: { pageIndex: 0 },
  //   },
  //   useGlobalFilter,
  //   useSortBy,
  //   usePagination
  // );

  // const { pageIndex, pageSize, globalFilter } = state;

  return (
    <Card extra={"w-full h-full p-4 sm:overflow-x-auto"}>
      {/* <div className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Category Table
        </div>
        <CardMenu />
      </div>

      <button
        onClick={() => openModal()}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add New Category
      </button>

      <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {tablePage.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add/Edit Category"
        className="modal"
        overlayClassName="overlay z-20"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
          <form onSubmit={editingCategory ? updateCategory : addCategory}>
            <p className="text-center text-red-500 mb-4">{msg}</p>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Category Name
              </label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                required
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
      </Modal> */}
    </Card>
  );
};

export default Tablecategorie;
