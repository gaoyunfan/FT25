import { useAuth } from "./hooks/useAuth";
import Navbar from "./NavBar";
import PageLogin from "./pages/PageLogin";
import PageTodo from "./pages/PageTodo";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      {user ? <PageTodo /> : <PageLogin />}
    </div>
  );
}
