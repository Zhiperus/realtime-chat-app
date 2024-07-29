import React, { useContext } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {
      return children;
    }
  };

  return (
    <BrowserRouter basename={"/realtime-chat-app"}>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/realtime-chat-app/login" element={<Login />} />
          <Route path="/realtime-chat-app/register" element={<Register />} />
          <Route />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
