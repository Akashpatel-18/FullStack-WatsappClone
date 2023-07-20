import React from "react";
import "tailwindcss/tailwind.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

const BottomCenterButton = ({ open, setOpen }) => {
  return (
    <>
      <div className="sm:hidden fixed bottom-7 left-1/2 transform -translate-x-1/2">
        <AiOutlineCloseCircle
          onClick={() => setOpen(!open)}
          className="text-[56px] text-pink-600 bg-gray-900 rounded-full ring-0 outline-none border-none cursor-pointer focus:outline-none font-thin shadow-sm shadow-pink-800"
        />
      </div>
    </>
  );
};

export default BottomCenterButton;
