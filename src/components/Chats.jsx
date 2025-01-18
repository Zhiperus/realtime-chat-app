import React, { useState, useEffect, useContext } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  function handleSelect(user) {
    dispatch({ type: "CHANGE_USER", payload: user });
  }

  return (
    <div>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            key={chat[0]}
            className="flex items-center gap-3 p-3 cursor-pointer text-whitegreen hover:bg-darkgreen"
            onClick={() => {
              handleSelect(chat[1].userInfo);
            }}
          >
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={chat[1].userInfo.photoURL}
            />
            <div>
              <span className="font-bold text-lg">
                {chat[1].userInfo.displayName}
              </span>
              <p className="text-sm">{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
