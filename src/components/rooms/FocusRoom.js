import {
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowBackIcon,
  DeleteIcon,
  HamburgerIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import { FormControl, Input, IconButton } from "@chakra-ui/react";

import {
  query,
  onSnapshot,
  orderBy,
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";

import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";
import SendImage from "./SendImage";

import Stopwatch from "./RMstopWatch";
import RoomInfo from "./RoomInfo";

export default function FocusRoom() {
  const { state } = useLocation();
  const { r_id } = state;
  const navigate = useNavigate();
  const toast = useToast();
  const { db, user } = useAuth();
  //const [room, setRoom] = useState("");
  const bottomOfChat = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const q = query(collection(db, "users"));
  const roomRef = doc(db, "groups", r_id);
  const userRef = doc(db, "users", user.uid);
  const [room] = useDocumentData(roomRef);
  const [allUsers] = useCollectionData(q);
  const members_list = allUsers?.filter((u) => room.members.includes(u.uid));
  const users_list = allUsers?.filter((u) => u.uid !== user.uid);
  console.log("members_list", members_list);
  console.log("users_list", users_list);


  useEffect(() => {
    setAdmin(false);
    room?.admin.forEach((m) => {
      if (m === user.uid) {
        setAdmin(true);
        return;
      }
    });
  }, [admin, room, user.uid]);

  useEffect(() => {
    const colRef = collection(db, `messages/${room?.id}/msg`);
    const q = query(colRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allMessages = [];
      querySnapshot.forEach((doc) => {
        allMessages.push(doc.data());
      });
      setMessages(allMessages);
    });

    return () => unsubscribe();
  }, [db, room?.id]);

  const sendMessage = async (e, url) => {
    e.preventDefault();

    const colRef = collection(db, `messages/${room.id}/msg`);
    await addDoc(colRef, {
      imageUrl: url,
      text: newMessage,
      createdAt: serverTimestamp(),
      sentBy: user.uid,
      email: user.email,
    });
    setNewMessage("");
    setInputValue("");
  };

  const handleLeave = async (e) => {
    if (room.members.length === 1) {
      return handleDelete();
    }
    if (admin) {
      await updateDoc(roomRef, {
        admin: arrayRemove(user.uid),
      });
      if (room.admin.length === 0) {
        const index = room.members.findIndex((m) => m !== user.uid);
        await updateDoc(roomRef, {
          admin: arrayUnion(room.members[index]),
        });

        console.log("Change admin to:", room.members[index]);
      }
    }
    await updateDoc(userRef, { rooms: arrayRemove(r_id) });
    console.log("remove from user groups");
    await updateDoc(roomRef, { members: arrayRemove(user.uid) });
    toast({
      title: "Room quitted.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    navigate("/");
  };

  const handleDelete = async (e) => {
    room.members.forEach(async (memb) => {
      const memberRef = doc(db, "users", memb);
      await updateDoc(memberRef, { rooms: arrayRemove(r_id) });
    });
    await deleteDoc(roomRef);
    toast({
      title: "Room deleted.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    navigate("/");
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    setInputValue(e.target.value);
    if (!typing) {
      setTyping(true);
    }
  };

  

  function topBar() {
    return (
      <Flex gap="25px" bg="gray.100" h="71px" w="100%" align="center" p={2}>
        <IconButton icon={<ArrowBackIcon />} onClick={() => navigate(-1)} />
        <RoomInfo room={room} members_list={members_list} allUsers={allUsers}/>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            
            <MenuItem icon={<DeleteIcon />} onClick={handleLeave}>
              Leave room
            </MenuItem>
            {admin && (
              <MenuItem icon={<WarningTwoIcon />} onClick={handleDelete}>
                Delete group
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    );
  }
  function bottomBar() {
    return (
      <FormControl p={2} onSubmit={(e) => sendMessage(e, "")} as="form">
        <Flex>
          <Input
            size="lg"
            placeholder="Type a message and hit enter to send"
            autoComplete="off"
            onChange={(e) => typingHandler(e)}
            value={inputValue}
          />
          <Button type="submit" hidden>
            Submit
          </Button>
          <SendImage
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
        </Flex>
      </FormControl>
    );
  }

  useEffect(() => {
    setTimeout(
      bottomOfChat.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
      100
    );
  }, [messages]);

  const getMessages = () =>
    messages?.map((msg, index) => {
      const sender = msg.sentBy === user.uid;
      return (
        <Flex
          key={index + 1}
          alignSelf={sender ? "flex-end" : "flex-start"}
          bg={sender ? "green.100" : "blue.100"}
          direction="column"
          w="fit-content"
          minWidth="100px"
          maxWidth="45%"
          borderRadius="lg"
          p={2}
          m={1}
        >
          <Text mb={1} color="orange.700">
            {msg.email}
          </Text>
          {msg.imageUrl && (
            <a href={msg.imageUrl} target="_blank" rel="noreferrer">
              <Image boxSize="320px" objectFit="contain" src={msg.imageUrl} />
            </a>
          )}
          <Text>{msg.text}</Text>
        </Flex>
      );
    });

  return (
    <Flex h="92vh" direction="column">
      {topBar()}
      <Flex bg="blue.100" h="71px" w="100%" align="center" p={2}>
        <Flex flex={1}>
          <Center w="98%" h="100%">
            <Heading size="lg">
              <Stopwatch />{" "}
            </Heading>
          </Center>
        </Flex>
      </Flex>

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
