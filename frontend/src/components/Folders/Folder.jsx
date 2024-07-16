import { useState } from 'react'
import './Folder.css'



const Folder = ({ folderName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcripts, setTranscripts] = useState([]);

    const handleOpenModal = () => {
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
                        <button onClick={(() => setIsModalOpen(false))}>Close</button>
                    </div>

                </div>


            }

        </>
    )
}

export default Folder