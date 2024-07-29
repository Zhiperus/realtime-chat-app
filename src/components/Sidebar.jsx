import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div class="basis-1/2 bg-green">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
