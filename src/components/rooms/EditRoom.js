import { SettingsIcon } from "@chakra-ui/icons";
import {
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormLabel,
  Tooltip,
  Input,
  Avatar,
  Text,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  Box,
  Center,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { projectStorage } from "../../config/firebaseConfig";
import { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export default function EditRoom(props) {
  const { user, db } = useAuth();
  const { room, name, admin, setAdmin } = props;
  const [roomName, setRoomName] = useState(name);
  const [moduleCode, setModuleCode] = useState(room?.moduleCode);
  const [value, setValue] = useState(room?.status);
  const toast = useToast();

  const [codeList, setCodeList] = useState([]);
  const [display, setDisplay] = useState(true);
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
  const chooseCode = (item, e) => {
    e.preventDefault();
    setModuleCode(item);
    setDisplay(true);
  };

  useEffect(() => {
    setModuleCode(room?.moduleCode);
    setValue(room?.status);
    setRoomName(room?.name);
    if (room?.admin.includes(user?.uid)) {
      setAdmin(true);
    }
  }, [
    room?.admin,
    room?.moduleCode,
    room?.name,
    room?.status,
    setAdmin,
    user?.uid,
  ]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const UploadPic = () => {
    const storageRef = ref(projectStorage, `rooms/${room?.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // eslint-disable-next-line default-case
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          if (room.photoURL) {
            const prevImageRef = ref(projectStorage, room.photoURL);
            deleteObject(prevImageRef)
              .then(() => {
              })
              .catch((error) => {
              });
          }
          await updateDoc(doc(db, "groups", room.id), {
            photoURL: downloadURL,
          });
          setFile(null);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    if (
      !file &&
      roomName === room.name &&
      room.moduleCode === moduleCode &&
      room.status === value
    ) {
      toast({
        title: "No change made",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!moduleCode || !roomName) {
      toast({
        title: "Empty field exists",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (room.name !== roomName) {
      await updateDoc(doc(db, "groups", room.id), {
        name: roomName,
      });
    }
    if (file) {
      UploadPic();
    }
    if (room.status !== value) {
      await updateDoc(doc(db, "groups", room.id), {
        status: value,
      });
    }
    if (room.moduleCode !== moduleCode) {
      await updateDoc(doc(db, "groups", room.id), {
        moduleCode: moduleCode,
      });
    }
    onEditClose();
    toast({
      title: "Setting updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClose = (e) => {
    setRoomName(room.name);
    setModuleCode(room.moduleCode);
    setValue(room.status);
    onEditClose();
  };

  return (
    <>
      <MenuItem icon={<SettingsIcon />} onClick={(e) => onEditOpen()}>
        Room setting
      </MenuItem>
      <Modal
        isOpen={isEditOpen}
        closeOnOverlayClick={false}
        isCentered
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room Setting</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Photo</FormLabel>
            <label htmlFor="uploadFile">
              {/*

              <div id="image">SELECT FILES</div>
                */}
              <Tooltip label="Click to upload photo" placement="right">
                <Avatar
                  src={room?.photoURL}
                  name={room?.name}
                  _hover={{ cursor: "pointer" }}
                />
              </Tooltip>
              {file && <Text>{file.name}</Text>}
            </label>
            <input
              type="file"
              id="uploadFile"
              style={{ display: "none" }}
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            <FormLabel mt={4}>Name</FormLabel>
            <Input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            {admin && (
              <>
                <FormControl>
                  <FormLabel>Module code</FormLabel>
                  <Input
                    onInput={(e) => onInput(e.target.value.toUpperCase())}
                    placeholder="e.g. FT1234"
                    value={moduleCode}
                    mb={1}
                    isRequired
                  />
                  <Box
                    className="box"
                    style={{ display: display ? "none" : "" }}
                  >
                    {codeList?.map((item, i) => (
                      <Center
                        style={{
                          display:
                            item.moduleCode?.indexOf(moduleCode) > -1
                              ? ""
                              : "none",
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
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={5} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
