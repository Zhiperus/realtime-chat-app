import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const {
      email: { value: email },
      password: { value: password },
    } = e.target;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div class="flex justify-center items-center h-screen w-screen">
      <div class="flex flex-col bg-graygreen p-10 items-center rounded-lg">
        <form
          onSubmit={handleSubmit}
          class="grid grid-cols-1 col-auto grid-rows-6 row-auto gap-2 w-80"
        >
          <h1 class="justify-self-center font-bold text-darkgreen-50 text-3xl">
            ZhiperX Chat
          </h1>
          <span class="justify-self-center p-0">Login</span>
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
          <button class="bg-green p-2 rounded-md">Sign In</button>
        </form>
        <p class="border-t-2 border-green">
          Don't have an account?{" "}
          <Link to="/register">
            <a>Register now</a>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
