import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { projectStorage } from "../config/firebaseConfig";
import { useAuth } from "./useAuth";

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const { user } = useAuth();

   
  useEffect(() => {
    // references
    const storageRef = ref(projectStorage, `users/${user.uid}/${file.name}` );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        setError(error);
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (user.photoURL) {
          const prevImageRef = ref(projectStorage, user.photoURL);
          deleteObject(prevImageRef)
          .then(() => {
            console.log("prev image deleted");
          })
          .catch((error) => {
            console.log(error);
          });
          }
          setUrl(downloadURL);
        });
      }
    );
  }, [file, user.uid]);
  return { progress, url, error };
};

export default useStorage;
