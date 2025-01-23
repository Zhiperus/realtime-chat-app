import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className="basis-1/2 bg-white">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
