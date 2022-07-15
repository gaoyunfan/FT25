import { Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function RoomInfo () {

  return (
    <>
    <Outlet />
    <Text>Page info</Text>
</>
  )
}