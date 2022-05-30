import { useAuth } from "./hooks/useAuth";
import Navbar from "./NavBar";
import PageLogin from "./pages/PageLogin";
import PageTodo from "./pages/PageTodo";
import PageSignup from "./pages/PageSignup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  const { user } = useAuth();

  return (

    
    <div className="app">
      <Navbar />
      {user ? <PageTodo /> : <><PageLogin /> <PageSignup /> </>}
    </div>
  );
}
