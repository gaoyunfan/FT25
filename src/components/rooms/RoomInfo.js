import { AddIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { doc } from "firebase/firestore";
import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";

export default function RoomInfo(props) {
  const { user, db } = useAuth();
  const { room, members_list } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friends_list] = useDocument(doc(db, "friends", user.uid));
  console.log("friends", friends_list?.friends);

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
      <Modal onClose={onClose} size="lg" isOpen={isOpen} closeOnOverlayClick={false} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room members</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" overflowY="auto">
              {members_list?.map((u, key) => {
                let isFriend = false;
                let b_g = "#E8E8E8";
                if (u.uid === user.uid) {
                  isFriend = true;
                  b_g = "#38B2AC";
                }
                if (friends_list?.friends?.includes(u.uid)) {
                  isFriend = true;
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
                    {!isFriend && (
                      <IconButton
                        ml="auto"
                        variant="unstyled"
                        size="lg"
                        aria-label="Add to friends"
                        icon={<AddIcon />}
                      />
                    )}
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
