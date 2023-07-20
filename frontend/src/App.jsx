import React from "react";
import ChatPage from "./components/ChatPage";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  const user = !!localStorage.getItem("profile");
  console.log(user);

  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={user ? <HomePage /> : <Navigate to="/Login" />}
          />
          <Route
            path="/SignUp"
            element={user ? <Navigate to="/" /> : <SignUpPage />}
          />
          <Route
            path="/Login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/chat/:userId"
            element={user ? <ChatPage /> : <Navigate to="/Login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
