import { useEffect, useState } from 'react'
import './Folder.css'
import { doc, updateDoc, arrayUnion, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../backend/firebase/firebase.config';
import { useAuth } from '../auth/auth.jsx';

const Folder = ({ folderName }) => {
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [currentTranscriptName, setCurrentTranscriptName] = useState("");
    const [transcriptData, setTranscriptData] = useState([]);


    const getTranscripts = async () => {
        const docRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
            console.error("User document could not be found.");
        }
        const userData = userDoc.data();
        const userTranscripts = userData.transcripts;
        const transcriptNames = userTranscripts[folderName];
        setTranscripts(transcriptNames || []);
    }

    const handleOpenModal = async () => {
        getTranscripts();
        setIsModalOpen(true);

    }
    useEffect(() => {
        setTranscripts([]);
    }, [folderName])


    const viewTranscript = async (transcriptName) => {
        setIsModalOpen(false);
        setIsTranscriptOpen(true);
        const userRef = doc(db, "users", currentUser.uid, folderName, transcriptName);
        const currentTranscript = await getDoc(userRef)
        if (!currentTranscript.exists()) {
            console.error("This transcript could not be found.");
        }
        const docData =   currentTranscript.data()
        setCurrentTranscriptName(transcriptName)
        setTranscriptData(docData.transcript)
        // transcriptData.map((message, index) => {
        //     console.log("Message:", message.content);
        // })

        // console.log(docData.transcript);

    }

    return (
        <div>
            <div className='folder' onClick={handleOpenModal}>
                <i className="fa-solid fa-folder"></i>
                <h3 className='folder-name'>{folderName}</h3>
            </div>

            {isModalOpen &&
                <div className='overlay'>
                    <div className='folder-modal-container'>
                        <h1 className='title'>
                            {`${folderName}'s Transcripts`}
                        </h1>
                        <div className='transcripts-container'>
                            {transcripts.length > 0 ? transcripts?.map((transcriptName, index) => (
                                <div key={index} className='transcript-item'>
                                    <h3>- {transcriptName}'s Transcript</h3>
                                    <button onClick={() => viewTranscript(transcriptName)}>view</button>
                                </div>
                            )) :
                                <div>
                                    <h3 className='no-transcripts'>No transcripts saved to this folder.</h3>
                                </div>}


                        </div>
                        <button className="btn-close" onClick={(() => setIsModalOpen(false))}>Close</button>
                    </div>

                </div>
            }

            {
                isTranscriptOpen &&
                <div className='overlay'>
                    <div className='transcript-modal-container'>

                        <h1 className='title'>{currentTranscriptName} Transcript</h1>
                        <div>
                            {transcriptData.length> 0 ? transcriptData?.map((message, index) => {
                                return(
                                <div className="messages-container"key={index}>
                                    <h3 className='messages-transcript'>{message.role==="bot"? "Interviewer:":"You:"}</h3>
                                    <pre className='messages-transcript'>{message.content.trim()}</pre>
                                    {
                                        console.log(message.content)
                                    }
                                </div>
                                )
                                
                            }):
                            <h1>No text in this transcript.</h1>}

                        </div>


                        <button className='btn-close-transcript' onClick={() => setIsTranscriptOpen(false)}>Close</button>

                    </div>
                </div>
            }

        </div>
    )
}

export default Folder