import { useAuth } from "../hooks/useAuth";
import OAuthButtonGroup from "./OAuthBtoonGroup";
import { Link, useNavigate } from "react-router-dom";

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

export default function PageReset () {
  const { user, sendPasswordReset } = useAuth(); 
  const [email, setEmail] = useState("");

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
      <Stack spacing="8">
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
            </Stack>
            <HStack justify="space-between">
             
            </HStack>
            <Stack spacing="6">
              <Button
                colorScheme="twitter"
                variant="solid"
                onClick={() => sendPasswordReset(email)}
              >
              Reset
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
