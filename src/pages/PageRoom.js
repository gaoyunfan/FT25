import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import OAuthButtonGroup from "./OAuthBtoonGroup";
import ChatRooms from "../components/Rooms/chatRooms"


export default function PageRoom() {
  const { user, logInWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  });


  
return (
  <ChatRooms />
  )
};

