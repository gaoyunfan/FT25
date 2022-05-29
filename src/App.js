import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from './hooks/useAuth';
import Navbar from "./NavBar";
import PageLogin from './pages/PageLogin';
import PageTodo from './pages/PageTodo';

export default function App() {
  const { user } = useAuth();

 return <div className="app">
  <Router>
    <Routes>
      <Route exact path="/" component={PageLogin} />
    </Routes>
  </Router>


  <Navbar />
  {user ? <PageTodo /> : <PageLogin />}</div>
};
