import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Stack,
  Flex,
  Box,
  Spacer,
  Heading,
  Button,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Text,
  Input,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { user, signout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    handleClose();
    signout();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);
  return (
    <Flex
      minWidth="max-content"
      alignItems="flex-center"
      gap="2"
      bg="teal.200"
      padding={2}
    >
      <Box p="2">
        <div>Hi</div>
        <Heading size="md">Study Together</Heading>
      </Box>
      <Button colorScheme="teal" variant="ghost">
        <Link to="/modules">Modules</Link>
      </Button>
      {user && (
        <>
          <Button colorScheme="teal" variant="ghost">
            <Link to="/friends">Friends</Link>
          </Button>
          <Spacer />
          <Menu>
            <MenuButton mr={5}>
              <Tooltip label={user.dsiplayName}>
                <Avatar size="sm" />
              </Tooltip>
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem onClick={onOpen}>Settings</MenuItem>
                <MenuItem onClick={() => signout()}>Sign out</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Settings</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack directoon="row">
                  <Text>Name</Text>
                  <Editable defaultValue={user.dsiplayName}>
                    <EditablePreview />
                    <Input as={EditableInput} />
                  </Editable>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  );
}
