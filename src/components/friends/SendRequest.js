import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  IconButton,
  useDisclosure,
  Tooltip,
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

import { MdCancel } from "react-icons/md"
import { useAuth } from "../../hooks/useAuth";

export default function SendRequest(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { users_list, sendRequest } = props;
  const sentReqUsers = users_list?.filter((u) => sendRequest?.includes(u.uid));
  const toast = useToast();
  const { user, db } = useAuth();

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

  return (
    <>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        onClick={onOpen}
      >
        Request sent
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request sent</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          {
            // <ChatLoading />
            sentReqUsers?.length > 0 ? (
              sentReqUsers.map((u, key) => (
                <Flex
                  key={key + 1}
                  bg="#E8E8E8"
                  w="92%"
                  alignItems="center"
                  color="black"
                  p={2}
                  m="auto"
                  my={2}
                  overflowY="auto"
                  borderRadius="lg"
                >
                  <Avatar mr={3} size="md" name={u.name} src={u.photoURL} />
                  <Box flexGrow={1}>
                    <Text>{u.name}</Text>
                    <Text fontSize="xs">
                      <b>Email : </b>
                      {u.email}
                    </Text>
                  </Box>
                  <Tooltip label="Cancel">
                    <IconButton
                      size="lg"
                      ml="auto"
                      mr={3}
                      variant="outline"
                      aria-label="Cancel friend request"
                      onClick={() => handleCancelRequest(u)}
                      icon={<MdCancel />}
                    />
                  </Tooltip>
                </Flex>
              ))
            ) : (
              <Box mt="15px" ml="20px">
                No request sent.
              </Box>
            )
          }
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
