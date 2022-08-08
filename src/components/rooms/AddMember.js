import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, FormLabel, Icon, IconButton, Input, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useToast } from "@chakra-ui/react";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AddMember(props) {
  const { room, allUsers } = props;
  const { db } = useAuth();
  const [searchResult, setSearchResult] = useState([]);
  const [queryres, setQueryres] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputModCode, setInputModCode] = useState("");
  const toast = useToast();

  const handleSearchUserMod = async (e) => {
    setInputModCode(e.target.value.toUpperCase());
    if (!inputModCode) {
      return;
    }
    const res = e.target.value.toUpperCase();
    setLoading(true);
    const userModRef = collection(db, "user_modList");
    const q = query(userModRef, where("mod_code", "==", res));
    const querySnapshot = await getDocs(q);
    let mod_user_list = [];
    querySnapshot.forEach((doc) => {
      mod_user_list.push(doc.data().uid);
    });
    const result = allUsers.filter((person) => {
      return mod_user_list.includes(person.uid);
    });
    setSearchResult(result);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setQueryres(e.target.value);
    if (!queryres) {
      setSearchResult("");
      return;
    }
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

  const handleTabChange = () => {
    setInputModCode("");
    setQueryres("");
    setSearchResult([]);
  }

  return (
    <Flex flexDirection="column">
      <FormLabel>Add member by</FormLabel>
      <Tabs isFitted variant="enclosed" onChange={handleTabChange}>
        <TabList mb="1em">
          <Tab>module code</Tab>
          <Tab>user name</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Input
              placeholder="Input module code e.g. FT1234"
              mb={3}
              value={inputModCode}
              onChange={handleSearchUserMod}
            />
          </TabPanel>
          <TabPanel>
            <Input
              value={queryres}
              placeholder="e.g. John"
              mb={3}
              onChange={handleSearch}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex flexDirection="column" maxH="200px" overflowY="auto">
        {loading ? (
          <div>Loading ...</div>
        ) : searchResult.length > 0 ? (
          searchResult.map((u, key) => {
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
                mb={3}
                gap="5px"
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
                  <Icon ml="auto" as={CheckCircleIcon} mr="10px" />
                ) : (
                  <Tooltip label="Add user" aria-label="A tooltip">
                    <IconButton
                      ml="auto"
                      variant="outline"
                      size="lg"
                      aria-label="Add to room"
                      icon={<AddIcon />}
                      onClick={(e) => handleAddMember(e, u)}
                    />
                  </Tooltip>
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