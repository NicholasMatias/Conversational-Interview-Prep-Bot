import { useState } from 'react'
import './Folder.css'
import { doc, updateDoc, arrayUnion, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../backend/firebase/firebase.config';
import { useAuth } from '../auth/auth.jsx';

const Folder = ({ folderName }) => {
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcripts, setTranscripts] = useState([]);


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

    const handleOpenModal = async() => {


        getTranscripts();
        console.log("Transcripts:",transcripts)

        setIsModalOpen(true);

    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }


    const openFolder = () => {

    }

    return (
        <>
            <div className='folder' onClick={handleOpenModal}>
                <i className="fa-solid fa-folder"></i>
                <h3 className='folder-name'>{folderName}</h3>
            </div>

            {isModalOpen &&
                <div className='overlay'>
                    <div className='folder-modal-container'>
                        <h1>
                            {`${folderName}'s Transcripts`}
                        </h1>
                        <div className='transcripts-container'>
                            {transcripts?.map((transcriptName, index) => (
                                <li key={index}>{transcriptName}</li>
                            ))}


                        </div>
                        <button onClick={(() => setIsModalOpen(false))}>Close</button>
                    </div>

                </div>


            }

        </>
    )
}

export default Folder