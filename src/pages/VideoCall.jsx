
// No me permitio usar los iconos porque decia que no podia importar algo
// con el nombre de ReactComponent 
/*import { ReactComponent as HangupIcon } from "./img/hangup.png";
import { ReactComponent as MoreVerticalIcon } from "./img/moreVertical.png";
import { ReactComponent as CopyIcon} from "./img/copy.png";*/

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
/* import { v4 as uuid } from "uuid"; */

// Initialize WebRTC
const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.1.google.com:19302",
          "stun:stun2.1.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

const VideoCall = () => {

    const [currentPage, setCurrentPage] = useState("inicioLlamada");
    const [joinCode, setJoinCode] = useState("");

    const navigate = useNavigate();

    const handleClick= async () => { navigate("/"); };

    return (
        <div class="videocall">
            <div className="container">
                <div className="app">
                {currentPage === "inicioLlamada" ? (
                    <Menu
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    setPage={setCurrentPage}
                    />
                ) : (
                    <Videos
                        mode={currentPage}
                        callId={joinCode}
                        setPage={setCurrentPage}
                    />
                )}
                <button onClick={handleClick}>Volver a chats</button>
                </div>
            </div>
        </div> 
    )
}

function Menu({ joinCode, setJoinCode, setPage }) {
    return (
        <div className="inicioLlamada">
        <div className="create box">
            <button onClick={()=>setPage("create")}>Iniciar Llamada</button>
        </div>

        <div className="answer box">
            <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Únete con un código"
            />
            <button onClick={()=>setPage("join")}>Respuesta</button>
        </div>
        </div>
    )
}

function Videos({ mode, callId, setPage}) {
    const [webcamActive, setWebcamActive] = useState(false);
    const [roomId, setRoomId] = useState(callId);
  
    const localRef = useRef();
    const remoteRef = useRef();
  
    const setupSources = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const remoteStream = new MediaStream();
  
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
  
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
  
      localRef.current.srcObject = localStream;
      remoteRef.current.srcObject = remoteStream;
  
      setWebcamActive(true);
  
      if (mode === "create") {
        /* const callDoc = getFirestore.collection("calls").doc();
        const offerCandidates = callDoc.collection("offerCandidates");
        const answerCandidates = callDoc.collection("answerCandidates"); */
        const callDoc = doc(db, "calls","HNpeG0VqSbyUpnDdJoDY");
        const offerCandidates = collection(callDoc, "offerCandidates");
        const answerCandidates = collection(callDoc, "answerCandidates");
  
        setRoomId(callDoc.id);
  
        pc.onicecandidate = (event) => {
          event.candidate &&
            /* offerCandidates.add(event.candidate.toJSON()); */
            addDoc(offerCandidates, event.candidate.toJSON());
        };
  
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
  
        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };
        /* await callDoc.set({ offer }); */
        await setDoc(callDoc, { offer });
        
        /* callDoc.onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (!pc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(
              data.answer
            );
            pc.setRemoteDescription(answerDescription);
          }
        }); */

        onSnapshot(callDoc, (snapshot) => {
          const data = snapshot.data();
          if (!pc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(
              data.answer
            );
            pc.setRemoteDescription(answerDescription);
          }
        });
  
        /* answerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              let data = change.doc.data()
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        }); */

        onSnapshot(answerCandidates, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if(change.type === "added") {
              let data = change.doc.data()
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
      } else if (mode === "join") {
        /* const callDoc = getFirestore.collection("calls").doc(callId);
        const answerCandidates = callDoc.collection("answerCandidates");
        const offerCandidates = callDoc.collection("offerCandidates"); */

        const callDoc = doc(db, "calls", callId);
        const answerCandidates = collection(callDoc, "answerCandidates");
        const offerCandidates = collection(callDoc, "offerCandidates");
  
        pc.onicecandidate = (event) => {
          event.candidate &&
            /* answerCandidates.add(event.candidate.toJSON()); */
           addDoc(answerCandidates, event.candidate.toJSON());
        };
  
        /* const callData = (await callDoc.get()).data(); */
        const callData = (await getDoc(callDoc)).data();
  
        const offerDescription = callData.offer;
        await pc.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
        );
  
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);
  
        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };
  
        /* await callDoc.update({ answer }); */
        await updateDoc(callDoc, { answer });
        
        /* offerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        }); */

        onSnapshot(offerCandidates, (snapshot) => {
          snapshot.docChanges().forEach( (change) => {
            if(change.type === "added") {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
      }
  
      pc.onconnectionstatechange = (event) => {
        if (pc.connectionState === "disconnected") {
          hangUp();
        }
      }
    };
  
    const hangUp = async () => {
      pc.close();
      if (roomId) {
        /* let roomRef = getFirestore.collection("calls").doc(roomId); */
        let roomRef = doc(db, "calls", roomId);
        
        /* await roomRef
          .collection("answerCandidates")
          .get()
          .then((QuerySnapshot) => {
            QuerySnapshot.forEach((doc) => {
              doc.ref.delete();
            });
          }); */

        try{
          const QuerySnapshot = await getDocs(roomRef, "answerCandidates");
          QuerySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
        } catch(err){
            return;
        }
        /* await roomRef
          .collection("offerCandidates")
          .get()
          .then((QuerySnapshot) => {
            QuerySnapshot.forEach((doc) => {
              doc.ref.delete();
            });
          }); */

          try{
            const QuerySnapshot = await getDocs(roomRef, "offerCandidates");
            QuerySnapshot.forEach((doc) => {
              deleteDoc(doc.ref);
            });
          } catch(err){
              return;
          }

        /* await roomRef.delete(); */
        await deleteDoc(roomRef);
      }
      window.Location.reload();
    };
  
    return (
      <div className="videos">
        <video
          ref={localRef}
          autoPlay
          playsInline
          className="local"
          muted
        />
        <video ref={remoteRef} autoPlay playsInline className="remote" />
  
        <div className="buttonsContainer">
          <button
            onClick={hangUp}
            disabled={!webcamActive}
            className="hangup button"
          >
            Colgar
          </button>
          <div tabIndex={0} role="button" className="more button">
            
            <div className="popover">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                }}
              >
                 Copiar código de unión
              </button>
            </div>
          </div>
        </div>
        
        {!webcamActive && (
          <div className="modalContainer">
            <div className="modal">
              <h3>
                Prende tu cámara y micrófono y comienza la llamada
              </h3>
              <div className="container">
                <button
                  onClick={() => setPage("inicioLlamada")}
                  className="secondary"
                >
                  Cancel
                </button>
                <button onClick={setupSources}>Comenzar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
}

export default VideoCall