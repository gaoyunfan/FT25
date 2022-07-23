import {
  Flex,
  Center,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  useToast,
  Avatar,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ChangeProfilePic from "../components/user/ChangeProfilePic";

export default function ProfilePage() {

  const { db, user, updateDisplayName, changePassword } =
    useAuth();
  const [userName, setUserName] = useState(user.displayName);
  const [password, setPassword] = useState("");
  const [passwordCfm, setPasswordCfm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const toast = useToast();
  let navigate = useNavigate();

  const [userData] = useDocumentData(doc(db, "users", user.uid));

  console.log("userData", userData);
  console.log("user", user)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordCfm) {
      setError("Password do not match");
      return;
    }
    if (userName.length === 0) {
      setUserName(user.displayName);
      return setError("User name cannot be empty");
    }
    if (password.length < 8 && password.length > 0) {
      return setError("Password must contain at least 8 numbers / characters");
    }

    const promises = [];
    setLoading(true);

    if (userName !== user.displayName) {
      promises.push(updateDisplayName(userName));
    }
    if (password.length !== 0) {
      promises.push(changePassword(password));
    }
    if (promises.length !== 0) {
      Promise.all(promises)
        .then(() => {
          toast({
            title: " Profile updated.",
            status: "success",
            duration: 6000,
            isClosable: true,
          });
          navigate("/");
        })
        .catch((e) => {
          alert(e);
          setError("Failed to update account");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast({
        title: " Nothing to update.",
        status: "warning",
        duration: 6000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Center h="92vh">
      <Flex
        rounded="lg"
        padding="30px"
        bg="gray.50"
        direction="column"
        w="40%"
        minW="400px"
        height="80vh"
        overflowY="auto"
      >
        {error && (
          <Alert status="error" mb="10px">
            <AlertIcon /> <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Stack margin="auto" spacing="3px" w="200px" mb="10px">
          <Avatar ml="35%" src={userData?.photoURL} name={userData.name} />
          <Text ml="5%" fontWeight="bold" size="xl" mb="10px">
            {user.email}
          </Text>
        </Stack>
        <ChangeProfilePic userData={userData} />
        <FormControl mb="10px">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        {userData?.authProvider === "local" && (
          <>
            <FormControl mb="10px">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Leave blank to keep the same"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mb="20px">
              <FormLabel htmlFor="passwordCfm">Password Confirmation</FormLabel>
              <Input
                id="passwordcfm"
                type="password"
                placeholder="Leave blank to keep the same"
                onChange={(e) => setPasswordCfm(e.target.value)}
              />
            </FormControl>
          </>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          mb="20px"
          colorScheme="blue"
        >
          Save
        </Button>
        <Button onClick={() => navigate("/")}>Cancel</Button>
      </Flex>
    </Center>
  );
}
