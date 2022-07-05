import Navbar from "./NavBar";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Component }  from "react";
import Stopwatch from "./components/Timer/Stopwatch";
import Countdown from "./components/Timer/Countdown";




export default function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<MainPage />} />
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
