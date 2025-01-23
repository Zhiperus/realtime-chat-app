import React, { useContext, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);

  async function handleSearch() {
    const usersRef = collection(db, "users");

    const q = query(
      usersRef,
      where("displayName_insensitive", "==", username.toLowerCase())
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  }

  function handleKey(e) {
    e.code === "Enter" && handleSearch();
  }

  async function handleSelect() {
    const combinedUID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const response = await getDoc(doc(db, "chats", combinedUID));

      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinedUID), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedUID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedUID + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedUID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedUID + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    setUsername("");
  }

  return (
    <div>
      <div>
        <input
          className="bg-transparent w-full border-b border-graygreen p-3"
          placeholder="Search for a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {error && <span>User not found</span>}
      {user && (
        <div
          onClick={handleSelect}
          className="flex items-center gap-3 p-3 cursor-pointer text-whitegreen hover:bg-darkgreen"
        >
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={user.photoURL}
          />
          <div>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
