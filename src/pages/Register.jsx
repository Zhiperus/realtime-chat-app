import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";

function Register() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const {
      username: { value: username },
      email: { value: email },
      password: { value: password },
    } = e.target;

    setLoading(true);
    setError(false);

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, username);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          setError(true);
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
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
        }
      );
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br via-green-400 to-teal-500">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full transform transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          ZhiperX Chat
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          <div className="relative flex justify-center">
            {image ? (
              <>
                <Avatar
                  src={URL.createObjectURL(image)}
                  sx={{ width: 100, height: 100 }}
                />
                <button
                  className="absolute left-56 bg-red-200 p-[1px] rounded-full"
                  onClick={() => setImage(null)}
                >
                  <ClearIcon />
                </button>
              </>
            ) : (
              <>
                <input
                  style={{ display: "none" }}
                  name="file"
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label
                  htmlFor="file"
                  className="flex items-center gap-2 cursor-pointer mt-4 text-teal-500 font-medium hover:underline"
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: 24 }} />
                  Add a profile picture
                </label>
              </>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm">
              Something went wrong. Please try again.
            </p>
          )}
          <button
            type="submit"
            className={`w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transform hover:scale-105 transition-all duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-500 font-medium hover:underline"
          >
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
