import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const StyledPaper = styled(Paper)({
  padding: "2rem",
  maxWidth: "400px",
  margin: "2rem auto",
});

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      });
  };

  const signUp = async (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user", user);
        window.location.href = "/";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" align="center">
        Sign In / Sign Up
      </Typography>
      <Box component="form" mt={2}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={signIn}
          style={{ marginTop: "1rem" }}
        >
          Sign In
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={signUp}
          style={{ marginTop: "1rem" }}
        >
          Sign Up
        </Button>
      </Box>
    </StyledPaper>
  );
};

export default SignIn;
