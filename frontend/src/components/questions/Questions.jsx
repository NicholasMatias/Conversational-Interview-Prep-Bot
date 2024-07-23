import './Questions.css'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../auth/auth'
function Questions() {

    const navigate = useNavigate()

    const toHome = () => {
        navigate('/home')
    }

    const toInterview = () =>{
        navigate('/profile')
    }

    const toFolders = () =>{
        navigate('/folders')
    }

    const handleSignout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    return (
        <>
            <nav className='navBar-container'>
                <div className="navbar">
                    <div className="brand">
                        InterviewMe
                    </div>
                    <ul className="nav-links">
                        <li><a type='button' onClick={toHome}>Home</a></li>

                        <li><a type='button' onClick={toInterview}>Interview</a></li>

                        <li><a type='button' onClick={toFolders}>Folders</a></li>

                        <li><a type='button' onClick={handleSignout} >Logout</a></li>

                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Questions