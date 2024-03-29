import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import UserListItem from "../user/UserListItem";

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
  Flex,
  IconButton,
  Avatar,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../../hooks/useAuth";

export default function FriendRequest(props) {
  const { user, db } = useAuth();
  const { users_list } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [request_uid_list] = useDocumentData(doc(db, "friends", user?.uid));
  const request_user = users_list?.filter((u) =>
    request_uid_list?.friendRequest?.includes(u.uid)
  );

  const ownRef = doc(db, "friends", user.uid);
  const handleAccept = async (u) => {
    await updateDoc(ownRef, {
      friends: arrayUnion(u.uid),
    });
    const friend_ref = doc(db, "friends", u.uid);
    await updateDoc(friend_ref, {
      friends: arrayUnion(user.uid),
    });
    handleReject(u);
  };

  const handleReject = async (u) => {
    await updateDoc(ownRef, {
      friendRequest: arrayRemove(u.uid),
    });
    await updateDoc(doc(db, "friends", u.uid), {
      sendRequest: arrayRemove(user.uid),
    });
  };

  return (
    <>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        onClick={onOpen}
      >
        Request received
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Friend request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              // <ChatLoading />
              request_user?.length > 0 ? (
                request_user.map((u, key) => (
                  <Flex
                    key={key + 1}
                    bg="#E8E8E8"
                    w="100%"
                    alignItems="center"
                    color="black"
                    px={3}
                    py={2}
                    mb={2}
                    gap="3px"
                    overflowY="auto"
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
                    <Tooltip label="Accept">
                    <IconButton
                      size="lg"
                      ml="auto"
                      mr={3}
                      variant="outline"
                      icon={<CheckIcon />}
                      onClick={() => handleAccept(u)}
                    /></Tooltip>
                    <Tooltip label="Reject">
                    <IconButton
                      size="lg"
                      ml="auto"
                      variant="outline"
                      icon={<CloseIcon />}
                      onClick={() => handleReject(u)}
                    />
                    </Tooltip>
                  </Flex>
                ))
              ) : (
                <Box mt="15px" ml="20px">
                  No request received.
                </Box>
              )
            }
          </ModalBody>

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