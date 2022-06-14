import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const { user, db } = useAuth();
  const [friends_list, setFriends_list] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  });

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "friends", user.uid);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        setFriends_list(querySnapshot.data().friends);
      } else {
        setFriends_list("");
      }
    }
    fetchData();
  }, [db, user.uid]);
  /*
  async function test() {
  let element = friends_list[0];
  console.log("uid")
  console.log(element);
  const docRef = doc(db, "users", element);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // eslint-disable-next-line no-const-assign
    console.log(docSnap.data());
  }
}
  test();
  */
  useEffect(() => {
    async function fetch_friends_info() {
      let newobject = [];
      friends_list.forEach(async (element) => {
        console.log("uid");
        console.log(element);
        const docRef = doc(db, "users", element);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // eslint-disable-next-line no-const-assign
          console.log("data");
          console.log(docSnap.data());
          newobject = newobject.concat(docSnap.data());
          console.log("new friend");
          console.log(newobject);
        }
      });
      console.log("final:");
      console.log(newobject);
      setFriendsInfo(newobject);
    }
    fetch_friends_info();
  }, [db, friends_list]);
  console.log("friendInfo:");
  console.log(friendsInfo);
  const listLength = friends_list.length;
  return (
    <>
      {listLength === 0 ? (
        <div>no friends</div>
      ) : (
        <div>
          {listLength} friend{listLength === 1 ? "" : "s"}
        </div>
      )}
      <Box></Box>
    </>
  );
}
