import { useAuth } from "./hooks/useAuth";
import Navbar from "./NavBar";
import PageLogin from "./pages/PageLogin";
import PageTodo from "./pages/PageTodo";
import PageSignup from "./pages/PageSignup";
import PageReset from "./pages/PageReset";
import Modules from "./components/Modules";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  const { user } = useAuth();

  return (

    <div className="app">
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<PageLogin />} />
        <Route exact path="/register" element={<PageSignup />} />
        <Route exact path="/modules" element={<Modules />} />
        <Route exact path="/resetPassword" element={<PageReset />} />
        <Route exact path="/dashboard" element={<PageTodo />} />
      </Routes>
    </Router>
  </div> );




   /* <div className="app">
      <Navbar />
      {user ? <PageTodo /> : <><PageLogin /> <PageSignup /> </>}
    </div>
  */
}
