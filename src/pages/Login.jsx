import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
//import add from "../img/a4.png";

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        //const auth = getAuth();
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/ChooseSection");
        }catch(err){
            setErr(true);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Inicio de sesión</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Correo"/>
                    <input type="password" placeholder="Contraseña"/>
                    <button>Iniciar</button>
                    {err && <span>Paso algo malo...</span>}
                </form>
                <p>¿No tienes una cuenta? Regístrate <Link to="/register">aquí</Link></p>
            </div>
        </div>
    );
};

export default Login;