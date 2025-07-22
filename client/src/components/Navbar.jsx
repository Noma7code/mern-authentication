import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { backendUrl, userData, setUserData, setIsLoggedIn } =
    useContext(AppContext);
  return (
    <div className="w-full flex justify-between items-center p-4 absolute top-0 sm:p-6">
      <img src={assets.logo} alt="logo" className="w-20 h-20 sm:w-32" />
      {userData ? (
        <div
          className="w-10 h-10 flex justify-center items-center rounded-full
         bg-black text-white  relative group"
        >
          {userData.name[0].toUpperCase()}
          <div
            className="absolute hidden group-hover:block top-0 right-0 rounded 
          p-10 text-black z-10 cursor-pointer"
          >
            <ul className="max-w-fit whitespace-nowrap list-none p-2 m-0 bg-gray-100">
              <li className="py-1 px-2 cursoir-pointer hover:bg-gray-200">
                Verify Email
              </li>
              <li className="py-1 px-2 cursoir-pointer  hover:bg-gray-200 ">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className=" flex border border-t-blue-500 
             border-r-red-500 
             border-b-green-500 
             border-l-yellow-500 p-4 rounded-full items-center px-6 py-2 gap-2 hover:bg-white transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="forward arrow" />
        </button>
      )}
    </div>
  );
}
