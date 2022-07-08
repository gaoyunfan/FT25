import { Progress } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useStorage from "../../hooks/useStorage"

export default function ProgressBar({ file, setFile, isUpload, setIsUpload, imageInputRef}) {
  const { updateProfilePic } = useAuth();
  const { progress, url } = useStorage(file);
  
  useEffect(() => {
    if (url) {
      setFile(null);
      setIsUpload(false);
      updateProfilePic(url);
      imageInputRef.current.value = "";
      console.log("update profile pic")
    }
  }, [url, setFile, setIsUpload, updateProfilePic, imageInputRef]);

  return (
    <Progress value={progress} />
  )
}