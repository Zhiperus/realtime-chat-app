import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="flex flex-col basis-full bg-graygreen">
      <div className="bg-lime-800 max-h-50 p-3 text-whitegreen">
        <span className="flex gap-5 items-center">
          {data.user?.photoURL && (
            <img
              src={data.user.photoURL}
              className="w-10 h-10 rounded-full"
            ></img>
          )}
          {data.user?.displayName}
        </span>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
