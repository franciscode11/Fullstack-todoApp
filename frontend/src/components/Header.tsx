import React from "react";

const Header = () => {
  return (
    <header className=" flex justify-between items-center px-24 py-4 ">
      <h1 className="text-2xl text-white font-bold">
        TODO<span className="text-blue-500">APP</span>
      </h1>
      <button>
        <img className="h-6" src="logout.svg" alt="logout" />
      </button>
    </header>
  );
};

export default Header;
