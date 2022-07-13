import {
  Avatar,
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBackIcon, DeleteIcon, HamburgerIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  FormControl,
  Input,
  Stack,
  IconButton,
} from "@chakra-ui/react";
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
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";
import AddUser from "./AddUser";


import Stopwatch from "./RMstopWatch";


export default function FocusRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { r_id } = state;
  const { db, user } = useAuth();
  //const [room, setRoom] = useState("");
  const bottomOfChat = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const q = query(collection(db, "users"));
  const roomRef = doc(db, "groups", r_id);
  const userRef = doc(db, "users", user.uid);
  const [room] = useDocumentData(roomRef);
  const [admin, setAdmin] = useState(false);
  const [allUsers] = useCollectionData(q);
  const users_list = allUsers?.filter((u) => u.uid !== user.uid);

  useEffect(() => {
    setAdmin(false);
    room?.admin.forEach((m) => {
      if (m === user.uid) {
        console.log("is admin", m);
        setAdmin(true);
        return;
      }
    });
    console.log("admin = ", admin);
  }, [admin, room, user.uid]);

  useEffect(() => {
    const colRef = collection(db, `messages/${room?.id}/msg`);
    const q = query(colRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allMessages = [];
      console.log("snap", querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log("q_data", doc.data());
        allMessages.push(doc.data());
      });
      setMessages(allMessages);
      console.log("allMessages", allMessages);
      console.log("messages", messages);
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

  const handleLeave = async (e) => {
    if (room.members.length === 1) {
      handleDelete();
      return;
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
    navigate("/");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
    }
  };

  function topBar() {
    return (
      <Flex
        bg="gray.100"
        h="71px"
        w="100%"
        align="center"
        p={2}
        justifyContent="space-between"
      >
        <IconButton icon={<ArrowBackIcon />} onClick={() => navigate(-1)} />
        <Stack direction="row">
          <Avatar size="sm" src="" marginEnd={3} />
          <Heading size="lg">{room?.name} </Heading>
        </Stack>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <AddUser
              users_list={users_list}
              r_id={r_id}
              roomMembers={room?.members}
            />
            <MenuItem icon={<DeleteIcon />} onClick={handleLeave}>
              Leave room
            </MenuItem>
            {admin && (
              <MenuItem icon={<WarningTwoIcon />}>Delete group</MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    );
  }
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
          borderRadius="lg"
          p={2}
          m={1}
        >
          <Text mb={1} color="orange.700">
            {msg.email}
          </Text>
          <Text>{msg.text}</Text>
        </Flex>
      );
    });

  return (
    <Flex h="93vh" direction="column">
      {topBar()}
      <Flex bg="blue.100" h="71px" w="110%" align="center" p={2}>
        <Flex flex={1}>
          <Center w="100%" h="100%">
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
