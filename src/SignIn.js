import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error message
  const auth = getAuth();

  const signIn = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        window.location.href = "/";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("Incorrect email and/or password"); // Set error message
      });
  };

  const signUp = async (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        window.location.href = "/";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage); // Set error message
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      signIn(e);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded p-6 shadow-md mt-10 mt-20 sm:mt-24">
      <h1 className="text-2xl text-center mb-4">Sign In / Sign Up</h1>
      {error && ( // Render error message if there is an error
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          onClick={signIn}
        >
          Sign In
        </button>
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          onClick={signUp}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignIn;
