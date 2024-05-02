import React, { useEffect, useState, useContext } from "react";
import add from "../img/a4.png";
import { collection, getDocs, setDoc, doc/* , serverTimestamp */, Timestamp/* , writeBatch */ } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const Newgroupbar = () => {

    const [usuarios, setUsuarios] = useState([]);

    const {currentUser} = useContext(AuthContext);

    //Trae todos los usuarios en base de datos para mostrarlos y que se puedan agregar
    async function getAllUsuarios() {
        const usuarios = {};
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            usuarios[doc.id] = doc.data();
        });
        return usuarios;
    }

    //Esta funcion va hacer que se actualice la barra cada vez que se inicie sesion con diferente usuario
    useEffect( () => {
            const getUsuarios = async () => {
            try {
                const getUsuarios = await getAllUsuarios();
                setUsuarios(getUsuarios);
            } catch (error) {}
        };
        currentUser.uid && getUsuarios()
    }, [currentUser.uid]);

    //Retorna un arreglo con los usuarios que obtuvimos de firebase
    let listaUsuarios = Object.entries(usuarios);
    //Esto filtra la lista para que el usuario en sesion no se agrege a si mismo
    listaUsuarios = listaUsuarios.filter((us) => us[1].uid !== currentUser.uid);


    //Procesa el formulario, una vez enviado
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const file = e.target[1].value;

        try {
            const storageRef = ref(storage, displayName);
            const GroupUid = uuid();

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await setDoc(doc(db, "groups", GroupUid),{
                        uid: GroupUid,
                        displayName,
                        photoURL : downloadURL,
                        dateCreated : Timestamp.now()
                    });

                    //Agregar los miembros al grupo
                    const usuariosAgregados = [currentUser];
                    listaUsuarios.forEach((u) => {
                        if (document.getElementById(u[1].uid) != null) {
                            if (document.getElementById(u[1].uid).checked) {
                                usuariosAgregados.push(u[1]);
                            }
                        }
                    });

                    /* const batch = writeBatch(db);
                    usuariosAgregados.forEach( (usu) => {
                        const Ref = doc(db, "userChats", usu[1].uid);
                        batch.update(Ref, {
                            [GroupUid+".userInfo"]:{
                                uid:GroupUid,
                                displayName,
                                photoURL: downloadURL,
                            },
                            [GroupUid+".date"]: serverTimestamp()
                        });
                    });
                    await batch.commit(); */

                    navigate("/");

                });
            }
            );

        } catch(err){
            setErr(true);
        }
    };


    return (
        <div className="newgroupbar">
            <span className="title">Crear un grupo</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nombre..."/>
                <input style={{display: "none"}} type="file" id="File"/>
                <label htmlFor="File">  
                    <img src={add} alt="" />
                    <span>Agregar foto</span>
                </label>
                <div className="userslist">
                    {listaUsuarios?.map((usuario) => (
                        <div class="userChat" key={usuario[0]}>
                        <img src={usuario[1].photoURL} alt="" />
                        <div className="userChatInfo">
                            <span>{usuario[1].displayName}</span>
                            <input type="checkbox" id={usuario[1].uid}/>
                        </div>
                        </div>
                    ))}
                </div>
                <button>Crear</button>
                {err && <span>Paso algo malo...</span>}
            </form>
        </div>
    )
}

export default Newgroupbar