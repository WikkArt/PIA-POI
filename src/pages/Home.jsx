import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Newgroupbar from "../components/Newgroupbar";

const Home = () => {
    return (
        <div className="home">
            <div className="container">
                <Sidebar/>
                <Chat/>
                <Newgroupbar/>
            </div>
        </div>
    )
}

export default Home