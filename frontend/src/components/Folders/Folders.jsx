import "./Folders.css";

import { setDoc,
    collection,
    getDoc,
    getDocs,
    doc,
    getFirestore,
    deleteDoc,
    arrayRemove,
    updateDoc,
    arrayUnion, } from "firebase/firestore";

import { db } from "../../../../backend/firebase/firebase.config.js";
import { useAuth } from "../auth/auth.jsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Folder from "./Folder.jsx";
import Spacing from "../landing_page/spacing/Spacing.jsx";
import { Spinner } from "@chakra-ui/react";
import { signOut } from "../auth/auth.js";

const Folders = () => {
    const { currentUser } = useAuth();
    const userid = currentUser.uid;
    const [folders, setFolders] = useState([]);
    const folderNameRef = useRef(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // users can delete a folder when in the folder page
    const deleteFolder = async (folderName) => {
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
            // Remove the folder name from the user's folderNames array
            await updateDoc(userDocRef, {
                folderNames: arrayRemove(folderName),
            });

            // Delete all documents within the folder collection
            const folderCollectionRef = collection(userDocRef, folderName);
            const querySnapshot = await getDocs(folderCollectionRef);
            const deletePromises = querySnapshot.docs.map((doc) =>
                deleteDoc(doc.ref)
            );
            await Promise.all(deletePromises);
            // Delete the folder collection itself
            await deleteDoc(doc(userDocRef, folderName));

            // Update the state to remove the folder
            setFolders((prevFolders) =>
                prevFolders.filter((folder) => folder !== folderName)
            );
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    // gets current folders => updates display if folder deleted or added
    useEffect(() => {
        const fetchFolders = async () => {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setFolders(userData.folderNames || []);
            }
            setLoading(false);
        };

        fetchFolders();
    }, [currentUser.uid, folders]);

    // users can create a new folder => must be different name
    const handleNewFolder = async (e) => {
        e.preventDefault();
        const folderName = folderNameRef.current.value;

        if (folders.includes(folderName)) {
            setError("A folder with this name already exists.");
            setTimeout(() => {
                setError("");
            }, 1000);
            return;
        }

        const thisUserDocRef = doc(db, "users", currentUser.uid);
        try {
            await updateDoc(thisUserDocRef, {
                folderNames: arrayUnion(folderName),
            });
            setFolders([...folders, folderName]);

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

    const toInterviewPage = () => {
        navigate("/profile");
    };

    const handleSignout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const toHome = () => {
        navigate("/home");
    };

    const toQuestions = () => {
        navigate("/questions");
    };

    return (
        <div className="folders-page">
            <nav className="navBar-container">
                <div className="navbar">
                    <div className="brand">InterviewMe</div>
                    <ul className="nav-links">
                        <li>
                            <a type="button" onClick={toHome}>
                                Home
                            </a>
                        </li>

                        <li>
                            <a type="button" onClick={toQuestions}>
                                Questions
                            </a>
                        </li>

                        <li>
                            <a type="button" onClick={toInterviewPage}>
                                Interview
                            </a>
                        </li>

                        <li>
                            <a type="button" onClick={handleSignout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <Spacing />
            <div className="container">
                <div className="left-container">
                    <form onSubmit={handleNewFolder}>
                        <h1>Create a New Folder</h1>
                        <div className="form-group">
                            <label htmlFor="folderName">Folder Name: </label>
                            <input
                                className="input-spacing"
                                type="text"
                                placeholder="Enter Folder Name..."
                                id="folderName"
                                name="folderName"
                                ref={folderNameRef}
                                required
                            />
                            {error && <p style={{ color: "black" }}>{error}</p>}
                        </div>
                        <button type="submit" className="create-folder-btn">
                            Create Folder
                        </button>
                    </form>
                </div>

                <div className="folder-grid-container">
                    {loading ? (
                        <div className="loading-container">
                            <h3>Loading your folders</h3>{" "}
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <div className="folders-container">
                            {folders?.map((folderName, index) => (
                                <Folder
                                    key={folderName}
                                    folderName={folderName}
                                    onDelete={() => deleteFolder(folderName)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Folders;
