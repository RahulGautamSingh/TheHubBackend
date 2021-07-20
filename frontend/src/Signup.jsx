import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/core";
import { Link } from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "./background";
import SMContext from "./context";

export default function Signup() {
  let emailRef = useRef();
  let nameRef = useRef();
  let passwordRef = useRef();
  let [error, setError] = useState([false, ""]);
  let history = useHistory();
let context = useContext(SMContext)

  async function submitData() {
    if (validate()) {
      setError([false, ""]);

      let url = "http://localhost:3200/user/signup";
      let obj = {
        username: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      let data = await response.json();
      console.log(data);
      if (response.status === 400) {
        if (typeof data.message === "string") setError([true, data.message]);
        else setError([true, "Error"]);
      } else {
context.dispatch({type:"ADD_TOKENS",payload:data})
        history.push("/feed");
      }
    } else setError([true, "Fill all the fields"]);
  }
  function validate() {
    console.log("validating");
    return (
      emailRef.current.value !== "" &&
      nameRef.current.value !== "" &&
      passwordRef.current.value !== ""
    );
  }

  return (
    <Flex width="full" align="center" justify="center" pt={10}>
      <Background />
      <Box p={2}>
        <Box textAlign="center">
          <Heading>Sign Up</Heading>
        </Box>
        <Box
          my={4}
          p={4}
          textAlign="left"
          style={{ border: "1px solid black", borderRadius: "4px" }}
        >
          <form>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input type="text" placeholder="username" ref={nameRef} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="test@gmail.com" ref={emailRef} />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="*******" ref={passwordRef} />
            </FormControl>
            {error[0] && (
              <Link color="red" fontSize="11px">
                {error[1]}{" "}
              </Link>
            )}

            <Button
              width="full"
              mt={4}
              type="submit"
              mb={4}
              style={{ backgroundColor: "#4287f5" }}
              onClick={(e) => {
                e.preventDefault();
                submitData();
              }}
            >
              Sign Up
            </Button>
          </form>

          <Link href="/login" color="blue" fontSize="11px">
            Already registered?Sign in{" "}
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}
