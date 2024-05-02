import React from "react";
import Cam from "../img/cam1.png";
import Add from "../img/add1.png";
import More from "../img/more1.png";
import MessagesGroup from "./MessagesGroup";
import InputGroup from "./InputGroup";

const Chatroom = () => {

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>Chat grupal</span>
                <div className="chatIcons">
                    <img src={Cam} alt="" />
                    <img src={Add} alt="" />
                    <img src={More} alt="" />
                </div>
            </div>
            <MessagesGroup/>
            <InputGroup/>
        </div>
    )
}

export default Chatroom