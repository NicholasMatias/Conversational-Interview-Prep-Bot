import React, { useState } from 'react';


const SaveModal = ({ isOpen, onClose, onSave, folderNames }) => {
    const [transcriptName, setTranscriptName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(folderNames[0] || '');


    if (!isOpen) return null;


    return (
        <div className="modal">
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
                    {folderNames.map((folder) => (
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



