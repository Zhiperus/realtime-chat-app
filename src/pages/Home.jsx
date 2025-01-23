import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function Home() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex shadow-xl rounded-lg w-8/12 h-5/6 overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
