import { useAuth } from "../hooks/useAuth";
import RoomModal from "../components/rooms/RoomModal";
import { Text, Box, Flex, Stack, SimpleGrid, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PageRoom() {
  const { user, db } = useAuth();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedRoom, setSelectRoom] = useState("");
  const navigate = useNavigate();

  console.log("user", user);
  console.log("emailVertified", user.emailVerified);

  useEffect(() => {
    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", user?.uid)
    );
    const unsubscribe = onSnapshot(q, (documentSnapShot) => {
      const allGroups = [];
      documentSnapShot.forEach((doc) => {
        allGroups.push(doc.data());
      });
      setGroups(allGroups);
    });

    if (loading) {
      setLoading(false);
    }
    return () => unsubscribe();
  }, [db, user?.uid, loading]);

  console.log("groups", groups);

  const handleSelectRoom = (room) => {
    setSelectRoom(room);
    navigate(`/room/${room.id}`, { state: { r_id: room.id } });
  };

  return (
    <Flex
      flexDir="column"
      p={3}
      bg="white"
      mt="5"
      ml="3"
      w={{ base: "100%", md: "50%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My focus rooms</Text>
        <RoomModal />
      </Flex>
      {groups.length > 0 ? (
        <Stack overflowY="scroll">
          {groups.map((room, index) => (
            <Box
              key={index + 1}
              mb="3"
              onClick={() => handleSelectRoom(room)}
              cursor="pointer"
              _hover={{ background: "#38B2AC", color: "white" }}
              bg={"#E8E8E8"}
              color={"black"}
              px={3}
              py={2}
              borderRadius="lg"
            >
              <Flex alignItems="center" gap="5px">
                <Avatar size="md" src={room?.photoURL} name={room?.name} />
                <Text fontSize="4xl">{room.name}</Text>
              </Flex>
              <SimpleGrid ml={1} columns={2} spacingY="10px">
                <Text>Room size: {room.members?.length}</Text>
                <Text>Room type: {room.status}</Text>
                <Text>Module: {room.moduleCode}</Text>
              </SimpleGrid>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text>No groups created</Text>
      )}
    </Flex>
  );
}
