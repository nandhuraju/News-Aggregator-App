import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserType(decodedToken.userType);
    }
  }, []);

  return (
    <div className="flex justify-between bg-green-300 shadow-md h-20 px-6 py-4">
      <div>
        <Link
          to="/home"
          className="text-4xl hover:text-lime-700 font-extrabold text-lime-600"
        >
          TopTalk
        </Link>
      </div>

      <div className="flex mx-6">
        <input
          type="text"
          placeholder="Search News..."
          className="w-min px-4 py-2 rounded shadow"
        />
        <button className="ml-2 px-4 py-2 bg-lime-600 text-white rounded shadow hover:bg-lime-700">
          Search
        </button>
      </div>

      <div className="mt-2">
        <Link
          to="/home"
          className="text-lime-600 hover:text-lime-700 px-3 py-2 text-base font-semibold"
        >
          Home
        </Link>
        <Link
          to="/bookmarks"
          className="text-lime-600 hover:text-lime-700 px-3 py-2 text-base font-semibold"
        >
          Bookmarks
        </Link>
        <Link
          to="/categories"
          className="text-lime-600 hover:text-lime-700 px-3 py-2 text-base font-semibold"
        >
          Categories
        </Link>
        {userType === "admin" && (
          <Link
            to="/addnews"
            className="text-lime-600 hover:text-lime-700 px-3 py-2 text-base font-semibold"
          >
            Add News
          </Link>
        )}
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
