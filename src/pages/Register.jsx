import React, { useState } from "react";
import add from "../img/AvatarGris.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;    
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        //const auth = getAuth();
        try{
            const res = await createUserWithEmailAndPassword(auth, email, password);
            //const storage = getStorage();
            const storageRef = ref(storage, displayName);

            /*const uploadTask = await uploadBytesResumable(storageRef, file);

            uploadTask.on(
            (error) => {
                setErr(true);
            },*/
            await uploadBytesResumable(storageRef, file).then(() => {
                //getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "users", res.user.uid),{
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL,
                        isOnline: true,
                    });

                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate("/ChooseSection");

                });
            }
            );
        }catch(err){
            setErr(true);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Registro</span>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="File">  
                        <img src={add} alt="" />
                        <span>Agregar foto</span>
                    </label>
                    <input type="text" placeholder="Nombre"/>
                    <input type="email" placeholder="Correo"/>
                    <input type="password" placeholder="Contraseña"/>
                    <input style={{display: "none"}} type="file" id="File"/>
                    <button>Registrarse</button>
                    {err && <span>Paso algo malo...</span>}
                </form>
                <p>¿Ya tienes una cuenta? Inicia sesión <Link to="/login">aquí</Link></p>
            </div>
        </div>
    )
}

export default Register