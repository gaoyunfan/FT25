import { Progress } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useStorage from "../../hooks/useStorage"

export default function ProgressBar({ file, setFile, setIsUpload, imageInputRef }) {
  const { db, user, updateProfilePic } = useAuth();
  const { progress, url } = useStorage(file);
  
  useEffect(() => {
    if (url) {
      setFile(null);
      setIsUpload(false);
      updateProfilePic(url);

      updateDoc(doc(db,"users", user.uid), {
        photoName: file.name
      }).then(() => {
      });
      imageInputRef.current.value = "";
    }
  }, [url, setFile, setIsUpload, updateProfilePic, imageInputRef, db, file.name, user.uid]);

  return (
    <Progress value={progress} />
  )
}