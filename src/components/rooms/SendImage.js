import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import { projectStorage } from "../../config/firebaseConfig";
import { useAuth } from "../../hooks/useAuth";

export default function SendImage(props) {
  const { newMessage, setNewMessage, sendMessage, roomId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [disable, setDisable] = useState(true);
  const [file, setFile] = useState();
  const fileRef = useRef();
  const textRef = useRef();

  const changeHandler = (e) => {
    setFile(e.target.files[0]);
    setDisable(false);
  };

  const handleChangeText = (e) => {
    setNewMessage(e.target.value);
  };

  const handleUploadImage = (e) => {
    if (!file) {
      return;
    }
    const storageRef = ref(projectStorage, `rooms/${roomId}/${file.name}`);
    setNewMessage(textRef.current);
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          sendMessage(e, downloadURL);
          setDisable(true);
          setFile(null);
          onClose();
        });
      }
    );
  };

  return (
    <>
      <IconButton
        icon={<FiImage />}
        variant="outline"
        onClick={onOpen}
        size="lg"
      />
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl p={2} as="form">
              <Flex direction="column" gap="3px">
                <input
                  type="file"
                  onChange={changeHandler}
                  ref={fileRef}
                  accept="image/png, image/jpeg"
                />
                <FormLabel mt="10px" mb="2px">
                  Add a message about the file
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your message"
                  mb="15px"
                  value={newMessage}
                  onChange={handleChangeText}
                />
                <Button
                  colorScheme="blue"
                  mb="15px"
                  isDisabled={disable}
                  onClick={handleUploadImage}
                >
                  Upload
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    setDisable(true);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
