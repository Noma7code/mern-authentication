import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="flex justify-center items-center min-h-screen
     bg-gradient-to-r from-gray-400 to-blue-300 px-6 sm:px-0"
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        aria-label="logo"
        className="absolute left-5 
        sm:left-20 sm:w-32 cursor-pointer top-5 w-28"
      />
      <div className="bg-slate-900 rounded-lg p-10 w-full shadow-lg text-indigo-300 text-sm sm:w-96">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          {state === "Sign up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-sm text-center mb-6">
          {state === "Sign up"
            ? "Create your account"
            : "Login into your acccount"}
        </p>
        {/* login form */}
        <form>
          {/* name */}
          {state === "Sign up" && (
            <div className="flex gap-4 border rounded-2xl mb-4 items-center px-3 py-2 bg-[#333A5C] text-white">
              <img src={assets.person_icon} alt="person" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="full name"
                name="fullname"
                required
                className="outline-none bg-transparent"
              />
            </div>
          )}
          {/* email */}
          <div className="flex gap-4 border rounded-2xl mb-4 items-center px-3 py-2 bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="person" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="email id"
              name="emailId"
              required
              className="outline-none bg-transparent"
            />
          </div>
          {/* password */}
          <div className="flex gap-4 border rounded-2xl mb-4 items-center px-3 py-2 bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="person" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="text"
              placeholder="password"
              name="password"
              required
              className="outline-none bg-transparent"
            />
          </div>
          {/* forgot password */}
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-400 cursor-pointer"
          >
            Forgot Password ?
          </p>
          {/* signup button */}
          <button className="bg-gradient-to-r from-indigo-500 to-indigo-900 w-full rounded-2xl text-white p-2 mb-4">
            {state}
          </button>
        </form>
        {state === "Sign up" ? (
          <p className="text-gray-400 text-center mt-4">
            Already have an account ? {"  "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center mt-4">
            {" "}
            Don't have an account ? {"  "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-400 underline cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
