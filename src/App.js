import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import Navbar from "./NavBar";
import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/MainPage";
import PageLogin from "./pages/PageLogin";
import PageReset from "./pages/PageReset";
import PageRegister from "./pages/PageRegister";
import PageFriends from "./pages/PageFriends";


export default function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/reset" element={<PageReset />} />
          <Route path="/register" element={<PageRegister />} />
          <Route exact path="/friends" element={<PageFriends />} />
          
          <Route
            path="*"
            element={
              <div style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>{" "}
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );


}
