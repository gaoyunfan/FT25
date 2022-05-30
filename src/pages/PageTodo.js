import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import OAuthButtonGroup from "./OAuthBtoonGroup";


export default function PageTodo() {
  const { user, logInWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  });


  
return (
    <h1>Hello World !</h1>
  )
};

