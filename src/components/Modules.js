
  import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, useAuth } from "../hooks/useAuth";
import TaskManager from "./TaskManager";

export default function Modules() {
  // Task state has to be lifted to be at the App level
  // because Header also needs to know the task state to display
  // no. of undone tasks. It cannot be contained within TaskManager
  // as child components cannot pass props to their parent components.
  const [tasks, setTasksState] = useState([]);

  const { user } = useAuth();

  function setTasks(newTasks) {
    setTasksState(newTasks);
    setDoc(doc(db, "tasks", user?.uid), { tasks: newTasks });
  }

  useEffect(() => {
    async function fetchData() {
      const docSnapshot = await getDoc(doc(db, "tasks", user?.uid));
      if (docSnapshot.exists()) {
        setTasksState(docSnapshot.data().tasks);
      } else {
        setTasksState([]);
      }
    }
    fetchData();
  }, [user.uid]);

  return (
    <>
      <main>
        <TaskManager tasks={tasks} setTasks={setTasks} />
      </main>
    </>
  ); 
}

