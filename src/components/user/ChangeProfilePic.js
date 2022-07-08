import { Alert, AlertIcon, Button, Flex, Input,  Tooltip } from "@chakra-ui/react";
import { useRef, useState } from "react";
import ProgressBar from "./ProgressBar";


export default function ChangeProfilePic() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUpload, setIsUpload] = useState(false);
  const [disable, setDisable] = useState(false);
  const imageInputRef = useRef();

  const types = ["image/png", "image/jpeg"];

  const handleChange = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      console.log("file selected", File);
      setError("");
      setDisable(false);
    } else {
      setFile(null);
      setError("Please select an image file (png or jpg)");
      setDisable(true);
    }
  };
  const handleSubmit = (e) => {
    setIsUpload(true);
  }

  return (
    <>
    {error && (<Alert margin="auto" w="90%" status='error' h="35px" mb="15px">
      <AlertIcon />
      {error}
    </Alert>)}
    <Flex margin="auto" w="250px" flexDirection="column" gap="20px" mb="15px">
      <Tooltip label="Change profile picture">
        <Input type="file" variant="unstyled" onChange={handleChange} ref={imageInputRef}/>
      </Tooltip>
      <Button w="100" colorScheme="teal" variant="solid" isDisabled={disable} onClick={handleSubmit}>
        Upload
      </Button>
      {file && isUpload && (<ProgressBar file={file} setFile={setFile} isUpload={isUpload} setIsUpload={setIsUpload} imageInputRef={imageInputRef}/>)}
    </Flex>
</>
  );
};

