import { AddIcon } from "@chakra-ui/icons";

import {
  FormControl,
  Input,
  FormLabel,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  MenuItem,
  Button,
  useToast,
} from "@chakra-ui/react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

import UserBadgeItem from "../user/UserBadgeItem";
import UserListItem from "../user/UserListItem";
import { useAuth } from "../../hooks/useAuth";

export default function AddUser(props) {
  const { db } = useAuth();
  const { users_list, r_id, roomMembers } = props;
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [queryres, setQueryres] = useState("");
  const [error, setError] = useState("false");
  const handleSearch = (e) => {
    setQueryres(e.target.value);
    if (!queryres) {
      return;
    }
    console.log("query", queryres);
    setLoading(true);
    if (queryres === "" || queryres === null) {
      return;
    }
    const result = users_list.filter((person) => {
      return person.name?.toLowerCase().startsWith(queryres.toLowerCase());
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
        title: "User already selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setQueryres("");
    }
  };

  const handleAddFriends = () => {
    if (!selectedUsers.length) {
      toast({
        title: "No user to add",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    console.log("selected", selectedUsers);
    selectedUsers.forEach(async (u) => {
      const ref = doc(db, "users", u.uid);
      console.log("u", u.uid);
      await updateDoc(ref, {
        rooms: arrayUnion(r_id),
      });
      const room_ref = doc(db, "groups", r_id);
      await updateDoc(room_ref, {
        members: arrayUnion(u.uid),
      });
    });
    onAddClose();
    toast({
      title: "User added!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  return (
    <>
      <MenuItem icon={<AddIcon />} onClick={(e) => onAddOpen()}>
        Add member
      </MenuItem>
    
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add member</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl mt={2}>
                      <FormLabel>Search user</FormLabel>
                      <Input
                        value={queryres}
                        placeholder="name"
                        mb={3}
                        onChange={handleSearch}
                      />
                    </FormControl>
                    <Box w="100%" d="flex" flexWrap="wrap">
                      {selectedUsers.map((u, temp) => (
                        <UserBadgeItem
                          u={u}
                          key={temp + 1}
                          handleDelete={() => handleDelete(u)}
                        />
                      ))}
                    </Box>
                    {loading ? (
                      // <ChatLoading />
                      <div>Loading...</div>
                    ) : searchResult.length > 0 ? (
                      searchResult
                        .slice(0, 5)
                        .map((u, temp) => (
                          <UserListItem
                            u={u}
                            key={temp + 1}
                            handleGroup={() => handleGroup(u)}
                          />
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