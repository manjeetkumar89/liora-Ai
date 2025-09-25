// Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-gray-300 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
