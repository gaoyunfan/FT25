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
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormLabel,
} from "@chakra-ui/react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { TbFriends } from "react-icons/tb";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import AddMember from "./AddMember";

export default function RoomInfo(props) {
  const { user, db } = useAuth();
  const { room, members_list, allUsers } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friends_list] = useDocumentData(doc(db, "friends", user.uid));
  const [isAdmin, setIsAdmin] = useState(false);
  console.log("friends_list", friends_list);
  console.log("friends", friends_list?.friends);
  console.log("sendRequest", friends_list?.sendRequest);

  const toast = useToast();

  useEffect(() => {
    setIsAdmin(false);
    if (room?.admin.includes(user?.uid)) {
      setIsAdmin(true);
    }
  }, [room, user?.uid]);
  console.log("admin = ", isAdmin);

  const handleAddFriends = async (u) => {
    const ref = doc(db, "friends", u.uid);
    await updateDoc(ref, {
      friendRequest: arrayUnion(user.uid),
    });
    await updateDoc(doc(db, "friends", user.uid), {
      sendRequest: arrayUnion(u.uid),
    });
    toast({
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
    toast({
      title: "Request cancelled!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const removeMember = async (u) => {
    await updateDoc(doc(db, "groups", room?.id), {
      members: arrayRemove(u.uid),
    });
    await updateDoc(doc(db, "users", u.uid), {
      rooms: arrayRemove(room.id),
    });
    toast({
      title: "Member removed!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const removeAdmin = async (u) => {
    await updateDoc(doc(db, "groups", room?.id), {
      admin: arrayRemove(u.uid),
    });
    toast({
      title: "Admin removed!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const addAdmin = async (u) => {
    await updateDoc(doc(db, "groups", room?.id), {
      admin: arrayUnion(u.uid),
    });
    toast({
      title: "Admin added!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  return (
    <>
      <Flex
        flexGrow={1}
        justifyContent="center"
        _hover={{ cursor: "pointer",
        bg: '#ebedf0' }}
        onClick={onOpen}
        h="100%"
        alignItems="center"
      >
        <Avatar size="sm" src={room?.photoURL} marginEnd={3} />
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
          <ModalHeader>Room Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Members</FormLabel>
            <Flex flexDirection="column" overflowY="auto" mb="10px">
              {members_list?.map((u, key) => {
                let isFriend = false;
                let isRequestSend = false;
                let isUser = false;
                let b_g = "#E8E8E8";
                let displayAdmin = false;
                if (room?.admin.includes(u.uid)) {
                  displayAdmin = true;
                }
                if (u.uid === user.uid) {
                  isUser = true;
                  b_g = "#38B2AC";
                }
                if (room?.admin.includes(u.uid))
                  if (friends_list?.friends?.includes(u.uid)) {
                    isFriend = true;
                  }
                if (friends_list?.sendRequest?.includes(u.uid)) {
                  isRequestSend = true;
                  console.log("isRequestedSend:", isRequestSend);
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
                    gap="4px"
                    borderRadius="lg"
                  >
                    <Avatar mr={2} size="md" name={u.name} src={u.photoURL} />
                    <Box flexGrow={1}>
                      <Text>{u.name}</Text>
                      <Text fontSize="xs">
                        <b>Email : </b>
                        {u.email}
                      </Text>
                    </Box>
                    {displayAdmin && (
                      <Text ml="auto" fontSize="sm">
                        Admin
                      </Text>
                    )}
                    {isUser ? (
                      ""
                    ) : isFriend ? (
                      <IconButton
                        ml="auto"
                        variant="outline"
                        size="lg"
                        aria-label="Add to friends"
                        icon={<TbFriends />}
                      />
                    ) : isRequestSend ? (
                      <IconButton
                        ml="auto"
                        variant="outline"
                        size="lg"
                        aria-label="Cancel friend request"
                        onClick={() => handleCancelRequest(u)}
                        icon={<MdCancel />}
                      />
                    ) : (
                      <IconButton
                        ml="auto"
                        variant="outline"
                        size="lg"
                        aria-label="Add to friends"
                        onClick={() => handleAddFriends(u)}
                        icon={<AiOutlineUserAdd />}
                      />
                    )}
                    {isUser ? (
                      ""
                    ) : isAdmin ? (
                      <Menu>
                        <MenuButton
                          variant="outline"
                          as={IconButton}
                          icon={<ChevronDownIcon />}
                        />
                        <MenuList>
                          <MenuItem onClick={() => removeMember(u)}>
                            Remove member
                          </MenuItem>
                          {displayAdmin ? (
                            <MenuItem onClick={() => removeAdmin(u)}>
                              Remove admin
                            </MenuItem>
                          ) : (
                            <MenuItem onClick={() => addAdmin(u)}>
                              Add admin
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                    ) : (
                      ""
                    )}
                  </Flex>
                );
              })}
            </Flex>
            <AddMember
              room={room}
              allUsers={allUsers}
            />
          </ModalBody>
          <ModalFooter mt="15px">
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
