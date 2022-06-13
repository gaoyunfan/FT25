import { useAuth } from "../../hooks/useAuth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
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
  useToast
} from "@chakra-ui/react";

import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";

export default function ChatRooms() {
  const { user, db } = useAuth();

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false); 

  const handleSearch = async(query) => {
    setSearch(query);
    if (!query)
    {
      return;
    }
    
  };
  return (
    <Box>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
        New Group Chat
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chat name</FormLabel>
              <Input onChange={(e) => setGroupChatName(e.target.value)} placeholder="Chat name" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Add user</FormLabel>
              <Input placeholder="Add users" onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
