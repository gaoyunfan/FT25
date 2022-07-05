import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React , { Component }  from "react";

import Navbar from "./NavBar";
import PrivateRoute from "./components/user/PrivateRoute";
import MainPage from "./pages/MainPage";
import PageLogin from "./pages/PageLogin";
import PageReset from "./pages/PageReset";
import PageRegister from "./pages/PageRegister";
import PageFriends from "./pages/PageFriends";
import Modules from "./components/modules/Modules";
import Stopwatch from "./components/timer/Stopwatch";
import Countdown from "./components/timer/Countdown";
import FocusRoom from "./components/rooms/FocusRoom";


export default function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route exact path="/login" element={<PageLogin />} />
          <Route exact path="/reset" element={<PageReset />} />
          <Route exact path="/register" element={<PageRegister />} />
          <Route exact path="/friends" element={<PageFriends />} />
          <Route exact path="/modules" element={<Modules />} />
          <Route exact path="/timer" element={<><Stopwatch/><Countdown/></>} />
          <Route exact path="/focusroom" element={<FocusRoom />} />
          
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
