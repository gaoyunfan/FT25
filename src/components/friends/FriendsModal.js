import { doc, updateDoc, arrayUnion } from "firebase/firestore";

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
import { useState } from "react";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";
import { useAuth } from "../../hooks/useAuth";

export default function FirendsModal(props) {
  const { user, db } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const { users_list, friends_list } = props;

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (!query) {
      return;
    }
    console.log("query", query);
    setLoading(true);
    if (query === "" || query === null) {
      return;
    }
    const result = users_list.filter((person) => {
      return person.name?.toLowerCase().startsWith(query.toLowerCase());
    });
    console.log("result", result);
    setSearchResult(result);
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
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setQuery("");
    }
  };
  const handleAddFriends = () => {
    if (!selectedUsers || selectedUsers.length === 0) {
      toast({
        title: "No user to add",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    let error = ""; 
    selectedUsers.forEach((u) => {
      if (friends_list.friends.includes(u.uid)) {
        error = "User already a friend";
        return;
      }
      if (friends_list.sendRequest.includes(u.uid)) {
        error = "Request already sent";
        return;
      }
      if (friends_list.friendRequest.includes(u.uid)) {
        error = "Received user's friend request";
        return;
      }
    })
    if (error) {
      toast ({
        title: error,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
      return;
    }
    console.log("selected", selectedUsers);
    selectedUsers.forEach(async (u) => {
      const ref = doc(db, "friends", u.uid);
      console.log("u", u.uid);
      await updateDoc(ref, {
        friendRequest: arrayUnion(user.uid),
      });
      await updateDoc(doc(db, "friends", user.uid), {
        sendRequest: arrayUnion(u.uid),
      });
    });
    onClose();
    toast({
      title: "Request submitted!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleClose = () => {
    setQuery("");
    setSearchResult([]);
    setSelectedUsers([]);
    onClose();
  }

  return (
    <>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        onClick={onOpen}
      >
        Add friends
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add friend</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={2}>
              <Input
                value={query}
                placeholder="Name of the user e.g. John"
                mb={3}
                onChange={handleSearch}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u, key) => (
                <UserBadgeItem u={u} key={key + 1} handleDelete={() => handleDelete(u)} />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : searchResult.length > 0 ? (
              searchResult
                .slice(0, 5)
                .map((u, key) => (
                  <UserListItem key={key+1} u={u} handleGroup={() => handleGroup(u)} />
                ))
            ) : (
              <Box mt="15px" ml="20px">
                No user found
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleAddFriends()}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
