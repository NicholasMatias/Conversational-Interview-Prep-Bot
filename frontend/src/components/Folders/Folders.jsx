import './Folders.css'
import { setDoc, collection, getDoc, doc, getFirestore, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../backend/firebase/firebase.config.js";
import { useAuth } from '../auth/auth.jsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Folder from './Folder.jsx'
import Spacing from '../landing_page/spacing/Spacing.jsx';
import { Spinner } from '@chakra-ui/react'



const Folders = () => {
    const { currentUser } = useAuth();
    const userid = currentUser.uid;
    const [folders, setFolders] = useState([])
    const folderNameRef = useRef(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setFolders(userData.folderNames || [])
            }
            setLoading(false);
        }

        fetchFolders();
    }, [currentUser.uid])

    const handleNewFolder = async (e) => {
        e.preventDefault();
        const folderName = folderNameRef.current.value;


        if (folders.includes(folderName)) {
            setError('A folder with this name already exists.');
            return;
        }
        setError("")

        const thisUserDocRef = doc(db, "users", currentUser.uid);
        try {
            await updateDoc(thisUserDocRef, {
                folderNames: arrayUnion(folderName),
            })
            setFolders([...folders, folderName])

            const newFolderCollectionRef = collection(thisUserDocRef, folderName);

            await setDoc(doc(newFolderCollectionRef, "initial"), {
                createdAt: new Date(),
                name: 'Initial Document'
            })
            folderNameRef.current.value = "";
        }




        catch (error) {
            console.error("Error creating folder:", error);
        }
    }

    const toInterviewPage = () => {
        navigate('/profile')
    }

    return (
        <>
            <Spacing />
            <div className='container'>
                <div className='left-container'>
                    <form onSubmit={handleNewFolder}>
                        <h1>Create a New Folder</h1>
                        <div>
                            <label htmlFor="folderName">Folder Name: </label>
                            <input type="text" placeholder='Enter Folder Name...' id='folderName' name='folderName' ref={folderNameRef} required />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                        <button type="submit" >Create Folder</button>
                    </form>

                    <button onClick={toInterviewPage}>Interview Page</button>
                </div>

                <div className='folder-grid-container'>
                    {loading ? <div className='loading-container'><h3>Loading your folders</h3> <div class="loader"></div></div>
                        :
                        <div className='folders-container'>
                            {folders?.map((folderName, index) => (
                                <Folder key={index} folderName={folderName} />
                            ))}


                        </div>}

                </div>

            </div>
        </>
    )
}

export default Folders