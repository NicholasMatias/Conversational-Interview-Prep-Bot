import "./Intro.css";
import imageOne from "../images_icons/gridOne.png";
import imageTwo from "../images_icons/gridTwo.png";
import imageThree from "../images_icons/gridThree.png";
import imageFour from "../images_icons/gridFour.png";
import imageFive from "../images_icons/gridFive.png";
import imageSix from "../images_icons/gridSix.png";

import { useNavigate } from "react-router-dom";

function Intro() {
    const nav = useNavigate();

    const goToSignup = () => {
        nav("/signup");
    };

    const goToLogin = () => {
        nav("/login");
    };

    const goToAbout = () => {
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <header className="intro-container">
                <h1>Ace Your Next Interview with AI</h1>
                <p>
                    Get ready for interviews with our conversational AI voice
                    bot. Practice and improve your skills anytime, anywhere.
                </p>
                <div className="buttons">
                    <button onClick={goToSignup} className="btn btn-signup">
                        Sign Up Now
                    </button>
                    <button onClick={goToLogin} className="btn btn-login">
                        Login Now
                    </button>
                    <button onClick={goToAbout} className="btn btn-learn-more">
                        Learn More
                    </button>
                </div>
            </header>
            <section className="image-grid">
                <img src={imageOne} alt="Interview practice 1" />
                <img src={imageTwo} alt="Interview practice 2" />
                <img src={imageThree} alt="Interview practice 3" />
                <img src={imageFour} alt="Interview practice 4" />
                <img src={imageFive} alt="Interview practice 5" />
                <img src={imageSix} alt="Interview practice 6" />
            </section>
        </>
    );
}

export default Intro;
