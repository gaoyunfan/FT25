import { useAuth } from "../hooks/useAuth";
import OAuthButtonGroup from "./OAuthBtoonGroup";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

import {
  Box,
  Button,
  Checkbox,
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
} from "@chakra-ui/react";

import { useAuthState } from "react-firebase-hooks/auth";

import React, { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function PageLogin() {
  const { user, registerWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);
  const onClickReveal = () => setOpen(!isOpen);

  useEffect(() => {
    if (user) navigate("/dashboard");
  });

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
      <Stack spacing="6">
        <Stack
          spacing={{
            base: "2",
            md: "3",
          }}
          textAlign="center"
        >
          <IconButton
            variant="unstyled"
            colorScheme="teal"
            aria-label="back"
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          />
          <Heading
            size={useBreakpointValue({
              base: "xs",
              md: "sm",
            })}
          >
            Sign up for new account
          </Heading>
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              {/*<PasswordField />*/}
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
                    name="password"
                    vaule={password}
                    type={isOpen ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormControl>
            </Stack>
            <HStack justify="space-between"></HStack>
            <Stack spacing="6">
              <Button
                colorScheme="twitter"
                variant="solid"
                onClick={() => registerWithEmailAndPassword(email, password)}
              >
                Sign up
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
