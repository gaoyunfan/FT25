import {
  Avatar,
  AVatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Text,
  Flex,
  Box,
  Spacer,
  Heading,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
import React, { Component }  from "react";

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
        <Heading size="md">
          <Link to="/">StudyTogether</Link>
        </Heading>
      </Box>
      <Button colorScheme="teal" variant="ghost">
        <Link to="/modules">Modules</Link>
      </Button>
      {user && (
        <>
          <Button colorScheme="teal" variant="ghost">
        <Link to="/friends">Friends</Link>
          </Button>


          <Button colorScheme="teal" variant="ghost">
        <Link to="/timer">Timer</Link>
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
          </Menu>
        </>
      )}
    </Flex>
  );
}
