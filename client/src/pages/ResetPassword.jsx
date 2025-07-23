import React, { useContext, useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function ResetPassword() {
  const { backendUrl, userData, getUserData, isLoggedIn } =
    useContext(AppContext);

  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const navigate = useNavigate();

  const inputRef = useRef([]);
  //handle otp input
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
  //handle emailsubmit
  const onEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-resetOtp",
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //handle otp sumbit
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  //hanlde password reset
  const onSumbitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
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
      {/* password reset email*/}

      {!isEmailSent && (
        <form
          onSubmit={onEmailSubmit}
          className="bg-slate-900 p-8 w-96 text-sm rounded-lg shadow-lg"
        >
          <h1 className="text-white text-2xl text-center mb-6 font-semibold">
            Reset Password
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter your registered emailId
          </p>
          {/* email */}
          <div className="flex gap-4 border rounded-2xl mb-4 items-center px-3 py-2 bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="person" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="email id"
              name="emailId"
              required
              className="outline-none bg-transparent"
            />
          </div>
          <button
            className="bg-gradient-to-r from-indigo-500 to-indigo-900 w-full 
        rounded-2xl text-white p-2 mb-4"
          >
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 p-8 w-96 text-sm rounded-lg shadow-lg"
          onSubmit={onSubmitOtp}
        >
          <h1 className="text-white text-center mb-6 font-semibold">
            Password Reset otp
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
            Sumbit
          </button>
        </form>
      )}

      {/* new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSumbitNewPassword}
          className="bg-slate-900 p-8 w-96 text-sm rounded-lg shadow-lg"
        >
          <h1 className="text-white text-2xl text-center mb-6 font-semibold">
            New Password
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter your new password
          </p>

          <div className="flex gap-4 border rounded-2xl mb-4 items-center px-3 py-2 bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="person" />
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type="password"
              placeholder="new password"
              name="password"
              required
              className="outline-none bg-transparent"
            />
          </div>
          <button
            className="bg-gradient-to-r from-indigo-500 to-indigo-900 w-full 
        rounded-2xl text-white p-2 mb-4"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
