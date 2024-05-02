import React from "react";
import Navbar from "../components/Navbar";
import Chatroom from "../components/Chatroom";

const ChatGroup = () => {
    return (
        <div className="chatGroup">
            <div className="container">
                <div className="sidebar">
                <Navbar/>
                <p> Chatea con el resto de usuarios de Super Chat </p>
                </div>
                <Chatroom/>
            </div>
        </div>
    )
}

export default ChatGroup