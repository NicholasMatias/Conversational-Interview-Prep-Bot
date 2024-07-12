import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../../../backend/firebase/firebase.config.js';
import { doc, updateDoc, arrayUnion, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../auth/auth.jsx';

const SaveModal = ({ isOpen, onClose, onSave }) => {
    const [transcriptName, setTranscriptName] = useState('');
    const folderNameRef = useRef(null);
    const [error, setError] = useState('');
    const [folders, setFolders] = useState([])
    const [selectedFolder, setSelectedFolder] = useState(folders[0] || '');
    const { currentUser } = useAuth();


    if (!isOpen) return null;


        const fetchFolders = async () => {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setFolders(userData.folderNames || [])
            }
        }
        fetchFolders();

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

            const newFolderCollectionRef = collection(thisUserDocRef, folderName);

            await setDoc(doc(newFolderCollectionRef, "initial"), {
                createdAt: new Date(),
                name: 'Initial Document'
            })
            folderNameRef.current.value = "";
            console.log(`Folder ${folderName} created successfully.`);
        }




        catch (error) {
            console.error("Error creating folder:", error);
        }
    }


    return (
        <div className="modal">
            <form onSubmit={handleNewFolder}>
                <h1>Create a New Folder</h1>
                <div>
                    <label htmlFor="folderName">Folder Name: </label>
                    <input type="text" placeholder='Enter Folder Name...' id='folderName' name='folderName' ref={folderNameRef} required />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <button type="submit" >Create Folder</button>
            </form>
            <div className="modal-content">
                <h2>Save Transcript</h2>
                <input
                    type="text"
                    placeholder="Enter transcript name"
                    value={transcriptName}
                    onChange={(e) => setTranscriptName(e.target.value)}
                />
                <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                >
                    {folders.map((folder) => (
                        <option key={folder} value={folder}>
                            {folder}
                        </option>
                    ))}
                </select>
                <button onClick={() => onSave(transcriptName, selectedFolder)}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};


export default SaveModal;



