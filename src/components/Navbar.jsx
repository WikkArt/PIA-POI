import React, { useContext } from "react";
//import add from "../img/a5.jpg";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";

const Navbar = () => {
    const { currentUser } = useContext(AuthContext)

    const handleSignOut = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false,
        });
        await signOut(auth);
    };

    return (
        <div className="navbar">
            <div className="user">
                <img src={currentUser.photoURL} alt="" />
                <span>{currentUser.displayName}</span>
                <button onClick={handleSignOut}>Salir</button>
            </div>
        </div>
    )
}

export default Navbar