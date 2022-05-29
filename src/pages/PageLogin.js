import { useAuth } from "../hooks/useAuth";
import {
  Box,
  VStack,
  Button,
  ButtonGroup,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";

function PageLogin() {
  const {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    signInWithGoogle,
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    {signin(data.email, data.password)}
  }

  return (
    <Box margin="100px">
      <h1>Login</h1>
      <Button type="button" onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <Input
            type="email"
            plailceholder="email"
            {...register("email", { required: "Please enter Email" })}
          />
          <Input
            type="password"
            placeholder="passoword"
            {...register("password", {
              required: "Please enter Password",
              minLength: { value: 8, message: "Too short" },
            })}
          />
          <Button
            borderRadius="md"
            bg="cyan.600"
            _hover={{ bg: "cyan.200" }}
            variant="ghost"
            type="submit"
          >
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default PageLogin;
