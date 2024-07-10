import './Folders.css'
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../../../backend/firebase/firebase.config.js";
import { useAuth } from '../auth/auth.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'




const Folders = () => {
    const { currentUser } = useAuth();
    const userid = currentUser.uid;
    const [folders, setFolders] = useState([])
    const navigate = useNavigate();

    const handleNewFolder = async() => {
        const foldersRef = collection(db, "users", userid, `${currentUser.displayName}'s Default Folder`);
        await addDoc(foldersRef, {
            folderName: `${currentUser.displayName}'s Default Folder`,
            createdAt: new Date(),
        })
    }

    const toInterviewPage = () =>{
        navigate('/profile')
    }

    return (
        <>
            <button onClick={handleNewFolder}>Create Folder</button>
            <button onClick={toInterviewPage}>Interview Page</button>
        </>
    )
}

export default Folders