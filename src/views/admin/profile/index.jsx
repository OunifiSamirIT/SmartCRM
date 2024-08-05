// import Banner from "./components/Banner";
// import General from "./components/General";
// import Notification from "./components/Notification";
// import Project from "./components/Project";
// import Storage from "./components/Storage";
// import Upload from "./components/Upload";

// const ProfileOverview = () => {
//   return (
//     <div className="flex w-full flex-col gap-5">
//       <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
//         <div className="col-span-4 lg:!mb-0">
//           <Banner />
//         </div>

//         {/* <div className="col-span-3 lg:!mb-0">
//           <Storage />
//         </div>

//         <div className="z-0 col-span-5 lg:!mb-0">
//           <Upload />
//         </div> */}
//       </div>
//       {/* all project & ... */}

//       {/* <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
//         <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
//           <Project />
//         </div>
//         <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
//           <General />
//         </div>

//         <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
//           <Notification />
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default ProfileOverview;
import avatar from "assets/img/avatars/avatar11.png";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
// import { toast } from "react-toastify";

const Banner = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getUsers();
  }, [page, query]);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users?page=${page}&limit=${limit}&q=${query}`
      );
      setUsers(response.data.result); // Assuming your API response has a 'result' array containing users
      setPages(response.data.pages);
      setRows(response.data.total);
    } catch (error) {
      setMsg("Error fetching users.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      getUsers();
    } catch (error) {
      setMsg("Error deleting user.");
    }
  };

  const toggleUserStatus = async (userId, action) => {
    try {
      const endpoint = action === "block" ? "block" : "activate";
      await axios.put(`http://localhost:5000/users/${userId}/${endpoint}`);
      getUsers();
      const actionMsg = action === "block" ? "blocked" : "activated";
      // toast.success(`User ${actionMsg} successfully`);
    } catch (error) {
      setMsg(`Error ${action}ing user.`);
    }
  };

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-wrap gap-x-5 ">
      {users.map((user) => (
        <Card key={user.id} extra={"items-center gap-x-5 w-[32%] h-full p-[16px] bg-cover"}>
          {/* Background and profile */}
          <div
            className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
            style={{ backgroundImage: `url(${banner})` }}
          >
            <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
              <img className="h-full w-full rounded-full" src={avatar} alt="" />
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {user.firstname} {user.lastname}
            </h4>
            <p className="text-base font-normal text-gray-600">{user.role}</p>

            {/* Example: Display other user data like posts, followers, following */}
            <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
                <p className="text-sm font-normal text-gray-600">Posts</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">9.7K</p>
                <p className="text-sm font-normal text-gray-600">Followers</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">434</p>
                <p className="text-sm font-normal text-gray-600">Following</p>
              </div>
            </div>

            {/* Example: Add buttons to delete or toggle user status */}
            <div className="flex gap-4">
              <button
                onClick={() => deleteUser(user.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => toggleUserStatus(user.id, user.isBlocked ? "activate" : "block")}
                className={`px-4 py-2 ${user.isBlocked ? 'bg-green-500' : 'bg-yellow-500'} text-white rounded-md hover:bg-green-600`}
              >
                {user.isBlocked ? 'Activate' : 'Block'}
              </button>
            </div>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      {/* <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={changePage}
        containerClassName={"pagination"}
        activeClassName={"active"}
      /> */}
    </div>
  );
};

export default Banner;
