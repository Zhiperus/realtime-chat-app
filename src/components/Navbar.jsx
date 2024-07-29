import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div class="flex items-center justify-between bg-darkgreen p-3 text-whitegreen">
      <span class="font-bold">ZhiperX Chat</span>
      <div class="flex items-center gap-3">
        <img
          class="h-10 w-10 rounded-full object-cover"
          src={currentUser.photoURL}
          alt=""
        />
        <span>{currentUser.displayName}</span>
        <button
          class="bg-graygreen p-1 text-sm"
          onClick={() => {
            signOut(auth);
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
