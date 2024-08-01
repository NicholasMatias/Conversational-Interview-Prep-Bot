import { useEffect, useState } from "react";
import "./Folder.css";

import {
    db,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    setDoc,
    collection,
    addDoc,
    arrayRemove,
    deleteDoc,
} from "../../firebase/firebase.config.js";
import { useAuth } from "../auth/auth.jsx";

const Folder = ({ folderName, onDelete }) => {
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [currentTranscriptName, setCurrentTranscriptName] = useState("");
    const [transcriptData, setTranscriptData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingTranscript, setDeletingTranscript] = useState(null);

    // gets transcript names to be displayed in the folder modal
    const getTranscripts = async () => {
        const docRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
            console.error("User document could not be found.");
        }
        const userData = userDoc.data();
        const userTranscripts = userData.transcripts;
        const transcriptNames = userTranscripts[folderName];
        setTranscripts(transcriptNames || []);
    };

    // displays popup => do you really want to delete the folder
    const handleDelete = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(true);
    };

    // deletes folder upon confirmation button click
    const confirmDelete = () => {
        setIsModalOpen(false);
        onDelete();
        setIsDeleteModalOpen(false);
    };

    // cancel in popup => cancels deletion
    const confirmCancel = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    // opens the folder modal
    const handleOpenModal = async () => {
        getTranscripts();
        setIsModalOpen(true);
    };

    useEffect(() => {
        setTranscripts([]);
    }, [folderName]);

    // on view button click => displays transcript in modal
    const viewTranscript = async (transcriptName) => {
        setIsModalOpen(false);
        setIsTranscriptOpen(true);
        const userRef = doc(
            db,
            "users",
            currentUser.uid,
            folderName,
            transcriptName
        );
        const currentTranscript = await getDoc(userRef);
        if (!currentTranscript.exists()) {
            console.error("This transcript could not be found.");
        }
        const docData = currentTranscript.data();
        setCurrentTranscriptName(transcriptName);
        setTranscriptData(docData.transcript);
    };

    // sets which transript is to be deleted.
    const handleDeleteClick = (transcriptName) => {
        setDeletingTranscript(transcriptName);
    };

    // cancels deletion upon cancel button press
    const cancelDelete = () => {
        setDeletingTranscript(null);
    };

    // deletes transcript upon confirmation button click
    const confirmDeleteTranscript = async (transcriptName) => {
        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const folderDocRef = doc(userDocRef, folderName, transcriptName);

            // Delete the transcript document
            await deleteDoc(folderDocRef);

            // Update the transcripts array in the user document
            await updateDoc(userDocRef, {
                [`transcripts.${folderName}`]: arrayRemove(transcriptName),
            });

            // Update the local state
            setTranscripts(transcripts.filter((t) => t !== transcriptName));
            setDeletingTranscript(null);
        } catch (error) {
            console.error("Error deleting transcript:", error);
        }
    };

    // closes modal
    const handleFolderModalClose = () => {
        cancelDelete();
        setIsTranscriptOpen(false);
    };

    return (
        <div>
            <div className="folder" onClick={handleOpenModal}>
                <i className="fa-solid fa-folder folder-icon"></i>
                <h3 className="folder-name">{folderName}</h3>
                {folderName!==`${currentUser.displayName}'s Default Folder`?
                <button className="delete-btn" onClick={handleDelete}>
                    <i className="fa-solid fa-trash"></i>
                </button>:<></>
}
            </div>
            {isModalOpen && !isDeleteModalOpen && (
                <div className="overlay">
                    <div className="folder-modal-container">
                        <h1 className="title">{`${folderName}'s Transcripts`}</h1>
                        <div className="transcripts-container">
                            {transcripts.length > 0 ? (
                                transcripts?.map((transcriptName, index) => (
                                    <div
                                        key={index}
                                        className="transcript-item"
                                    >
                                        <h3>- {transcriptName}'s Transcript</h3>
                                        <div className="transcript-buttons">
                                            <button
                                                onClick={() =>
                                                    viewTranscript(
                                                        transcriptName
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                            {deletingTranscript ===
                                            transcriptName ? (
                                                <>
                                                    <button
                                                        className="cancel-delete-btn"
                                                        onClick={cancelDelete}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="confirm-delete-btn"
                                                        onClick={() =>
                                                            confirmDeleteTranscript(
                                                                transcriptName
                                                            )
                                                        }
                                                    >
                                                        Confirm
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="delete-transcript-btn"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            transcriptName
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <h3 className="no-transcripts">
                                        No transcripts saved to this folder.
                                    </h3>
                                </div>
                            )}
                        </div>
                        <button
                            className="btn-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isTranscriptOpen && (
                <div className="overlay">
                    <div className="transcript-modal-container">
                        <h1 className="title">
                            {currentTranscriptName} Transcript
                        </h1>
                        <div>
                            {transcriptData.length > 0 ? (
                                transcriptData?.map((message, index) => {
                                    return (
                                        <div
                                            className="messages-container"
                                            key={index}
                                        >
                                            <h3 className="messages-transcript">
                                                {message.role === "bot"
                                                    ? "Interviewer:"
                                                    : "You:"}
                                            </h3>
                                            <pre className="messages-transcript">
                                                {message.content.trim()}
                                            </pre>
                                        </div>
                                    );
                                })
                            ) : (
                                <h1>No text in this transcript.</h1>
                            )}
                        </div>

                        <button
                            className="btn-close-transcript"
                            onClick={handleFolderModalClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="overlay">
                    <div className="delete-modal-container">
                        <h2>Are you sure you want to delete this folder?</h2>
                        <p>This action cannot be undone.</p>
                        <div className="button-container">
                            <button
                                className="btn-close-transcript"
                                onClick={confirmCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-close-transcript"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Folder;
