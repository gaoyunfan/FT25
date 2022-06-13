import Navbar from "./NavBar";
import PageLogin from "./pages/PageLogin";
import PageRoom from "./pages/PageRoom";
import PageSignup from "./pages/PageSignup";
import PageReset from "./pages/PageReset";
import Modules from "./components/modules/Modules";
import Friends from "./components/NavBar/Friends";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {

  return (
    <div className="app">
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<PageLogin />} />
        <Route exact path="/register" element={<PageSignup />} />
        <Route exact path="/modules" element={<Modules />} />
        <Route exact path="/resetPassword" element={<PageReset />} />
        <Route exact path="/dashboard" element={<PageRoom />} />
        <Route exact path="/friends" element={<Friends />} />
      </Routes>
    </Router>
  </div> );




   /* <div className="app">
      <Navbar />
      {user ? <PageTodo /> : <><PageLogin /> <PageSignup /> </>}
    </div>
  */
}
