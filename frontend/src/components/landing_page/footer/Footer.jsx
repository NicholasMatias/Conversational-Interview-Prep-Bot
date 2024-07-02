import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© 2024 InterviewMe. All rights reserved.</p>
                <ul className="footer-links">
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Cookie Settings</a></li>
                </ul>
                <div className="social-media">
                    <a href="#"><i className="fa fa-facebook"></i></a>
                    <a href="#"><i className="fa fa-instagram"></i></a>
                    <a href="#"><i className="fa fa-twitter"></i></a>
                    <a href="#"><i className="fa fa-linkedin"></i></a>
                    <a href="#"><i className="fa fa-youtube"></i></a>
                </div>
            </div>
        </footer>

    )
}

export default Footer