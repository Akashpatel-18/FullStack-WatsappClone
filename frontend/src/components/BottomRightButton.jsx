import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { BsFillPlusCircleFill } from "react-icons/bs";
import OpenModal from "./OpenModal";

const BottomRightButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-end fixed bottom-8 right-8 text-white">
      <BsFillPlusCircleFill
        onClick={() => setOpen(!open)}
        className="text-5xl shadow-sm focus:outline-none rounded-full border-none hover:text-pink-700 text-pink-600 bg-white cursor-pointer outline-none"
      />
      <OpenModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default BottomRightButton;
