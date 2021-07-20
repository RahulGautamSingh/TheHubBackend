import { Flex, Text } from "@chakra-ui/core";
import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SMContext from "./context";
import { Button, Stack} from "@chakra-ui/react";

export default function Feed() {
  let context = useContext(SMContext);
  console.log(context.context);
  let history = useHistory();

async function logout()
{
    let url = "http:/localhost:3200/user/logout"
    await fetch(url,{
        method:"POST",
        headers:{
            "refresh_token":context.context.refresh_token
        }
    })
    localStorage.clear()
    history.push("/login")
}


  useEffect(() => {
    if (context.context.access_token === null) {
      if (localStorage.getItem("access_token") === null) {
        history.push("/login");
      } else {
        let a_t = localStorage.getItem("access_token");
        let r_t = localStorage.getItem("refresh_token");
        context.dispatch({
          type: "ADD_TOKENS",
          payload: { access_token: a_t, refresh_token: r_t },
        });
      }
    } else {
      localStorage.setItem("access_token", context.context.access_token);
      localStorage.setItem("access_token", context.context.refresh_token);
    }
     // eslint-disable-next-line 
  }, []);
  return (
    <Flex direction="column">
      <Flex
        w="100%"
        h="70px"
        p={4}
        style={{ boxShadow: "0 2px 10px 4px rgb(0,0,0,0.3)" }}
        direction="row"
        align="center"
        justify="space-between"
      >
        <Text bgClip="text" fontSize="2xl" fontWeight="extrabold">
          The Hub
        </Text>
        <Stack spacing={10} direction="row" align="center">
          <Button
            width="full"
            p={4}

            color="white"
            style={{ backgroundColor: "#4287f5", borderRadius: "5px" }}
            _hover={{bg: "#b8c6dd"}}
          >
            Profile
          </Button>
          <Button
            width="full"
            type="submit"
            p={4}
            style={{ border: "1px solid black", borderRadius: "5px" }}
            onClick={logout}
          >
            Sign Out
          </Button>
       
        </Stack>
      </Flex>
       
       
        <Flex direction="column" align="center" pt={10}>
        <Text bgClip="text" fontSize="2xl" fontWeight="extrabold">
        No posts to show.Add posts
        </Text>

        </Flex>
    </Flex>
  );
}
