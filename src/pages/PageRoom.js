import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import ChatRooms from "../components/ChatRooms/chatRooms";


export default function PageRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  });


  
return (
  <ChatRooms />
  )
};

