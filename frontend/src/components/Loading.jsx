import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div className="h-screen bg-gray-950 flex justify-center items-center">
      <CircularProgress />
    </div>
  );
};

export default Loading;
