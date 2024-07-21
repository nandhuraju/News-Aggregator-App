// import { Link } from 'react-router-dom';
// import logo from '../assets/images/kbalogo.png'

import { Link } from "react-router-dom";
import Logout from "./Logout";

// import Logout from './Logout';
const Navbar = () => {
  return (
    <>
      <div className="flex justify-between bg-green-300 shadow-md h-20 px-6 py-4 ">
        <div>
          <a
            href="home.html"
            className="text-4xl hover:text-lime-700 font-extrabold text-lime-600"
          >
            TopTalk
          </a>
        </div>

        <div className="flex mx-6">
          <input
            type="text"
            placeholder="Search News..."
            className="w-min px-4 py-2 rounded shadow"
          />
          <button
            className="ml-2 px-4 py-2 bg-lime-600 text-white rounded shadow hover:bg-lime-700"
            // onclick="window.location.href='searchresults.html'"
          >
            Search
          </button>
        </div>

        <div className="mt-2">
        <Link
            to="/home"
            className="text-lime-600 hover:text-lime-700 px-3 py-2  text-base font-semibold"
          >
            Home
          </Link>
          <a
            href="/bookmarks"
            className="text-lime-600 hover:text-lime-700 px-3 py-2  text-base font-semibold"
          >
            Bookmarks
          </a>
          <a
            href="/categories"
            className="text-lime-600 hover:text-lime-700 px-3 py-2  text-base font-semibold"
          >
            Categories
          </a>
          <a
            href="/addnews"
            className="text-lime-600 hover:text-lime-700 px-3 py-2  text-base font-semibold"
          >
            Add News
          </a>
          <Logout />
        </div>
      </div>
    </>
  );
};

export default Navbar;
