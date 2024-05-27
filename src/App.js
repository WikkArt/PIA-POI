import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatGroup from "./pages/ChatGroup";
import ChooseSection from "./pages/ChooseSection";
import VideoCall from "./pages/VideoCall";
import "./style.scss";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const {currentUser} = useContext(AuthContext)

  const ProtectedRoute =({children}) => {
    if (!currentUser){
      return <Navigate to="/login"/>
    }
    return children;
  };
  
  return (
    
    <BrowserRouter>
      <Routes>
          <Route path="/">
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="videocall" element={<ProtectedRoute><VideoCall/></ProtectedRoute>}/>
            <Route path="choosesection" element={<ProtectedRoute><ChooseSection/></ProtectedRoute>}/>
            <Route path="chatgroup" element={<ProtectedRoute><ChatGroup/></ProtectedRoute>}/>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

