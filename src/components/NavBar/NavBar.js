import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Flex,
  Box,
  Spacer,
  Heading,
  Button,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { user, signout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

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
        <Link to="/modules">odules</Link>
        </Button>
      {user && (
        <>
        <Button colorScheme="teal" variant="ghost">
        <Link to="/friends">Frien</Link>
        </Button>
      <Spacer />
        <Menu>
          <MenuButton mr={5}>
            <Avatar size="sm" />
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem>My Account</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={() => signout()}>Sign out</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu></>
      )}
    </Flex>
  );
}
