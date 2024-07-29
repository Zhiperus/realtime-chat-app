import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function Home() {
  return (
    <div class="flex h-screen justify-center items-center">
      <div class="flex border-2 border-teal-700 rounded-lg w-8/12 h-5/6 overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
