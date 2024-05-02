import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import MessageGroup from "./MessageGroup";

const MessagesGroup = () => {
    const [messages, setMessages] = useState([])

    useEffect (() => {
        const unSub = onSnapshot(doc(db, "chats", "bMMmPVuboIovWHzzaTas"), (doc)=>{
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => {
            unSub()
        }
    })

    return (
        <div className="messages">
            {messages.map((m)=>(
                <MessageGroup message ={m} key={m.id}/>
            ))}
        </div>
    )
}

export default MessagesGroup