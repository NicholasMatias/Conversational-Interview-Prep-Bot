import React, { useState, useRef, useEffect } from "react";
import {
    db,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    setDoc,
    collection,
    addDoc,
} from "../../firebase/firebase.config.js";

import { useAuth } from "../auth/auth.jsx";
import "./SaveModal.css";

const SaveModal = ({ isOpen, onClose, onSave }) => {
    const [transcriptName, setTranscriptName] = useState("");
    const folderNameRef = useRef(null);
    const [error, setError] = useState("");
    const [folders, setFolders] = useState([]);
    const { currentUser } = useAuth();
    const [selectedFolder, setSelectedFolder] = useState( 
        folders[0] || `${currentUser.displayName}'s Default Folder`
    );
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    if (!isOpen) return null;

    // gets folder names so they can be displayed in folder selection drop down
    const fetchFolders = async () => {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            setFolders(userData.folderNames || []);
            
        }
    };
    fetchFolders();

    // users can create a new folder in the save transcript modal
    const handleNewFolder = async (e) => {
        e.preventDefault();
        const folderName = folderNameRef.current.value;

        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 1000);
        if (folders.includes(folderName)) {
            setError("A folder with this name already exists.");
            return;
        }
        setError("");

        const thisUserDocRef = doc(db, "users", currentUser.uid);
        try {
            await updateDoc(thisUserDocRef, {
                folderNames: arrayUnion(folderName),
            });

            const newFolderCollectionRef = collection(
                thisUserDocRef,
                folderName
            );

            await setDoc(doc(newFolderCollectionRef, "initial"), {
                createdAt: new Date(),
                name: "Initial Document",
            });
            folderNameRef.current.value = "";
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    return (
        <div className="overlay">
            <div className="modal">
                <form onSubmit={handleNewFolder}>
                    <h3>Save to a New or Preexisting Folder</h3>
                    <div>
                        <label htmlFor="folderName">Folder Name: </label>
                        <input
                            type="text"
                            placeholder="Enter Folder Name..."
                            id="folderName"
                            name="folderName"
                            ref={folderNameRef}
                            required
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                    <button type="submit">Create Folder</button>
                </form>
                {showSuccessMessage && (
                    <p className="success-message">
                        Folder Created Successfully
                    </p>
                )}
                <div className="form-group save-divider">
                    <label>Save Transcript:</label>
                    <input
                        type="text"
                        placeholder="Enter transcript name"
                        value={transcriptName}
                        onChange={(e) => setTranscriptName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Select Folder:</label>
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
                    
                    <button
                        onClick={() => onSave(transcriptName, selectedFolder)}
                    >
                        Save
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default SaveModal;
