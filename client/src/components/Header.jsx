import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

export default function Header() {
  const { userData } = useContext(AppContext);
  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <img
        className="w-36 h-36 mb-6 rounded-full"
        src={assets.header_img}
        alt="robot"
        aria-label="robot"
      />
      <h3 className="flex items-center gap-4 text-xl sm:text-3xl mb-4 font-medium">
        Hey {userData ? userData.name : "Developer"}
        <img
          className="w-10"
          src={assets.hand_wave}
          alt="hand-wave"
          aria-label="hand-wave"
        />
      </h3>
      <h1
        className="text-3xl sm:text-2xl mb-6 text-transparent max-w-300 bg-clip-text sm:whitespace-nowrap"
        style={{
          backgroundImage:
            "linear-gradient(to right,#0BF40E ,#0E0BF4 ,#F40E0B)",
        }}
      >
        Welcome to Coder's Empire
      </h1>
      <p className="mb-6 wrap-normal max-w-[500px] text-center">
        Let's start with a quick orietation on how to solve challenging problems
        around us through data and technology
      </p>
      <button
        className="border rounded-full px-6 py-2 
        hover:bg-gradient-to-r from-orange-300 to-blue-400 border-t-blue-500 transition-all
             border-r-red-500 
             border-b-green-500 
             border-l-yellow-500 "
      >
        Get Started
      </button>
    </div>
  );
}
