import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

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
import ProfilePage from "./pages/ProfilePage";
import PageVerification from "./pages/PageVerification";


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
          <Route exact path="/friends" element={<PrivateRoute><PageFriends /></PrivateRoute>} />
          <Route exact path="/modules" element={<PrivateRoute><Modules /></PrivateRoute>} />
          <Route exact path="/timer" element={<PrivateRoute><><Stopwatch/><Countdown/></></PrivateRoute>} />
          <Route exact path="/focusroom" element={<PrivateRoute><FocusRoom /></PrivateRoute>} />
          <Route exact path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route exact path="/email-verification" element={<PageVerification /> } />
          
          <Route
            path="*"
            element={
              <div style={{ padding: "1rem" }}>
                <p>No page found</p>{" "}
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );


}
