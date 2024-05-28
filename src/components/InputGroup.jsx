import React, { useContext, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { obtenerUbicacion } from "../location/location";
import Location from "../img/location.png";

const InputGroup = () => {
    const [ text, setText ] = useState("");
    const [ img, setImg ] = useState(null);
    const [ fileI, setFileI ] = useState("");

    const {currentUser} = useContext(AuthContext)

    const handleSend = async () => {

        if (img){
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    //setErr(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                    //getDownloadURL(storageRef).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", "bMMmPVuboIovWHzzaTas"), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                                photoURL: currentUser.photoURL
                            }),
            
                        });
    
                    });
                }
                );

        }
        else if (fileI){
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, fileI);

            uploadTask.on(
                (error) => {
                    //setErr(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                    //getDownloadURL(storageRef).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", "bMMmPVuboIovWHzzaTas"), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img,
                                file: downloadURL,
                                photoURL: currentUser.photoURL
                            }),
            
                        });
    
                    });
                }
                );

        }else{
            await updateDoc(doc(db, "chats", "bMMmPVuboIovWHzzaTas"), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    photoURL: currentUser.photoURL
                }),

            });
        }

        setText("");
        setImg(null);
        setFileI(null);
    };

    return (
        <div className="input">
            <input type="text" placeholder="Mensaje nuevo..." onChange={e=>setText(e.target.value)} value={text}/>
            <div className="send">
                <input accept="image/*" type="file" style={{display:"none"}} id="img" onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor="img">
                    <img src={Img} alt="" />
                </label>
                <div className="send1">
                    <input accept="file/*" type="file" style={{display:"none"}} id="file" onChange={e=>setFileI(e.target.files[0])}/>
                    <label htmlFor="file">
                        <img src={Attach} alt="" />
                    </label>
                </div>
                <div className="send2">
                    <label onClick={obtenerUbicacion}>
                        <img src={Location} alt="" />
                    </label>
                </div>
            </div>
            <button onClick={handleSend}>Enviar</button>
        </div>
    )
}

export default InputGroup