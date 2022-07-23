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
  Tooltip,
} from "@chakra-ui/react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const { user, db, signout } = useAuth();
  const [userData, setUserData] = useState("");
  const [path, setPath] = useState("");

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
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/friends") {
      setPath("friends");
    } else if (location.pathname === "/modules") {
      setPath("modules");
    } else if (location.pathname === "/timer") {
      setPath("timer");
    } else if (location.pathname === "/scoreboard") {
      setPath("scoreboard");
    } else {
      setPath("");
    }
  }, [location.pathname]);
  console.log("pathName", path);

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
            bg={path === "modules" ? "whiteAlpha.800" : ""}
          >
            Modules
          </Button>
          <Button
            colorScheme="teal"
            variant="ghost"
            bg={path === "friends" ? "whiteAlpha.800" : ""}
            onClick={(e) => routeChange(e, "/friends")}
          >
            Friends
          </Button>
          <Button
            colorScheme="teal"
            variant="ghost"
            bg={path === "timer" ? "whiteAlpha.800" : ""}
            onClick={(e) => routeChange(e, "/timer")}
          >
            Timer
          </Button>
          <Button
            colorScheme="teal"
            variant="ghost"
            bg={path === "scoreboard" ? "whiteAlpha.800" : ""}
            onClick={(e) => routeChange(e, "/scoreboard")}
          >
          Scoreboard
          </Button>

          <Spacer />
          <Menu>
            <Tooltip label={user.displayName} aria-label="A tooltip">
              <MenuButton
                as={Avatar}
                name={user?.displayName}
                mr={5}
                src={userData.photoURL}
                size="sm"
                _hover={{
                  cursor: "pointer",
                }}
              ></MenuButton>
            </Tooltip>
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
