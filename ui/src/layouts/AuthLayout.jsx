import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
const AuthLayout = () => {
  return (
    <>
      <div className="bg-green-100 flex flex-col min-h-screen justify-between">
        <div className="flex justify-between bg-green-300 shadow-md h-20 px-6 py-4 ">
          <div>
            <a
              href="home.html"
              className="text-4xl hover:text-lime-700 font-extrabold text-lime-600"
            >
              TopTalk
            </a>
          </div>

          <div className="mt-2">
            <a
              href="/login"
              className="text-lime-600 hover:text-lime-700 px-3 py-2  text-base font-semibold"
            >
              Login
            </a>
            <a
              href="/sign-up"
              className="text-lime-600 hover:text-lime-700 px-3 py-2 text-base font-semibold"
            >
              Signup
            </a>
          </div>
        </div>

        <div className="mx-auto py-10  text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to TopTalk,The news aggregator app!
          </h1>
          <p className="mt-2 text-gray-600">
            Stay updated with latest news around the world, personalized just
            for you!!.
          </p>
        </div>

        <Outlet />
        <ToastContainer />
        <Footer />
      </div>
    </>
  );
};

export default AuthLayout;
