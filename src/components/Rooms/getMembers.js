import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function GetMembers(db, id) {

    const [user_detail] = useDocumentData(doc(db, "users", id));
    return user_detail;
}