import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { Box, Avatar, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { Component }  from "react";

export default function Friends() {
  const { user, db } = useAuth();
  const [friends_list, setFriends_list] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  },[navigate, user]);

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "friends", user.uid);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        setFriends_list(querySnapshot.data().friends);
      } else {
        setFriends_list("");
      }
    }
    fetchData();
  }, [db, user.uid]);
  /*
  async function test() {
  let element = friends_list[0];
  console.log("uid")
  console.log(element);
  const docRef = doc(db, "users", element);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // eslint-disable-next-line no-const-assign
    console.log(docSnap.data());
  }
}
  test();
  */
  useEffect(() => {
    async function fetch_friends_info() {
      setFriendsInfo([]);
      friends_list.forEach(async (element) => {
        console.log("uid");
        console.log(element);
        const docRef = doc(db, "users", element);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // eslint-disable-next-line no-const-assign
          console.log("data");
          console.log(docSnap.data());
          setFriendsInfo((friendsInfo) => [...friendsInfo, docSnap.data()]);
        } else {
          console.log("error");
        }
      });
    }
    fetch_friends_info();
  }, [db, friends_list]);

  console.log("friendInfo:");
  console.log(friendsInfo);
  const listLength = friends_list.length;
  return (
    <>
      {listLength === 0 ? (
        <div>no friends</div>
      ) : (
        <div>
          {listLength} friend{listLength === 1 ? "" : "s"}
        </div>
      )}
      <Box width="400px">
        {friendsInfo.map((person) => (
          <Flex
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
              background: "#38B2AC",
              color: "white",
            }}
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
          >
            <Avatar
              mr={2}
              size="sm"
              cursor="pointer"
              name={person.name}
              src={person.photoURL}
            />
            <Box>
              <Text>{person.name == null ? "No display name" : person.name}</Text>
              <Text fontSize="xs">
                <b>Email : </b>
                {person.email}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </>
  );
}
