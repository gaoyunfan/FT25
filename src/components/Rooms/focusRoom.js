import { Avatar, Button, Center, Flex, Heading, InputRightElement, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FormControl ,Input, useToast, HStack, Stack, IconButton } from "@chakra-ui/react";
import { query, onSnapshot, orderBy,limit,collection, getDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import { useAuth } from "../../hooks/useAuth";
export default function FocusRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { u_id, r_id } = state;
  const { db, user } = useAuth();
  //const [room, setRoom] = useState("");
  const bottomOfChat = useRef();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  /*
  useEffect(() => {
    async function FetchRoom() {
      const docRef = doc(db, "groups", r_id);
      const docSnap = await getDoc(docRef);
      setRoom(docSnap.data());
    }
    FetchRoom();
  }, []);
  */
 useEffect(()=> {
  if (!user)
  {
    navigate("/");
  }
 },[user])

  const [room] = useDocumentData(doc(db, "groups", r_id));
  console.log("romm", room);

  useEffect(() => {
    const colRef = collection(db, `messages/${room?.id}/msg`);
    const q = query(
      colRef,
      orderBy("createdAt"),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allMessages = [];
      console.log("snap", querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log("q_data", doc.data());
        allMessages.push(doc.data());
      });
      setMessages(allMessages);
      console.log("allMessages",allMessages);
      console.log("messages",messages);
    });

    return () => unsubscribe();
  }, [db, room?.id]);



  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("newmessage:", newMessage);
    const colRef = collection(db, `messages/${room.id}/msg`);
    await addDoc(colRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      sentBy: user.uid,
      email: user.email,
    });
    setNewMessage("");
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
    }
  };

   function topBar()  {
    return (
      <Flex bg="gray.100" h="71px" w="100%" align="center" p={2}>
        <IconButton icon={<ArrowBackIcon />} onClick={() => navigate(-1)} />
        <Flex flex={1}>
          <Center  w="100%" h="100%">
            <Avatar size="sm" src="" marginEnd={4} />
            <Heading size="lg">{room?.name}</Heading>
          </Center>
        </Flex>
      </Flex>
    );
  };
  function bottomBar() {
    return (
    <FormControl p={3} onSubmit={sendMessage} as="form">
      <Input
        placeholder="Type a message..."
        autoComplete="off"
        onChange={(e) => typingHandler(e)}
        value={newMessage}
      />
      <Button type="submit" hidden>
        Submit
      </Button>
    </FormControl>
    );
  };
  
  useEffect(() => { 
  setTimeout(
    bottomOfChat.current.scrollIntoView({
    behavior: "smooth",
    block: 'start',
  }), 100)}
, [messages])

const getMessages = () =>
    messages?.map((msg, index) => {
      const sender = msg.sentBy === user.uid;
      return (
        <Flex key={index+1} alignSelf={sender ? "flex-end" : "flex-start"} bg={sender ? "green.100" : "blue.100"} direction="column" w="fit-content" minWidth="100px" borderRadius="lg" p={2} m={1}>
          <Text mb={1} color="orange.700">{msg.email}</Text>
          <Text>{msg.text}</Text>
        </Flex>
      )
    })

  return (
  <Flex h="93vh" direction="column">
  {topBar()}
  <Flex
        flex={1}
        direction="column"
        pt={4}
        mx={5}
        overflowX="scroll"
        sx={{ scrollbarWidth: "none" }}
      >
      {getMessages()}
        <div ref={bottomOfChat}></div>
      </Flex>
  {bottomBar()}
  </Flex>

  );
}