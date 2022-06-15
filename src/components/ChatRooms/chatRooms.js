import { useAuth } from "../../hooks/useAuth";

import {
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";

import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import UserBadgeItem from "../user/UserBadgeItem";
import UserListItem  from "../user/UserListitem";

export default function ChatRooms() {
  const { user, db } = useAuth();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endUser, setEndUser] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    console.log("query");
    console.log(query);
    setLoading(true);
    if (query === "" || query === null) {
      setSearchResult(endUser);
    } else {
      const result = endUser.filter((person) => {
        return person.name?.toLowerCase().startsWith(query.toLowerCase());
      });
      console.log("result");
      console.log(result);
      setSearchResult(result);
    }
    setLoading(false);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel.uid !== delUser.uid));
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  useEffect(() => {
    async function fetch_user() {
      const q = query(collection(db, "users"), where("uid", "!=", user.uid));
      setEndUser([]);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (!endUser.includes(doc.data())) {
          setEndUser((endUser) => [...endUser, doc.data()]);
        }
      });
    }
    fetch_user();
  }, [db, user.uid]);
  console.log("endUser");
  console.log(endUser);
  console.log("selectedUser ", selectedUsers);
  return (
    <Box>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
        New Focus Room
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create foucs room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Room name</FormLabel>
              <Input
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Room name"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Add user</FormLabel>
              <Input placeholder="Add users" onChange={handleSearch} />
            </FormControl>
            {/*<Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  u={u.uid}
                  handleDelete={handleDelete}
                />
              ))}
            </Box>
            */}
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (searchResult.length > 0 ? 
              searchResult.slice(0, 4).map((u) => /*<div>{u.name}</div>*/
              <UserListItem u={u} handleGroup={handleGroup} 
                  />) : <Box mt="15px" ml="20px">No user found</Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
