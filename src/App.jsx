import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserImages from "./pages/UserImages";
//import SendSol from './Components/SendSol'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user_images" element={<UserImages />} />
      </Routes>
    </Router>
  );
}

export default App;
