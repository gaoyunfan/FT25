import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, useAuth } from "../../hooks/useAuth";
import ModManager from "./ModManager";
import ModSearch from "./ModSearch";

export default function Modules() {
  // Task state has to be lifted to be at the App level
  // because Header also needs to know the task state to display
  // no. of undone mods. It cannot be contained within TaskManager
  // as child components cannot pass props to their parent components.
  const [mods, setModsState] = useState([]);

  const { user } = useAuth();

  function setMods(newMods) {
    setModsState(newMods);
    setDoc(doc(db, "mods", "common"), { mods: newMods });
  }

  useEffect(() => {
    async function fetchData() {
      const docSnapshot = await getDoc(doc(db, "mods", "common"));
      if (docSnapshot.exists()) {
        setModsState(docSnapshot.data().mods);
      } else {
        setModsState([]);
      }
    }
    fetchData();
  }, [user.uid]);

  return (
    <>
        <ModManager mods={mods} setMods={setMods} />
        <ModSearch  mods={mods} />
    </>
  ); 
}

