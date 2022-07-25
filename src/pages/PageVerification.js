import { Button, Center, Flex,  Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PageVerification() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signout();
    navigate("/login")
  };

  useEffect (() => {
    if (user.emailVerified) {
      navigate("/");
    }
  }, [navigate, user.emailVerified])

  console.log("user", user);
  console.log("emailVertified", user.emailVerified);
  return (
    <Center h="40vh">
      <Flex
        rounded="lg"
        padding="30px"
        bg="gray.50"
        direction="column"
        w="40%"
        minW="400px"
        alignItems="center"
      >
        <Text fontWeight="bold">Verify your email to proceed!</Text>
        <Text mt="10px">Email: {user.email}</Text>
        <Button mt="25px" colorScheme="blue" w="65%" onClick={() => window.location.reload(false)}>Vertifed</Button>
        <Button mt="25px" w="65%" onClick={() => handleLogout()}>Sign Out</Button>
      </Flex>
    </Center>
  );
}