import React, { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const {
      username: { value: username },
      email: { value: email },
      password: { value: password },
    } = e.target;
    const file = e.target[3].files[0];

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, username);

      const uploadTask = uploadBytesResumable(storageRef, file);

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
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName: username,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName: username,
              displayName_insensitive: username.toLowerCase(),
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", response.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div class="flex justify-center items-center h-screen w-screen">
      <div class="flex flex-col bg-graygreen p-10 items-center gap-5 rounded-lg">
        <form
          class="grid grid-cols-1 col-auto grid-rows-6 row-auto gap-2 w-80"
          onSubmit={handleSubmit}
        >
          <h1 class="justify-self-center font-bold text-darkgreen-50 text-3xl">
            ZhiperX Chat
          </h1>
          <span class="justify-self-center m-0">Register</span>
          <input
            class="col-span-1 opacity-30"
            type="text"
            id="username"
            name="username"
            placeholder="username"
          />
          <input
            class="opacity-30"
            type="text"
            id="email"
            name="email"
            placeholder="email"
          />
          <input
            class="opacity-30"
            type="password"
            id="password"
            name="password"
            placeholder="password"
          />
          <input style={{ display: "none" }} type="file" id="file" />
          <label class="justify-self-center mt-4" htmlFor="file">
            <AddPhotoAlternateIcon sx={{ fontSize: 50, color: "darkgreen" }} />
            <span>Add a profile picture</span>
          </label>
          <button type="submit" value="Submit" class="bg-green p-2 rounded-md">
            Sign Up
          </button>
          {error && <span>An error occurred</span>}
        </form>
        <p class="border-t-2 border-green">
          Already have an account?{" "}
          <Link to="/login">
            <a>Login now</a>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
