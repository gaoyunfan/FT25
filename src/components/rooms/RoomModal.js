import {
  setDoc,
  doc,
  query,
  collection,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  useToast,
  RadioGroup,
  Stack,
  Radio,
  FormLabel,
  Center,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";
import "./RoomModal.css";
export default function RoomModal() {
  const { user, db } = useAuth();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [codeList, setCodeList] = useState([]);
  const [moduleCode, setModuleCode] = useState("");
  const [focusRoomName, setFocusRoomName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endUser, setEndUser] = useState([]);
  const [value, setValue] = useState("public");
  const [queryRes, setQueryRes] = useState("");
  const [inputModCode, setInputModCode] = useState("");

  const [display, setDisplay] = useState(true);

  const handleSearchUserMod = async(e) => {
    e.preventDefault();
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
      mod_user_list.push(doc.data().uid)
     });
     const result = endUser.filter((person) => {
      return mod_user_list.includes(person.uid);
     })
     setSearchResult(result);
     setLoading(false);
  };

  const handleSearch = (e) => {
    setQueryRes(e.target.value);
    if (!queryRes) {
      return;
    }
    setLoading(true);
    if (queryRes === "" || queryRes === null) {
      return;
    }
    const result = endUser.filter((person) => {
      return person.name?.toLowerCase().startsWith(queryRes.toLowerCase());
    });
    setSearchResult(result);
    setLoading(false);
  };

  const onInput = (value) => {
    setModuleCode(value);
    let connect = collection(db, "static_modList");
    getDocs(connect).then((snapshot) => {
      setCodeList(
        snapshot.docs.map((doc) => ({
          moduleCode: doc.data().moduleCode,
        }))
      );
    });
    value && codeList.length > 0 ? setDisplay(false) : setDisplay(true);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel.uid !== delUser.uid));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setQueryRes("");
      setInputModCode("");
    }
  };

  const handleSubmit = async () => {
    if (
      !value ||
      !moduleCode ||
      !focusRoomName ||
      selectedUsers?.length === 0
    ) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const docRef = doc(collection(db, "groups"));
      const all_members = selectedUsers.map((u) => u.uid).concat(user.uid);
      const group = {
        createdAt: new Date(),
        createdBy: user.uid,
        members: all_members,
        id: docRef.id,
        admin: [user.uid],
        name: focusRoomName,
        status: value,
        photoURL: "",
        moduleCode: moduleCode,
      };

      await setDoc(docRef, group);
      all_members.forEach(async (u) => {
        const ref = doc(db, "users", u);
        await updateDoc(ref, {
          rooms: arrayUnion(docRef.id),
        });
      });
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e) {
      toast({
        title: "Failed to Create the Chat!",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"), where("uid", "!=", user.uid));
    const unsubscribe = onSnapshot(q, (documentSnapShot) => {
      const allUsers = [];
      documentSnapShot.forEach((doc) => {
        allUsers.push(doc.data());
      });
      setEndUser(allUsers);
    });

    setLoading(false);
    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, [db, user?.uid]);


  const chooseCode = (item, e) => {
    e.preventDefault();
    setModuleCode(item);
    setDisplay(true);
  };

  const handleClose = () => {
    setModuleCode("");
    setSearchResult([]);
    setSelectedUsers([]);
    setQueryRes("");
    setInputModCode("");
    onClose();
  };
  return (
    <>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
        New Focus Room
      </Button>
      <Modal
        isOpen={isOpen}
        closeOnOverlayClick={false}
        onClose={handleClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create foucs room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY="auto">
            <FormControl>
              <FormLabel>Name </FormLabel>
              <Input
                onChange={(e) => setFocusRoomName(e.target.value)}
                placeholder="Room name"
                mb={1}
                isRequired
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Module code</FormLabel>
              <Input
                onInput={(e) => onInput(e.target.value.toUpperCase())}
                placeholder="e.g. FT1234"
                value={moduleCode}
                mb={1}
                isRequired
              />
              <Box className="box" style={{ display: display ? "none" : "" }}>
                {codeList?.map((item, i) => (
                  <Center
                    style={{
                      display:
                        item.moduleCode?.indexOf(moduleCode) > -1 ? "" : "none",
                    }}
                    key={i}
                    className="center"
                    onClick={(e) => chooseCode(item.moduleCode, e)}
                  >
                    <Text>{item.moduleCode}</Text>
                  </Center>
                ))}
              </Box>
            </FormControl>

            <RadioGroup onChange={setValue} value={value} mt={4}>
              <Stack direction="row">
                <Radio value="public">public</Radio>
                <Radio value="private">private</Radio>
              </Stack>
            </RadioGroup>
            <FormControl mt={3}>
              <FormLabel>Add user by </FormLabel>
              <Tabs isFitted variant="enclosed">
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
                      placeholder="Input user name e.g. John"
                      mb={3}
                      data-testid="user_name_input"
                      id="user_name"
                      value={queryRes}
                      onChange={handleSearch}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem u={u} handleDelete={() => handleDelete(u)} />
              ))}
            </Box>
            <Box maxH="150px" overflowY="auto" data-testid="user_output">
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : searchResult.length > 0 ? (
              searchResult
                .map((u, index) => (
                  <UserListItem key={index + 1} index={index + 1} u={u} handleGroup={() => handleGroup(u)} />
                ))
            ) : (
              <Box mt="15px" ml="20px">
                No user found
              </Box>
            )}</Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create focus room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
