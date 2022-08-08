import { useAuth } from "../hooks/useAuth";
import { doc, query, collection, updateDoc, arrayRemove } from "firebase/firestore";
import {
  Tooltip,
  Box,
  Avatar,
  Text,
  Flex,
  Heading,
  Stack,
  IconButton,
  Center,
  useToast,
} from "@chakra-ui/react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import FriendRequest from "../components/friends/FriendsRequest";
import FirendsModal from "../components/friends/FriendsModal";
import SendRequest from "../components/friends/SendRequest";
import { AiOutlineUserDelete } from "react-icons/ai";

export default function PageFriends() {
  const { user, db } = useAuth();
  const toast = useToast();

  const [friends_list] = useDocumentData(doc(db, "friends", user?.uid));
  const q = query(collection(db, "users"));
  const [allUsers] = useCollectionData(q);
  const users_list = allUsers?.filter((u) => u.uid !== user.uid);
  const friendsInfo = users_list?.filter((u) =>
    friends_list?.friends.includes(u.uid)
  );

  const handleRemoveFriend = async (person) => {
    await updateDoc(doc(db, "friends", person.uid), {
      friends: arrayRemove(user.uid),
    });
    await updateDoc(doc(db, "friends", user.uid), {
      friends: arrayRemove(person.uid),
    });
    toast({
      title: "Friend removed",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const listLength = friends_list?.friends.length;
  return (
    <Center m="auto">
      <Box p={3}>
        <Heading mb={3}>
          {listLength === 0 ? (
            <div>Number of friend: 0</div>
          ) : (
            <div>Number of friends: {listLength}</div>
          )}
        </Heading>
        <Stack direction="row" spacing="20px" mb={4}>
          <FirendsModal users_list={users_list} friends_list={friends_list}/>
          <FriendRequest users_list={users_list} />
          <SendRequest users_list={users_list} sendRequest={friends_list?.sendRequest}/>
        </Stack>
        <Box width="475px" overflowY="auto" sx={{ scrollbarWidth: "none" }}>
          {friendsInfo?.map((person, index) => (
            <Flex
              key={index + 1}
              bg="#E8E8E8"
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
                <Text>
                  {person.name == null ? "No display name" : person.name}
                </Text>
                <Text fontSize="xs">
                  <b>Email : </b>
                  {person.email}
                </Text>
              </Box>
              <Tooltip label="Remove friend" aria-label="A tooltip">
                <IconButton
                  ml="auto"
                  variant="outline"
                  size="lg"
                  aria-label="Delete friends"
                  icon={<AiOutlineUserDelete />}
                  onClick={(e) => handleRemoveFriend(person)}
                />
              </Tooltip>
            </Flex>
          ))}
        </Box>
      </Box>
    </Center>
  );
}