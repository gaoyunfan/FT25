import { useAuth } from "../hooks/useAuth";
import GoogleLogIn from "../components/user/GoogleLogIn";
import React, { useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
} from "@chakra-ui/react";


import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link as ReachLink, useNavigate } from "react-router-dom";

export default function PageLogin() {
  const { logInWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isdisabled, setIsDisabled] = useState(true)
  const onClickReveal = () => setOpen(!isOpen);
  let navigate = useNavigate();

  const handleSignIn = async(e) => {
    e.preventDefault();
    await logInWithEmailAndPassword(email, password);
    navigate("/");
  };

  const handleEmailInput = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
    if (e.target.value.length < 1 || password.length < 1) {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }
  }
  const handlePasswordInput = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
    if (e.target.value.length < 1 || email.length < 1) {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }
  }

  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading
              size={useBreakpointValue({
                base: "xs",
                md: "sm",
              })}
            >
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Don't have an account?</Text>
              <Link color="blue" as={ReachLink} to="/register">
              Sign up now !
              </Link>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={useBreakpointValue({
            base: "transparent",
            sm: "bg-surface",
          })}
          boxShadow={{
            base: "none",
            sm: useColorModeValue("md", "md-dark"),
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      variant="link"
                      aria-label={isOpen ? "Mask password" : "Reveal password"}
                      icon={isOpen ? <HiEyeOff /> : <HiEye />}
                      onClick={onClickReveal}
                    />
                  </InputRightElement>
                  <Input
                    id="password"
                    vaule={password}
                    name="password"
                    data-testid="password"
                    type={isOpen ? "text" : "password"}
                    onChange={handlePasswordInput}
                    required
                  />
                </InputGroup>
              </FormControl>
            </Stack>
            <HStack justify="space-between">
              <Link color="blue" as={ReachLink} to="/reset">
                Forgot password?
              </Link>
            </HStack>
            <Stack spacing="6">
              <Button
              data-testid="submit"
                colorScheme="twitter"
                variant="solid"
                onClick={(e) => handleSignIn(e)}
                disabled={isdisabled}
              >
                Sign in
              </Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              <GoogleLogIn />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}