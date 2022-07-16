import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  useDisclosure,
  Avatar,
  Heading,
  IconButton,
  Text,
  Button,
  Toast,
} from "@chakra-ui/react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { TbFriends } from "react-icons/tb";
import { useEffect, useState } from "react";

export default function RoomInfo(props) {
  const { user, db } = useAuth();
  const { room, members_list } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friends_list] = useDocumentData(doc(db, "friends", user.uid));
  const [isAdmin, setIsAdmin] = useState(false);
  console.log("friends_list", friends_list);
  console.log("friends", friends_list?.friends);
  console.log("sendRequest", friends_list?.sendRequest);

  useEffect(() => {
    setIsAdmin(false);
    if (room?.admin.includes(user?.uid)) {
      setIsAdmin(true);
    }
  }, [room, user?.uid]);
  console.log("admin = ", isAdmin);


  const handleAddFriends = async (u) => {
    const ref = doc(db, "friends", u.uid);
    console.log("u", u.uid);
    await updateDoc(ref, {
      friendRequest: arrayUnion(user.uid),
    });
    await updateDoc(doc(db, "friends", user.uid), {
      sendRequest: arrayUnion(u.uid),
    });
    Toast({
      title: "Request submitted!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleCancelRequest = async (u) => {

    const ref = doc(db, "friends", u.uid);
    await updateDoc(ref, {
      friendRequest: arrayRemove(user.uid),
    });
    await updateDoc(doc(db, "friends", user.uid), {
      sendRequest: arrayRemove(u.uid),
    });
    Toast({
      title: "Request cancelled!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }

  return (
    <>
      <Flex
        flexGrow={1}
        justifyContent="center"
        _hover={{ cursor: "pointer" }}
        onClick={onOpen}
      >
        <Avatar size="sm" src="" marginEnd={3} />
        <Heading size="lg">{room?.name} </Heading>
      </Flex>
      <Modal
        onClose={onClose}
        size="lg"
        isOpen={isOpen}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room members</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" overflowY="auto">
              {members_list?.map((u, key) => {
                let isFriend = false;
                let isRequestSend = false;
                let isUser = false; 
                let b_g = "#E8E8E8";
                if (u.uid === user.uid) {
                  isUser = true;
                  b_g = "#38B2AC";
                }
                if (friends_list?.friends?.includes(u.uid)) {
                  isFriend = true;
                } else if (friends_list?.sendRequest?.includes(u.uid)) {
                  isRequestSend = true;
                }
                return (
                  <Flex
                    key={key + 1}
                    bg={b_g}
                    w="100%"
                    alignItems="center"
                    color="black"
                    px={3}
                    py={2}
                    mb={2}
                    borderRadius="lg"
                  >
                    <Avatar mr={2} size="md" name={u.name} src={u.photoURL} />
                    <Box>
                      <Text>{u.name}</Text>
                      <Text fontSize="xs">
                        <b>Email : </b>
                        {u.email}
                      </Text>
                    </Box>
                    {isUser ? "" : (isFriend ? 
                    <IconButton
                        ml="auto"
                        variant="outline"
                        size="lg"
                        aria-label="Add to friends"
                        icon={<TbFriends />}
                      />
                    : (isRequestSend ? 
                      <IconButton
                        ml="auto"
                        variant="outline"
                        size="lg"
                        aria-label="Add to friends"
                        onClick={() => handleCancelRequest(u)}
                        icon={<MdCancel />} /> : 
                      <IconButton
                        ml="auto"
                        variant="outline"
                        size="lg"
                        aria-label="Add to friends"
                        onClick={() => handleAddFriends(u)}
                        icon={<AiOutlineUserAdd />}
                      />
                     ))}
                  </Flex>
                );
              })}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
