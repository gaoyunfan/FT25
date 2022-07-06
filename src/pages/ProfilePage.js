import { Flex, Center, FormControl, FormLabel, Input, Button, Alert, AlertIcon, AlertDescription, Stack, HStack, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [userName, setUserName] = useState(user.displayName);
  const [password, setPassword] = useState();
  const [passwordCfm, setPasswordCfm] = useState();
  const [error, setError] = useState("");
  let navigate = useNavigate();

  return (
    <Center h="92vh">
      <Flex
        rounded="lg"
        padding="30px"
        bg="gray.50"
        direction="column"
        w="40%"
        minW="400px"
      >
        {error && (
          <Alert status="error" mb="10px">
            <AlertIcon /> <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Text fontWeight="bold" size="xl" mb="10px">Email: {user.email}</Text>
        <FormControl mb="10px">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <FormControl mb="10px">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="name"
            type="password"
            placeholder="Leave blank to keep the same"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl mb="15px">
          <FormLabel htmlFor="passwordCfm">Password Confirmation</FormLabel>
          <Input
            id="name"
            type="password"
            placeholder="Leave blank to keep the same"
            onChange={(e) => setPasswordCfm(e.target.value)}
          />
        </FormControl>
        <Button mb="20px" colorScheme="blue">
          Save
        </Button>
        <Button onClick={() => navigate("/")}>Cancel</Button>
      </Flex>
    </Center>
  );
}