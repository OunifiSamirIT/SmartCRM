import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import Progress from "components/progress";
import './modal.css';
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const TableComponent = () => {
  // const [data, setData] = useState([]);
  // const [query, setQuery] = useState("");
  // const [page, setPage] = useState(0);
  // const [limit] = useState(10);
  // const [pages, setPages] = useState(0);
  // const [rows, setRows] = useState(0);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [name, setName] = useState("");
  // const [msg, setMsg] = useState("");
  // const [DE_No, setDE_No] = useState("");
  // const [DE_Intitule, setDE_Intitule] = useState("");
  // const [editingDepot, setEditingDepot] = useState(null); // New state for editing depot
  // const navigate = useNavigate();

  // useEffect(() => {
  //   getData();
  // }, [page, query]);

  // const getData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/depots`
  //     );
  //     console.log("Data from server:", response.data); // Log the data received

  //     setData(response.data.result);
  //     setPage(response.data.page);
  //     setPages(response.data.totalPage);
  //     setRows(response.data.totalRows);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // const addData = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:5000/depots", {
  //       DE_No,
  //       DE_Intitule,
  //     });
  //     setData([...data, response.data]);
  //     setDE_No("");
  //     setDE_Intitule("");
  //     setIsModalOpen(false);
  //     setMsg("");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       console.error("Error adding data:", error);
  //       setMsg("Error adding data. Please try again.");
  //     }
  //   }
  // };

  // const updateData = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(`http://localhost:5000/depots/${editingDepot.id}`, {
  //       DE_No,
  //       DE_Intitule,
  //     });
  //     setData(data.map(depot => depot.id === editingDepot.id ? response.data : depot));
  //     setDE_No("");
  //     setDE_Intitule("");
  //     setEditingDepot(null);
  //     setIsModalOpen(false);
  //     setMsg("");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     } else {
  //       console.error("Error updating data:", error);
  //       setMsg("Error updating data. Please try again.");
  //     }
  //   }
  // };

  // const deleteData = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/depots/${id}`);
  //     setData(data.filter(depot => depot.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //   }
  // };

  // const openModal = (depot = null) => {
  //   setDE_No(depot ? depot.DE_No : "");
  //   setDE_Intitule(depot ? depot.DE_Intitule : "");
  //   setEditingDepot(depot);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setDE_No("");
  //   setDE_Intitule("");
  //   setEditingDepot(null);
  //   setIsModalOpen(false);
  //   setMsg("");
  // };

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Depot Number",
  //       accessor: "DE_No",
  //     },
  //     {
  //       Header: "Depot Intitule",
  //       accessor: "DE_Intitule",
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
  //             onClick={() => deleteData(row.original.id)}
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
  //     data,
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
          Data Table
        </div>
        <CardMenu />
      </div>

      <button
        onClick={() => openModal()}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add New Data
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

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="p-2 bg-gray-300 text-gray-700 rounded"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="p-2 bg-gray-300 text-gray-700 rounded"
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add/Edit Data"
        className="modal"
        overlayClassName="overlay z-20"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">{editingDepot ? "Edit Depot" : "Add New Depot"}</h2>
          <form onSubmit={editingDepot ? updateData : addData}>
            <p className="text-center text-red-500 mb-4">{msg}</p>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Depot Number
              </label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={DE_No}
                onChange={(e) => setDE_No(e.target.value)}
                placeholder="Depot Number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Depot Intitule
              </label>
              <input
                type="text"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={DE_Intitule}
                onChange={(e) => setDE_Intitule(e.target.value)}
                placeholder="Depot Intitule"
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
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal> */}
    </Card>
  );
};

export default TableComponent;
