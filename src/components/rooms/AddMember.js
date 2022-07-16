import { AddIcon, CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, FormLabel, Icon, IconButton, Input, Text, useToast } from "@chakra-ui/react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AddMember(props) {
  const { room, allUsers } = props;
  const { db } = useAuth();
  const [searchResult, setSearchResult] = useState([]);
  const [queryres, setQueryres] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = (e) => {
    setQueryres(e.target.value);
    if (!queryres) {
      setSearchResult("");
      return;
    }
    console.log("query", queryres);
    setLoading(true);
    const result = allUsers.filter((person) => {
      return person.name?.toLowerCase().startsWith(queryres.toLowerCase());
    });
    setSearchResult(result);
    setLoading(false);
  };

  const handleAddMember = async (e, u) => {
    e.preventDefault();
    await updateDoc(doc(db, "groups", room?.id), {
      members: arrayUnion(u.uid),
    });
    await updateDoc(doc(db, "users", u.uid), {
      rooms: arrayUnion(room.id),
    });
    toast({
      title: "Member added",
      status: "success",
      durations: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex flexDirection="column">
      <FormLabel>Add members</FormLabel>
      <Input
        value={queryres}
        placeholder="e.g. John"
        mb={3}
        onChange={handleSearch}
      />
      <Flex flexDirection="column">
        {loading ? (
          <div>Loading ...</div>
        ) : searchResult.length > 0 ? (
          searchResult.slice(0, 5).map((u, key) => {
            let isInRoom = false;
            if (room.members.includes(u.uid)) {
              isInRoom = true;
            }
            return (
              <Flex
                key={key + 1}
                bg="#E8E8E8"
                w="100%"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                gap="4px"
                borderRadius="lg"
              >
                <Avatar mr={2} size="md" name={u.name} src={u.photoURL} />
                <Box flexGrow={1}>
                  <Text>{u.name}</Text>
                  <Text fontSize="xs">
                    <b>Email : </b>
                    {u.email}
                  </Text>
                </Box>
                {isInRoom ? (
                  <Icon ml="auto" as={CheckCircleIcon} mr="10px"/>
                ) : (
                  <IconButton
                    ml="auto"
                    variant="outline"
                    size="lg"
                    aria-label="Add to room"
                    icon={<AddIcon />}
                    onClick={(e) => handleAddMember(e, u)}
                  />
                )}
              </Flex>
            );
          })
        ) : (
          <Text>No user found</Text>
        )}
      </Flex>
    </Flex>
  );
}
