//import { type } from "@testing-library/user-event/dist/type";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {db} from "../firebase";
//import add from "../img/a5.jpg";

const Chats = () => {

    const [chats, setChats] = useState([]);

    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    useEffect(() => {
        // const usersRef = collection(db, "users");
        // const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
        // const unsub = onSnapshot(q, (querySnapshot) => {
        //     let chats = [];
        //     querySnapshot.forEach((doc) => {
        //         chats.push(doc.data());
        //     });
        //     setChats(chats);
        // });
        // return () => unsub();

        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data())
            });
    
            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats()
    }, [currentUser.uid]);

    console.log(Object.entries(chats));
    //console.log(chats);
    
    const handleSelect = (u) => {
        dispatch({type:"CHANGE_USER", payload: u });
    }
    
    return (
        <div className="chats">
            {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
                <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                    <img src={chat[1].userInfo.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                    <div className={`user_status ${chat[1].userInfo.isOnline? "online" : "offline"}`}></div>
                </div>
            ))}
        </div>
    )
}

export default Chats