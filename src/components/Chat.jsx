import React, { useContext, useEffect, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [feeling, setFeeling] = useState("");
  const { data } = useContext(ChatContext);

  const fetchMood = async (messages) => {
    const otherUserMessages = messages.filter(
      (message) => message.senderId === data.user.uid
    );

    try {
      const response = await fetch("http://127.0.0.1:3000/api/mood-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: otherUserMessages.map((message) => message.text),
        }),
      });

      response.json().then((data) => setFeeling(data["feeling"]));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      doc.exists() && fetchMood(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.chatId]);

  if (data.chatId === "null") {
    return (
      <div className="flex flex-col basis-full bg-graygreen justify-center items-center">
        <p className="text-whitegreen text-lg">
          No user selected. Please select a user to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col basis-full bg-graygreen">
      <div className="flex justify-between bg-lime-800 max-h-50 p-3 text-whitegreen">
        <span className="flex gap-5 items-center">
          {data.user?.photoURL && (
            <img
              src={data.user.photoURL}
              className="w-10 h-10 rounded-full"
            ></img>
          )}
          {data.user?.displayName}
        </span>
        {data.chatId !== "null" && (
          <span className="flex items-center">Feeling: {feeling}</span>
        )}
      </div>
      <Messages messages={messages} />
      <Input />
    </div>
  );
};

export default Chat;
