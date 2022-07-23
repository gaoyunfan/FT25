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
import { doc, updateDoc } from "firebase/firestore";

export default function EditRoom(props) {
  const { user, db } = useAuth();
  const { room, name, admin, setAdmin } = props;
  const [roomName, setRoomName] = useState(name);
  const [roomModule, setRoomModule] = useState(room?.moduleCode);
  const [value, setValue] = useState(room?.status);
  const toast = useToast();

  useEffect(() => {
    setRoomModule(room?.moduleCode);
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
    const storageRef = ref(
      projectStorage,
      `rooms/${room?.id}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // eslint-disable-next-line default-case
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log("error", error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          if (room.photoURL) {
            const prevImageRef = ref(projectStorage, room.photoURL);
            deleteObject(prevImageRef)
              .then(() => {
                console.log("prev image deleted");
              })
              .catch((error) => {
                console.log(error);
              });
          }
          console.log("change url");
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
      room.moduleCode === roomModule &&
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
    if (!roomModule || !roomName) {
      toast({
        title: "Empty field exists",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (room.name !== roomName) {
      console.log("change name");
      await updateDoc(doc(db, "groups", room.id), {
        name: roomName,
      });
    }
    if (file) {
      console.log("change pic");
      UploadPic();
    }
    if (room.status !== value) {
      console.log("change status");
      await updateDoc(doc(db, "groups", room.id), {
        status: value,
      });
    }
    if (room.moduleCode !== roomModule) {
      console.log("change module code");
      await updateDoc(doc(db, "groups", room.id), {
        moduleCode: roomModule,
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
    setRoomModule(room.moduleCode);
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
                <Avatar src={room?.photoURL} name={room?.name} _hover={{ cursor: "pointer" }} />
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
                <FormLabel mt={4}>Module</FormLabel>
                <Input
                  value={roomModule}
                  onChange={(e) => {
                    setRoomModule(e.target.value.toUpperCase());
                  }}
                />
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
