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

import { Link, useNavigate} from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const { user, db, signout } = useAuth();
  const [userData, setUserData] = useState("");

  useEffect(() => {
    async function getUserData() {
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    }
    getUserData();
  }, [db, user?.uid]);

  let navigate = useNavigate();
  const handleLogout = async () => {
    await signout();
    navigate("/login");
  };

  const routeChange = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

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

      {user && user.emailVerified && (
        <>
          <Button
            colorScheme="teal"
            variant="ghost"
            onClick={(e) => routeChange(e, "/modules")}
          >
            Modules
          </Button>
          <Button
            colorScheme="teal"
            variant="ghost"
            onClick={(e) => routeChange(e, "/friends")}
          >
            Friends
          </Button>
          <Button
            colorScheme="teal"
            variant="ghost"
            onClick={(e) => routeChange(e, "/timer")}
          >
            Timer
          </Button>

          <Spacer />
          <Menu>
            <MenuButton
              as={Avatar}
              mr={5}
              src={userData.photoURL}
              size="sm"
              _hover={{
                cursor: "pointer",
              }}
            ></MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem onClick={(e) => routeChange(e, "/profile")}>
                  My Account
                </MenuItem>
                <MenuItem onClick={() => handleLogout()}>Sign out</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </>
      )}
    </Flex>
  );
}
