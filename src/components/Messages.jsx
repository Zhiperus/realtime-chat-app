import React, { useContext, useState, useEffect } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = ({messages}) => {
  const { data } = useContext(ChatContext);

  return (
    <div className="flex-1 flex flex-col gap-10 p-5 h-5/6 overflow-y-scroll">
      {messages.map((m) => {
        return <Message message={m} key={m.id} />;
      })}
    </div>
  );
};

export default Messages;
