import React, { useContext, useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  async function handleSend() {
    console.log(image);
    if (!text.replace(/\s/g, "").length && image === "") return;

    if (image !== "") {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                image: downloadURL,
                senderId: currentUser.uid,
                date: Timestamp.now(),
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage("");
  }

  console.log(image);

  return (
    <div
      className="flex justify-between bg-whitegreen p-0"
      onKeyDown={(e) => {
        if (e.code === "Enter") handleSend();
      }}
    >
      <input
        className="w-9/12 p-5 bg-transparent outline-none"
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="flex gap-5 p-5 items-center">
        <input type="file" id="file" style={{ display: "none" }} />
        <label className="cursor-pointer" htmlFor="file">
          <AttachFileIcon />
        </label>
        <input
          type="file"
          id="image"
          style={{ display: "none" }}
          onChange={(e) => {
            if (typeof e.target.files[0] === "undefined") return;
            setImage(e.target.files[0]);
          }}
        />
        <label className="cursor-pointer" htmlFor="image">
          <div className="absolute bottom-36 right-72">
            {image !== "" && (
              <img
                height={100}
                width={100}
                src={URL.createObjectURL(image)}
              ></img>
            )}
          </div>
          <ImageIcon />
        </label>
        <button className="bg-graygreen" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
