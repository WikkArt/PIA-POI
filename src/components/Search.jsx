import { collection, query, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {db} from "../firebase";
//import add from "../img/a5.jpg";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const {currentUser} = useContext(AuthContext)

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where ("displayName", "==", username)
        );
        try{
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setUser(doc.data())
            });
        }catch(err){
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        //verificar el gtupo (chats in firestore) existe o no, si existe no crear
        const combineId = 
            currentUser.uid > user.uid 
            ? currentUser.uid + user.uid 
            : user.uid + currentUser.uid;
        try{
            const res = await getDoc(doc(db, "chats", combineId));

            if(!res.exists()){
                //crear un chat en la coleccion de chats
                await setDoc(doc(db, "chats", combineId), {   messages:   []  }   );

                //crear chat de usuario
                /*userChats:{
                    janesid:{
                        combineId:{
                            userInfo{
                                dn, img, id 
                            },
                            lastMessage:"",
                            date:
                        }
                    }
                }*/
                await updateDoc(doc(db, "userChats", currentUser.uid),{
                    [combineId+".userInfo"]:{
                        uid:user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combineId+".date"]: serverTimestamp()
                });
                
                await updateDoc(doc(db, "userChats", user.uid),{
                    [combineId+".userInfo"]:{
                        uid:currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combineId+".date"]: serverTimestamp()
                });
            }
        }catch(err){}
        //Verificar chats de usuarios
        setUser(null);
        setUsername("");
    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type="text"  
                placeholder="Buscar" 
                onKeyDown={handleKey} 
                onChange={(e)=>setUsername(e.target.value)} 
                //value={username}
                />
            </div>
            {err && <span>Usuario no encontrado!</span>}
            {user && (<div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>)}
        </div>
    )
}

export default Search;