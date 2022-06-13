import { useAuth } from "../../hooks/useAuth"

export default function Friends()
{
  const { user, friends_list} = useAuth();
  return (<>
  hi
  </>);
}