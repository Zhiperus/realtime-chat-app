import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth " });
  }, [message]);

  return (
    <div
      class={`flex gap-5 ${
        message.senderId === currentUser.uid ? "flex-row-reverse" : ""
      }`}
    >
      <div class="flex flex-col items-center">
        <img
          class="h-10 w-10 rounded-full object-cover"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.uid
          }
        />
        <span class="opacity-45">Just Now</span>
      </div>
      <div
        class={`flex flex-col gap-5 ${
          message.senderId === currentUser.uid ? "items-end " : ""
        }`}
      >
        <p
          class={`p-2 rounded-xl w-fit ${
            message.senderId === currentUser.uid
              ? "bg-darkgreen text-whitegreen"
              : "bg-whitegreen"
          }`}
        >
          {message.text}
        </p>
        {message.image && <img src={message.image} />}
      </div>
    </div>
  );
};

export default Message;
