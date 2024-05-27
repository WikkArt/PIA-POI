import React, { useContext } from "react";
import Cam from "../img/cam1.png";
import Add from "../img/add1.png";
import More from "../img/more1.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {

    const { data } = useContext(ChatContext);

    const navigate = useNavigate();

    const handleClick= async () => { navigate("/VideoCall"); };

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
                <div className="chatIcons">
                    <img src={Cam} alt="" onClick={handleClick} />
                    <img src={Add} alt="" />
                    <img src={More} alt="" />
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    )
}

export default Chat