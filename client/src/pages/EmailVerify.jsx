import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function EmailVerify() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const { backendUrl, getUserData, isLoggedIn, userData } =
    useContext(AppContext);

  const inputRef = useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value && index < 6) {
      inputRef.current[index + 1].focus();
    }
  };

  //focus input to previous input when backspace is pressed
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value != "" && index < 0) {
      inputRef.current[index - 1].focus();
    }
  };
  //handle paste functionality
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };
  //handle submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //verified account should not have access to verify email page
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

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
        className="absolute left-5 sm:left-20 sm:w-32 cursor-pointer top-5 w-28"
      />
      <form
        className="bg-slate-900 p-8 w-96 text-sm rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white text-center mb-6 font-semibold">
          Email verification otp
        </h1>
        <p className="text-indigo-300 mb-6 text-center">
          Enter the 6 digit code sent your emailId
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                className="bg-[#333A5C] w-12 h-12 rounded-2xl text-white text-center text-xl"
                type="text"
                key={index}
                maxLength="1"
                required
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="bg-gradient-to-r from-indigo-500 to-indigo-900 w-full rounded-2xl text-white p-2 mb-4">
          Verify Email
        </button>
      </form>
    </div>
  );
}
