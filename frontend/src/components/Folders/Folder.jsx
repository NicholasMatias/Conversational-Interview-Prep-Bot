import './Folder.css'



const Folder = ({folderName}) => {
    return (
        <div className='folder'>
            <i className="fa-solid fa-folder"></i>
            <h3 className='folder-name'>{folderName}</h3>
        </div>
    )
}

export default Folder